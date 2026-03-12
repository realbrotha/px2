package com.px2.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenStore refreshTokenStore;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenStore refreshTokenStore) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenStore = refreshTokenStore;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        String username = auth.getName();
        String accessToken = jwtService.generateAccessToken(username);
        String refreshToken = jwtService.generateRefreshToken(username);
        refreshTokenStore.put(refreshToken, username);
        return ResponseEntity.ok(new TokenResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessExpirationSeconds(),
                username));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest request) {
        String refreshToken = request.refreshToken();
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        String username = refreshTokenStore.get(refreshToken);
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            jwtService.validateRefreshToken(refreshToken);
        } catch (Exception e) {
            refreshTokenStore.remove(refreshToken);
            return ResponseEntity.status(401).build();
        }
        refreshTokenStore.remove(refreshToken);
        String newAccessToken = jwtService.generateAccessToken(username);
        String newRefreshToken = jwtService.generateRefreshToken(username);
        refreshTokenStore.put(newRefreshToken, username);
        return ResponseEntity.ok(new TokenResponse(
                newAccessToken,
                newRefreshToken,
                jwtService.getAccessExpirationSeconds(),
                username));
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me() {
        return ResponseEntity.ok(new MeResponse(
                org.springframework.security.core.context.SecurityContextHolder.getContext()
                        .getAuthentication().getName()));
    }

    public record LoginRequest(String username, String password) {}

    public record RefreshRequest(String refreshToken) {}

    public record TokenResponse(String accessToken, String refreshToken, long expiresIn, String username) {}

    public record MeResponse(String username) {}
}
