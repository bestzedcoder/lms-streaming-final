package com.hust.lms.streaming.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("overview")
public class OverviewController {
  @GetMapping
  public String overview() {
    return "overview";
  }
}
