package com.example.Warranty_Wave_Backend.security;

import com.example.Warranty_Wave_Backend.model.UserAccount;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {
    private final JwtEncoder encoder;
    private final long expirationMillis;

    public JwtTokenService(JwtEncoder encoder, @Value("${app.jwt.expiration}") long expirationMillis) {
        this.encoder = encoder;
        this.expirationMillis = expirationMillis;
    }

    public String issue(UserAccount user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("warrantywave")
            .issuedAt(now)
            .expiresAt(now.plusMillis(expirationMillis))
            .subject(user.getEmail())
            .claim("roles", List.of(user.getRole().name()))
            .build();
        return encoder.encode(JwtEncoderParameters.from(
            JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
    }

    public static SecretKey signingKey(String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET must contain at least 32 characters.");
        }
        return new SecretKeySpec(keyBytes, "HmacSHA256");
    }
}
