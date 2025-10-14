package org.team4.project.domain.member.exception;

public class PasswordResetException extends RuntimeException {
    public PasswordResetException(String message) {
        super(message);
    }
}
