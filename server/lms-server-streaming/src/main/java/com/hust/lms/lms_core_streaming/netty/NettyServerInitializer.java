package com.hust.lms.lms_core_streaming.netty;

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

  public NettyServerInitializer(
      HlsObjectService hlsObjectService,
      PlaybackTokenValidator playbackTokenValidator
  ) {
    this.hlsObjectService = hlsObjectService;
    this.playbackTokenValidator = playbackTokenValidator;
  }

  @Override
  protected void initChannel(SocketChannel ch) {
    ch.pipeline()
        .addLast(new HttpServerCodec())
        .addLast(new HttpObjectAggregator(65536))
        .addLast(new ChunkedWriteHandler())
        .addLast(new HlsRequestHandler(hlsObjectService, playbackTokenValidator));
  }
}