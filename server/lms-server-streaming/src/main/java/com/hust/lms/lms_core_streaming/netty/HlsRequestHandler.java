package com.hust.lms.lms_core_streaming.netty;

import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static io.netty.handler.codec.http.HttpHeaderNames.*;
import static io.netty.handler.codec.http.HttpHeaderValues.KEEP_ALIVE;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;

/**
 * Handler chính của Netty streaming server.
 *
 * Nhiệm vụ:
 * 1. nhận request /hls/{ownerId}/{videoId}/{fileName}?token=...
 * 2. verify token
 * 3. check ownerId/videoId trong path có khớp token không
 * 4. nếu hợp lệ -> lấy file từ MinIO production và trả về
 * 5. nếu sai -> trả 401 / 403 / 404
 */
public class HlsRequestHandler extends SimpleChannelInboundHandler<FullHttpRequest> {

  private final HlsObjectService hlsObjectService;
  private final PlaybackTokenValidator playbackTokenValidator;

  public HlsRequestHandler(
      HlsObjectService hlsObjectService,
      PlaybackTokenValidator playbackTokenValidator
  ) {
    this.hlsObjectService = hlsObjectService;
    this.playbackTokenValidator = playbackTokenValidator;
  }

  @Override
  protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) {
    if (!request.decoderResult().isSuccess()) {
      writeError(ctx, HttpResponseStatus.BAD_REQUEST, "Invalid HTTP request");
      return;
    }

    String rawUri = URLDecoder.decode(request.uri(), StandardCharsets.UTF_8);

    // Tách query param khỏi path
    String pathOnly = rawUri;
    String queryString = "";
    int queryIndex = rawUri.indexOf('?');
    if (queryIndex >= 0) {
      pathOnly = rawUri.substring(0, queryIndex);
      queryString = rawUri.substring(queryIndex + 1);
    }

    if (!pathOnly.startsWith("/hls/")) {
      writeError(ctx, HttpResponseStatus.NOT_FOUND, "Unsupported path");
      return;
    }

    // Path mong muốn:
    // /hls/{ownerId}/{videoId}/{fileName}
    String path = pathOnly.substring("/hls/".length());
    String[] parts = path.split("/");

    if (parts.length < 3) {
      writeError(ctx, HttpResponseStatus.BAD_REQUEST,
          "Path must be /hls/{ownerId}/{videoId}/{fileName}");
      return;
    }

    String ownerId = parts[0];
    String videoId = parts[1];
    String fileName = parts[2];

    // Parse token từ query param
    Map<String, String> queryParams = parseQuery(queryString);
    String token = queryParams.get("token");

    if (token == null || token.isBlank()) {
      writeError(ctx, HttpResponseStatus.UNAUTHORIZED, "Missing playback token");
      return;
    }

    PlaybackTokenPayload payload;
    try {
      payload = playbackTokenValidator.validate(token);
    } catch (Exception e) {
      writeError(ctx, HttpResponseStatus.UNAUTHORIZED, "Invalid playback token");
      return;
    }

    // Check token có đúng video/path đang request không
    if (!ownerId.equals(payload.getOwnerId()) || !videoId.equals(payload.getVideoId())) {
      writeError(ctx, HttpResponseStatus.FORBIDDEN, "Token does not match requested resource");
      return;
    }

    try {
      byte[] content = hlsObjectService.getObjectBytes(ownerId, videoId, fileName);
      String contentType = hlsObjectService.getContentType(fileName);

      FullHttpResponse response = new DefaultFullHttpResponse(
          HTTP_1_1,
          HttpResponseStatus.OK,
          Unpooled.wrappedBuffer(content)
      );

      response.headers().set(CONTENT_TYPE, contentType);
      response.headers().set(CONTENT_LENGTH, content.length);
      response.headers().set(ACCESS_CONTROL_ALLOW_ORIGIN, "*");

      // Playlist cache ngắn, segment cache dài hơn một chút
      if (fileName.endsWith(".m3u8")) {
        response.headers().set(CACHE_CONTROL, "public, max-age=3");
      } else {
        response.headers().set(CACHE_CONTROL, "public, max-age=60");
      }

      if (HttpUtil.isKeepAlive(request)) {
        response.headers().set(CONNECTION, KEEP_ALIVE);
      }

      var future = ctx.writeAndFlush(response);
      if (!HttpUtil.isKeepAlive(request)) {
        future.addListener(ChannelFutureListener.CLOSE);
      }

    } catch (Exception e) {
      writeError(ctx, HttpResponseStatus.NOT_FOUND, "HLS object not found");
    }
  }

  /**
   * Parse query string kiểu token=abc&x=1
   */
  private Map<String, String> parseQuery(String queryString) {
    Map<String, String> result = new HashMap<>();
    if (queryString == null || queryString.isBlank()) {
      return result;
    }

    String[] pairs = queryString.split("&");
    for (String pair : pairs) {
      String[] kv = pair.split("=", 2);
      if (kv.length == 2) {
        result.put(kv[0], kv[1]);
      }
    }
    return result;
  }

  private void writeError(ChannelHandlerContext ctx, HttpResponseStatus status, String message) {
    byte[] bytes = message.getBytes(StandardCharsets.UTF_8);

    FullHttpResponse response = new DefaultFullHttpResponse(
        HTTP_1_1,
        status,
        Unpooled.wrappedBuffer(bytes)
    );
    response.headers().set(CONTENT_TYPE, "text/plain; charset=UTF-8");
    response.headers().set(CONTENT_LENGTH, bytes.length);

    ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
  }
}