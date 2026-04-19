package com.hust.lms.lms_core_streaming.common;

import java.util.UUID;

public class Gen {
  public Gen() {
    throw new AssertionError("Utility class");
  }

  public static String genMessageId(String title) {
    return String.format("MSG-%s-%s-%s", title , UUID.randomUUID() , System.currentTimeMillis());
  }
}