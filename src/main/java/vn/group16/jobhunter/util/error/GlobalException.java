package vn.group16.jobhunter.util.error;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import vn.group16.jobhunter.domain.RestResponse;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(value = {
            IdInvalidException.class,
            UsernameNotFoundException.class,
            BadCredentialsException.class
    })
    public ResponseEntity<RestResponse<Object>> handleIdException(Exception ex) {
        RestResponse<Object> restResponse = new RestResponse<Object>();
        restResponse.setStatusCode(HttpStatus.BAD_REQUEST.value());
        restResponse.setErrCode(ex.getMessage());
        restResponse.setMessage("Exception occurs...");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(restResponse);
    }

    @ExceptionHandler(value = {
            EmailInvalidException.class
    })
    public ResponseEntity<RestResponse<Object>> handleEmailException(Exception ex) {
        RestResponse<Object> restResponse = new RestResponse<Object>();
        restResponse.setStatusCode(HttpStatus.BAD_REQUEST.value());
        restResponse.setErrCode(ex.getMessage());
        restResponse.setMessage("Exception occurs...");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(restResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RestResponse<Object>> errorValidation(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        final List<FieldError> fieldErrors = result.getFieldErrors();
        RestResponse<Object> res = new RestResponse<Object>();
        res.setStatusCode(HttpStatus.BAD_REQUEST.value());
        res.setErrCode(ex.getBody().getDetail());
        List<String> errors = fieldErrors.stream().map(f -> f.getDefaultMessage()).collect(Collectors.toList());
        res.setMessage(errors.size() > 1 ? errors : errors.get(0));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

}
