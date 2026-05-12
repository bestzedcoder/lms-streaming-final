package com.hust.lms.streaming.enums;

public enum RequestContent {
    COURSE_REPORT("Báo Cáo khóa học"),
    TEACHER_REQUEST("Xin cấp quyền cho tài khoản");

    public final String value;

    RequestContent(String value) {
        this.value = value;
    }
}
