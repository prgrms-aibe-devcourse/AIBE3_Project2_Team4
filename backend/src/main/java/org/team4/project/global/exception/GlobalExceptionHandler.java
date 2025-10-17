package org.team4.project.global.exception;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.team4.project.domain.activeService.exception.OwnerMismatchException;
import org.team4.project.domain.member.exception.LoginException;
import org.team4.project.domain.member.exception.PasswordResetException;
import org.team4.project.domain.member.exception.RefreshTokenException;
import org.team4.project.domain.member.exception.RegisterException;
import org.team4.project.domain.payment.exception.PaymentException;
import org.team4.project.domain.service.exception.ServiceException;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e, HttpServletRequest request) {
        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .orElse("Invalid request");

        log.warn("Validation error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), message, e);

        return new ResponseEntity<>(ErrorResponse.of(request, message), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RegisterException.class)
    public ResponseEntity<ErrorResponse> handleRegisterException(RegisterException e, HttpServletRequest request) {
        log.warn("Register error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);

        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<ErrorResponse> handlePaymentException(PaymentException e, HttpServletRequest request) {
        log.warn("Payment error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);

        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException .class)
    public ResponseEntity<ErrorResponse> handleEntityNotFoundException(EntityNotFoundException e, HttpServletRequest request) {
        log.warn("Resource not found error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage());

        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponse> handleServiceException(ServiceException e, HttpServletRequest request) {
        log.warn("Service error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);

        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RefreshTokenException.class)
    public ResponseEntity<ErrorResponse> handleRefreshTokenException(RefreshTokenException e, HttpServletRequest request) {
        log.warn("tokenReissue error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);

        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(PasswordResetException.class)
    public ResponseEntity<ErrorResponse> handlePasswordResetException(PasswordResetException e, HttpServletRequest request) {
        log.warn("password reset error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);

        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<ErrorResponse> handleLoginException(LoginException e, HttpServletRequest request) {
        log.warn("login error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);

        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(OwnerMismatchException.class)
    public ResponseEntity<ErrorResponse> handleOwnerMismatchException(
            OwnerMismatchException e, HttpServletRequest request) {

        log.warn("owner mismatch at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);


        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<ErrorResponse> handleEntityExistsException(
            EntityExistsException e, HttpServletRequest request) {

        log.warn("conflict at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);


        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFoundException(
            NoResourceFoundException e, HttpServletRequest request) {

        log.warn("No resource found at [{} {}]",
                request.getMethod(), request.getRequestURI());

        String message = String.format("요청하신 경로를 찾을 수 없습니다: %s",
                e.getResourcePath());

        return new ResponseEntity<>(ErrorResponse.of(request, message), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e, HttpServletRequest request) {
        log.warn("error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);

        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
