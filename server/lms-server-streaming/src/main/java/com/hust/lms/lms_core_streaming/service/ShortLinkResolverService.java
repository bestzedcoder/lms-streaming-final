package com.hust.lms.lms_core_streaming.service;

public interface ShortLinkResolverService {
    /**
     * Resolve shortId sang prefix thật.
     */
    String resolvePrefix(String shortLink);

    /**
     * Put mapping vào local cache.
     * Dùng khi Redis hit để nạp lại cache local.
     */
    void putLocal(String shortLink, String prefix);

    /**
     * Xóa local cache nếu cần invalidate thủ công.
     */
    void evictLocal(String shortLink);
}
