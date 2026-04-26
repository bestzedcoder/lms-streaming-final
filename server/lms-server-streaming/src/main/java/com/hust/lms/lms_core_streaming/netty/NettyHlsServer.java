package com.hust.lms.lms_core_streaming.netty;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.lms.lms_core_streaming.service.HlsObjectService;
import com.hust.lms.lms_core_streaming.service.PlaybackTokenValidator;
import com.hust.lms.lms_core_streaming.service.ShortLinkResolverService;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Netty server chuyên phục vụ HLS.
 *
 * Nó không làm auth business kiểu Spring Security.
 * Nó chỉ verify playback token rồi trả file.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NettyHlsServer {

  @Value("${app.netty.port}")
  private int port;

  private final HlsObjectService hlsObjectService;
  private final PlaybackTokenValidator playbackTokenValidator;
  private final ShortLinkResolverService shortLinkResolverService;
  private final ObjectMapper objectMapper;

  private EventLoopGroup bossGroup;
  private EventLoopGroup workerGroup;
  private Channel serverChannel;

  @PostConstruct
  public void start() {
    bossGroup = new NioEventLoopGroup(1);
    workerGroup = new NioEventLoopGroup();

    try {
      ServerBootstrap bootstrap = new ServerBootstrap();
      bootstrap.group(bossGroup, workerGroup)
          .channel(NioServerSocketChannel.class)
          .childHandler(new NettyServerInitializer(hlsObjectService, playbackTokenValidator, shortLinkResolverService, objectMapper))
          .option(ChannelOption.SO_BACKLOG, 1024)
          .childOption(ChannelOption.SO_KEEPALIVE, true);

      serverChannel = bootstrap.bind(port).sync().channel();
      log.info("Netty HLS server started at port {}", port);

    } catch (Exception e) {
      throw new RuntimeException("Failed to start Netty HLS server", e);
    }
  }

  @PreDestroy
  public void stop() {
    try {
      if (serverChannel != null) {
        serverChannel.close().syncUninterruptibly();
      }
    } finally {
      if (workerGroup != null) {
        workerGroup.shutdownGracefully();
      }
      if (bossGroup != null) {
        bossGroup.shutdownGracefully();
      }
    }
  }
}