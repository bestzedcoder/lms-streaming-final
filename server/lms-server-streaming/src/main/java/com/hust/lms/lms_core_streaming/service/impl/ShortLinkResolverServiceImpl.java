package com.hust.lms.lms_core_streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.hust.lms.lms_core_streaming.service.RedisService;
import com.hust.lms.lms_core_streaming.service.ShortLinkResolverService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@Slf4j
public class ShortLinkResolverServiceImpl implements ShortLinkResolverService {

    @Value("${app.redis.key-streaming}")
    private String prefixKey;

    private final RedisService redisService;
    private final Cache<String, String> localCache = Caffeine.newBuilder()
            .maximumSize(10_000)
            .expireAfterAccess(Duration.ofMinutes(10))
            .build();

    public ShortLinkResolverServiceImpl(RedisService redisService){
        this.redisService = redisService;
    }

    @Override
    public String resolvePrefix(String shortLink) {
        if (shortLink == null) return "";
        String prefix = localCache.getIfPresent(shortLink);
        if (prefix != null) {
            log.debug("Local cache HIT: {}", shortLink);
            return prefix;
        }

        String redisKey = prefixKey + shortLink;
        prefix = this.redisService.getValue(redisKey, new TypeReference<String>() {});

        if (prefix != null) {
            log.debug("Redis HIT: {}", shortLink);

            this.putLocal(shortLink, prefix);
            return prefix;
        }

        log.warn("Short link NOT FOUND: {}", shortLink);
        throw new RuntimeException("Short link not found: " + shortLink);
    }

    @Override
    public void putLocal(String shortLink, String prefix) {
        if (shortLink == null || prefix == null) return;
        localCache.put(shortLink, prefix);
    }

    @Override
    public void evictLocal(String shortLink) {
        if (shortLink == null) return;
        localCache.invalidate(shortLink);
    }
}
