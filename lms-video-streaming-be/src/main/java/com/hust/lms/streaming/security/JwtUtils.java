package com.hust.lms.streaming.security;

import com.hust.lms.streaming.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JwtUtils {

  @Value("${app.security.jwt.secretKey}")
  private String secretKey;

  @Value("${app.security.jwt.accessExpiration}")
  private long accessExpiration;

  @Value("${app.security.jwt.refreshExpiration}")
  private long refreshExpiration;

  public String generateAccessToken(User user) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("role", user.getRole().name());
    claims.put("uuid", user.getId());
    claims.put("email", user.getEmail());

    return buildToken(claims, user.getEmail(), accessExpiration);
  }

  public String generateRefreshToken(User user) {
    return buildToken(new HashMap<>(), user.getEmail(), refreshExpiration);
  }

  private String buildToken(Map<String, Object> extraClaims, String subject, long expiration) {
    return Jwts.builder()
        .setClaims(extraClaims)
        .setSubject(subject)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  public boolean validateJwtToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token);
      return true;
    } catch (MalformedJwtException e) {
      log.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      log.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      log.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      log.error("JWT claims string is empty: {}", e.getMessage());
    } catch (io.jsonwebtoken.security.SignatureException e) {
      log.error("Invalid JWT signature: {}", e.getMessage());
    }
    return false;
  }

  private SecretKey getSignInKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
  }
}