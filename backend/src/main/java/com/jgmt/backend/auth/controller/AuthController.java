package com.jgmt.backend.auth.controller;

import com.jgmt.backend.auth.data.LoginRequest;
import com.jgmt.backend.auth.service.AuthService;
import com.jgmt.backend.users.data.UserResponse;
import com.jgmt.backend.util.Client;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@Slf4j
@Client
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            HttpServletRequest request, HttpServletResponse response, @Valid @RequestBody LoginRequest body) {
        authService.login(request, response, body);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getSession(HttpServletRequest request) {
        return ResponseEntity.ok(authService.getSession(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok().build();
    }

    /**
     * We don't have to do anything in this endpoint, the CsrfFilter will handle it.
     * This endpoint should be invoked by the frontend to get the CSRF token.
     */
    @GetMapping("/csrf")
    public ResponseEntity<?> csrf() {
        return ResponseEntity.ok().build();
    }
}
