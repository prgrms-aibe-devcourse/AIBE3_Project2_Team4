package org.team4.project.domain.activeService.exception;

public class OwnerMismatchException extends NullPointerException {
    public OwnerMismatchException(String message) {
        super(message);
    }
}
