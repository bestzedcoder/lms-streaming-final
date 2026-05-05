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
import io.netty.handler.codec.http.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import static io.netty.handler.codec.http.HttpHeaderNames.*;
import static io.netty.handler.codec.http.HttpHeaderValues.KEEP_ALIVE;
import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;

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

    String rawUri = request.uri();

    String pathOnly = rawUri;
    int queryIndex = rawUri.indexOf('?');
    if (queryIndex >= 0) {
      pathOnly = rawUri.substring(0, queryIndex);
    }

    if (!pathOnly.startsWith("/hls/")) {
      writeError(ctx, HttpResponseStatus.NOT_FOUND, "Unsupported path");
      return;
    }

    String path = pathOnly.substring("/hls/".length());
    String[] parts = path.split("/");

    if (parts.length < 3) {
      writeError(ctx, HttpResponseStatus.BAD_REQUEST,
              "Path must be /hls/{shortId}/{token}/{filePath}");
      return;
    }

    String shortLink = parts[0];
    String token = parts[1];

    StringBuilder filePathBuilder = new StringBuilder();
    for (int i = 2; i < parts.length; i++) {
      filePathBuilder.append(parts[i]);
      if (i < parts.length - 1) {
        filePathBuilder.append("/");
      }
    }

    String filePath = filePathBuilder.toString();

    if (token.isBlank()) {
      writeError(ctx, HttpResponseStatus.UNAUTHORIZED, "Missing playback token");
      return;
    }

    try {
      PlaybackTokenPayload payload = playbackTokenValidator.validate(token);

      if (payload == null) {
        writeError(ctx, HttpResponseStatus.UNAUTHORIZED, "Invalid playback token");
        return;
      }

      String hlsPrefix = shortLinkResolverService.resolvePrefix(shortLink);

      if (hlsPrefix == null || hlsPrefix.isBlank()) {
        writeError(ctx, HttpResponseStatus.NOT_FOUND, "HLS prefix not found");
        return;
      }

      String objectKey = hlsPrefix + filePath;

      byte[] content = hlsObjectService.getObjectBytesByKey(objectKey);
      String contentType = hlsObjectService.getContentType(filePath);

      if (filePath.endsWith(".m3u8")) {
        content = rewritePlaylist(content, shortLink, token, filePath);
      }

      FullHttpResponse response = new DefaultFullHttpResponse(
              HTTP_1_1,
              HttpResponseStatus.OK,
              Unpooled.wrappedBuffer(content)
      );

      response.headers().set(CONTENT_TYPE, contentType);
      response.headers().set(CONTENT_LENGTH, content.length);
      response.headers().set(ACCESS_CONTROL_ALLOW_ORIGIN, "*");

      if (filePath.endsWith(".m3u8")) {
        response.headers().set(CACHE_CONTROL, "no-cache");
      } else {
        response.headers().set(CACHE_CONTROL, "public, max-age=3600");
      }

      if (HttpUtil.isKeepAlive(request)) {
        response.headers().set(CONNECTION, KEEP_ALIVE);
      }

      var future = ctx.writeAndFlush(response);
      if (!HttpUtil.isKeepAlive(request)) {
        future.addListener(ChannelFutureListener.CLOSE);
      }

    } catch (RuntimeException e) {
      writeError(ctx, HttpResponseStatus.NOT_FOUND,
              e.getMessage() != null ? e.getMessage() : "HLS object not found");
    } catch (Exception e) {
      writeError(ctx, HttpResponseStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
  }

  private byte[] rewritePlaylist(byte[] content, String shortLink, String token, String currentFilePath) {
    String playlist = new String(content, StandardCharsets.UTF_8);

    String currentDir = "";
    int lastSlash = currentFilePath.lastIndexOf('/');
    if (lastSlash >= 0) {
      currentDir = currentFilePath.substring(0, lastSlash + 1);
    }

    StringBuilder result = new StringBuilder();

    String[] lines = playlist.split("\\R");

    for (String line : lines) {
      String trimmed = line.trim();

      if (trimmed.isBlank() || trimmed.startsWith("#")) {
        result.append(line).append("\n");
        continue;
      }

      if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/hls/")) {
        result.append(line).append("\n");
        continue;
      }

      String targetPath;

      if (trimmed.contains("/")) {
        targetPath = trimmed;
      } else {
        targetPath = currentDir + trimmed;
      }

      result
              .append("/hls/")
              .append(shortLink)
              .append("/")
              .append(token)
              .append("/")
              .append(targetPath)
              .append("\n");
    }

    return result.toString().getBytes(StandardCharsets.UTF_8);
  }

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
      response.headers().set(ACCESS_CONTROL_ALLOW_ORIGIN, "*");

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
      response.headers().set(ACCESS_CONTROL_ALLOW_ORIGIN, "*");

      ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
    }
  }
}