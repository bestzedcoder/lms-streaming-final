package com.hust.lms.lms_core_streaming.netty;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.lms.lms_core_streaming.service.HlsObjectService;
import com.hust.lms.lms_core_streaming.service.PlaybackTokenValidator;
import com.hust.lms.lms_core_streaming.service.ShortLinkResolverService;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.SocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.stream.ChunkedWriteHandler;

/**
 * Khởi tạo pipeline cho mỗi kết nối Netty.
 */
public class NettyServerInitializer extends ChannelInitializer<SocketChannel> {

  private final HlsObjectService hlsObjectService;
  private final PlaybackTokenValidator playbackTokenValidator;
  private final ShortLinkResolverService shortLinkResolverService;
  private final ObjectMapper objectMapper;

  public NettyServerInitializer(
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
  protected void initChannel(SocketChannel ch) {
    ch.pipeline()
        .addLast(new HttpServerCodec())
        .addLast(new HttpObjectAggregator(65536))
        .addLast(new ChunkedWriteHandler())
        .addLast(new HlsRequestHandler(hlsObjectService, playbackTokenValidator, shortLinkResolverService, objectMapper));
  }
}