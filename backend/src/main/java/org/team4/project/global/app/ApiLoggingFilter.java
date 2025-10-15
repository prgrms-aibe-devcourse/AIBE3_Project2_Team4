package org.team4.project.global.app;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class ApiLoggingFilter extends CommonsRequestLoggingFilter {

    @Override
    protected int getMaxPayloadLength() {
        return 1000;
    }

    @Override
    protected boolean isIncludePayload() {
        return true;
    }

    @Override
    protected boolean isIncludeQueryString() {
        return true;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        boolean isFirstRequest = !isAsyncDispatch(request);
        HttpServletRequest requestToUse = request;

        if (isIncludePayload() && isFirstRequest && !(request instanceof ContentCachingRequestWrapper)) {
            requestToUse = new ContentCachingRequestWrapper(request, getMaxPayloadLength());
        }

        long startMs = System.currentTimeMillis();

        boolean shouldLog = shouldLog(requestToUse);
        if (shouldLog && isFirstRequest) {
            beforeRequest(requestToUse, getBeforeMessage(requestToUse));
        }
        try {
            filterChain.doFilter(request, response);
        } finally {
            if (shouldLog && !isAsyncStarted(requestToUse)) {
                afterRequest(requestToUse, getAfterMessage(startMs, requestToUse, response));
            }
        }
    }

    @Override
    protected String getMessagePayload(HttpServletRequest request) {
        try {
            return new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return null;
        }
    }

    private String getBeforeMessage(HttpServletRequest request) {
        StringBuilder msg = new StringBuilder();

        msg.append("API REQUEST <<< [");
        appendRequestPath(request, msg);
        msg.append(" | ");

        if (isIncludePayload()) {
            String payload = getMessagePayload(request);
            msg.append("body=").append(payload);
        }

        msg.append("]");
        return msg.toString();
    }

    private String getAfterMessage(long startMs, HttpServletRequest request, HttpServletResponse response) {
        long executionTimeMs = System.currentTimeMillis() - startMs;
        int status = response.getStatus();

        StringBuilder msg = new StringBuilder();
        msg.append("API RESPONSE >>> [");

        appendRequestPath(request, msg);

        msg.append(" | ");

        msg.append("status=").append(status).append(" | ");
        msg.append("executionTime=").append(executionTimeMs).append("ms");

        msg.append("]");
        return msg.toString();
    }

    private void appendRequestPath(HttpServletRequest request, StringBuilder msg) {
        msg.append(request.getMethod()).append(" | ");
        msg.append(request.getRequestURI());

        if (isIncludeQueryString()) {
            String queryString = request.getQueryString();
            if (queryString != null) {
                msg.append('?').append(queryString);
            }
        }
    }
}
