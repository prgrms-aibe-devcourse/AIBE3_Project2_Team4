package org.team4.project.global.redis;

public class RedisKeys {
    public static String signupCode(String email) {
        return "signup:code:" + email;
    }
    public static String signupVerified(String email) {
        return "signup:verified:" + email;
    }
}
