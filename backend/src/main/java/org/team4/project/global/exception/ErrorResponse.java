package org.team4.project.global.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ErrorResponse {
    private final String path;
    private final String method;
    private final String message;
    private final LocalDateTime timestamp;

    public static ErrorResponse of(HttpServletRequest request, String message) {
        return ErrorResponse.builder()
                .path(request.getRequestURI())
                .method(request.getMethod())
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
