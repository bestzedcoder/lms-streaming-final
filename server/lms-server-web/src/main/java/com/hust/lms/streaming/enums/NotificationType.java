package com.hust.lms.streaming.enums;

public enum NotificationType {

    /*
     * =========================
     * TEACHER REQUEST
     * =========================
     */
    TEACHER_REQUEST_APPROVED,

    /*
     * =========================
     * VIDEO PROCESSING
     * =========================
     */

    VIDEO_PROCESSING_SUCCESS,
    VIDEO_PROCESSING_FAILED,
    VIDEO_VALIDATION_FAILED,

    VIDEO_APPROVED,
    VIDEO_REJECTED,

    /*
     * =========================
     * LECTURE / RESOURCE
     * =========================
     */

    RESOURCE_VALIDATION_FAILED,
    RESOURCE_APPROVED,
    RESOURCE_REJECTED,

    /*
     * =========================
     * COURSE REPORT
     * =========================
     */

    COURSE_REPORTED,
    COURSE_REPORT_RESOLVED,

    COURSE_APPROVED,
    /*
     * =========================
     * SYSTEM
     * =========================
     */

    SYSTEM_NOTIFICATION
}