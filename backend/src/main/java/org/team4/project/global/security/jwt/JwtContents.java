package org.team4.project.global.security.jwt;

public class JwtContents {
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";

    public static final String TOKEN_TYPE_ACCESS = "access";
    public static final String TOKEN_TYPE_REFRESH = "refresh";

    public static final long ACCESS_TOKEN_EXPIRE_MILLIS = 1000L * 60 * 10;
    public static final long REFRESH_TOKEN_EXPIRE_MILLIS = 1000L * 60 * 60 * 24;
    public static final int REFRESH_TOKEN_EXPIRE_SECONDS = 60 * 60 * 24;

    public static final String REFRESH_COOKIE_PATH = "/api/v1/auth/token";
}
