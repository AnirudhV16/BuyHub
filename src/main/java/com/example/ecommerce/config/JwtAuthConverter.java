package com.example.ecommerce.config;

import java.util.Collection;
import java.util.List;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
    	System.out.println("JWT Claims: " + jwt.getClaims());
        String roleClaim = jwt.getClaim("role"); // e.g., "USER"
        System.out.println("Extracted role: " + roleClaim);
        Collection<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(roleClaim)
        );
        return new JwtAuthenticationToken(jwt, authorities);
    }
}
