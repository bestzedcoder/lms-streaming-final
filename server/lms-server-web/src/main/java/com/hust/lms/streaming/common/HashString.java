package com.hust.lms.streaming.common;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class HashString {

    private HashString() {
        throw new AssertionError("Utility class");
    }

    public static String hash(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            ));

            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(raw)
                    .substring(0, 20);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
