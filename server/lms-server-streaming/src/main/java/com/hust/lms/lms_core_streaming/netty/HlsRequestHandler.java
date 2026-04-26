package com.hust.lms.lms_core_streaming.netty;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.lms.lms_core_streaming.dto.ErrorResponse;
import com.hust.lms.lms_core_streaming.dto.PlaybackTokenPayload;
import com.hust.lms.lms_core_streaming.service.HlsObjectService;
import com.hust.lms.lms_core_streaming.service.PlaybackTokenValidator;
import com.hust.lms.lms_core_streaming.service.ShortLinkResolverService;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.FullHttpResponse;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.HttpUtil;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static io.netty.handler.codec.http.HttpHeaderNames.ACCESS_CONTROL_ALLOW_ORIGIN;
import static io.netty.handler.codec.http.HttpHeaderNames.CACHE_CONTROL;
import static io.netty.handler.codec.http.HttpHeaderNames.CONNECTION;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_LENGTH;
import static io.netty.handler.codec.http.HttpHeaderNames.CONTENT_TYPE;
import static io.netty.handler.codec.http.HttpHeaderValues.KEEP_ALIVE;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;

/**
 * Handler chính của Netty streaming server.
 *
 * URL mới:
 *   /hls/{shortId}/{fileName}?token=...
 *
 * Flow:
 * 1. nhận request /hls/{shortId}/{fileName}?token=...
 * 2. verify playback token
 * 3. resolve shortId -> hlsPrefix thật
 * 4. build objectKey = hlsPrefix + fileName
 * 5. lấy file từ MinIO production và trả về
 */
public class HlsRequestHandler extends SimpleChannelInboundHandler<FullHttpRequest> {

  private final HlsObjectService hlsObjectService;
  private final PlaybackTokenValidator playbackTokenValidator;
  private final ShortLinkResolverService shortLinkResolverService;
  private final ObjectMapper objectMapper;

  public HlsRequestHandler(
          HlsObjectService hlsObjectService,
          PlaybackTokenValidator playbackTokenValidator,
          ShortLinkResolverService shortLinkResolverService,
          ObjectMapper objectMapper
  ) {
    this.hlsObjectService = hlsObjectService;
    this.playbackTokenValidator = playbackTokenValidator;
    this.shortLinkResolverService = shortLinkResolverService;
    this.objectMapper = objectMapper;
  }

  @Override
  protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest request) {
    if (!request.decoderResult().isSuccess()) {
      writeError(ctx, HttpResponseStatus.BAD_REQUEST, "Invalid HTTP request");
      return;
    }

    String rawUri = URLDecoder.decode(request.uri(), StandardCharsets.UTF_8);

    // tách query string khỏi path
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

    // Path mới:
    // /hls/{shortId}/{fileName}
    String path = pathOnly.substring("/hls/".length());
    String[] parts = path.split("/");

    if (parts.length < 2) {
      writeError(ctx, HttpResponseStatus.BAD_REQUEST,
              "Path must be /hls/{shortId}/{fileName}");
      return;
    }

    String shortLink = parts[0];
    String fileName = parts[1];

    // parse token từ query param
    Map<String, String> queryParams = parseQuery(queryString);
    String token = queryParams.get("token");

    if (token == null || token.isBlank()) {
      writeError(ctx, HttpResponseStatus.UNAUTHORIZED, "Missing playback token");
      return;
    }

    try {
      // verify token
      PlaybackTokenPayload payload = playbackTokenValidator.validate(token);

      if (payload == null) {
        writeError(ctx, HttpResponseStatus.UNAUTHORIZED, "Invalid playback token");
        return;
      }

      String hlsPrefix = shortLinkResolverService.resolvePrefix(shortLink);

      String objectKey = hlsPrefix + fileName;

      // lấy file từ MinIO
      byte[] content = hlsObjectService.getObjectBytesByKey(objectKey);
      String contentType = hlsObjectService.getContentType(fileName);

      FullHttpResponse response = new DefaultFullHttpResponse(
              HTTP_1_1,
              HttpResponseStatus.OK,
              Unpooled.wrappedBuffer(content)
      );

      response.headers().set(CONTENT_TYPE, contentType);
      response.headers().set(CONTENT_LENGTH, content.length);
      response.headers().set(ACCESS_CONTROL_ALLOW_ORIGIN, "*");

      // playlist cache ngắn, segment cache dài hơn
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

    } catch (RuntimeException e) {
      writeError(ctx, HttpResponseStatus.NOT_FOUND, e.getMessage() != null ? e.getMessage() : "HLS object not found");
    } catch (Exception e) {
      writeError(ctx, HttpResponseStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  /**
   * Parse query string kiểu:
   * token=abc&x=1
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

  /**
   * Trả lỗi JSON thống nhất cho client.
   */
  private void writeError(ChannelHandlerContext ctx, HttpResponseStatus status, String message) {
    try {
      ErrorResponse error = ErrorResponse.builder()
              .code(status.code())
              .message(message)
              .timestamp(LocalDateTime.now())
              .build();

      byte[] bytes = objectMapper.writeValueAsBytes(error);

      FullHttpResponse response = new DefaultFullHttpResponse(
              HTTP_1_1,
              status,
              Unpooled.wrappedBuffer(bytes)
      );

      response.headers().set(CONTENT_TYPE, "application/json; charset=UTF-8");
      response.headers().set(CONTENT_LENGTH, bytes.length);

      ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);

    } catch (Exception e) {
      byte[] bytes = message.getBytes(StandardCharsets.UTF_8);

      FullHttpResponse response = new DefaultFullHttpResponse(
              HTTP_1_1,
              HttpResponseStatus.INTERNAL_SERVER_ERROR,
              Unpooled.wrappedBuffer(bytes)
      );

      response.headers().set(CONTENT_TYPE, "text/plain; charset=UTF-8");
      response.headers().set(CONTENT_LENGTH, bytes.length);

      ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }
  }
}