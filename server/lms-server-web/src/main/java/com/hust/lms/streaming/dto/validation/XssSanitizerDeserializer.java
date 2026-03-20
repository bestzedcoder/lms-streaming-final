package com.hust.lms.streaming.dto.validation;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import java.io.IOException;

public class XssSanitizerDeserializer extends JsonDeserializer<String> {

  @Override
  public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
    String unsafeContent = p.getText();
    if (unsafeContent == null) return null;

    // Safelist.basic(): Chỉ cho phép các thẻ cơ bản (b, i, u, p, br...)
    // Tự động xóa <script>, onclick, onload...
    return Jsoup.clean(unsafeContent, Safelist.basic().addTags("img").addAttributes("img", "src"));
  }
}
