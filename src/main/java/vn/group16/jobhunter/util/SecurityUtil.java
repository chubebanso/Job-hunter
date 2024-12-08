package vn.group16.jobhunter.util;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.util.Base64;

import vn.group16.jobhunter.dto.ResLoginDTO;

import org.springframework.security.core.context.SecurityContext;

@Service
public class SecurityUtil {
    private final JwtEncoder jwtEncoder;

    public SecurityUtil(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;
    @Value("${hoidanit.jwt.base64-secret}")
    private String jwtKey;
    @Value("${hoidanit.jwt.token-validity-in-seconds}")
    private long jwtExpiration;
    @Value("${hoidanit.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public String createToken(String email, ResLoginDTO.UserLogin dto) {

        Instant now = Instant.now();
        Instant validity = now.plus(this.jwtExpiration, ChronoUnit.SECONDS);

        // Chuyển Instant thành chuỗi trước khi thêm vào claim
        String issuedAt = now.toString(); // Chuyển Instant thành chuỗi ISO
        String expirationTime = validity.toString(); // Chuyển Instant thành chuỗi ISO

    // @formatter:off
    JwtClaimsSet claims = JwtClaimsSet.builder()
        .issuedAt(now)  // Không cần chuyển đổi, vì JwtClaimsSet sẽ tự xử lý
        .expiresAt(validity)  // Không cần chuyển đổi, JwtClaimsSet tự xử lý
        .subject(email)
        .claim("user", dto)  // Đưa user thông tin vào claim
        .claim("issuedAt", issuedAt)  // Thêm thời gian issuedAt dưới dạng chuỗi
        .claim("expirationTime", expirationTime)  // Thêm thời gian hết hạn dưới dạng chuỗi
        .build();

    JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
    return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
}

        public static Optional<String> getCurrentUserLogin() {
            SecurityContext securityContext = SecurityContextHolder.getContext();
            return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
        }
        
  public String createRefreshToken(String email,ResLoginDTO res) {

        Instant now = Instant.now();
        Instant validity = now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS);

        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(email)
            .claim("user",res.getUserLogin().getName() )
            .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
      private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length,
                SecurityUtil.JWT_ALGORITHM.getName());
    }
    public Jwt checkValidRefreshToken(String token){
           NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
                getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALGORITHM).build();
                try {
               return jwtDecoder.decode(token);
            } catch (Exception e) {
                System.out.println(">>> JWT error: " + e.getMessage());
                throw e;
            }
    }
    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }

}
