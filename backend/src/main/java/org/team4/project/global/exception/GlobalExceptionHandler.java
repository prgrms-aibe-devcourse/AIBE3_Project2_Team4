package org.team4.project.global.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
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

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponse> handleServiceException(ServiceException e, HttpServletRequest request) {
        log.warn("Service error at [{} {}]: {}",
                request.getMethod(), request.getRequestURI(), e.getMessage(), e);

        return new ResponseEntity<>(ErrorResponse.of(request, e.getMessage()), HttpStatus.BAD_REQUEST);
    }
}
