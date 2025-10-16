package org.team4.project.global.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.team4.project.global.security.jwt.JwtFilter;
import org.team4.project.global.security.jwt.JwtUtil;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] SWAGGER_RESOURCES = {"/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs", "/api-docs/**", "/v3/api-docs/**"};

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public JwtFilter jwtFilter(JwtUtil jwtUtil) {
        return new JwtFilter(jwtUtil);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtFilter jwtFilter,
                                                   CustomOAuth2UserService customOAuth2UserService,
                                                   CustomAuthenticationHandlers handlers) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(header -> header.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig
                                .userService(customOAuth2UserService))
                        .successHandler(handlers.oauthSuccessHandler()))

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        })
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(SWAGGER_RESOURCES).permitAll()
                        .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
                        .requestMatchers(PathRequest.toH2Console()).permitAll()                        
                        .requestMatchers("api/v1/auth/token/refresh", "api/v1/auth/register").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/services/category",
                                "/api/v1/services/{id:\\d++}",
                                "/api/v1/services/tags",
                                "/api/v1/services",
                                "/api/v1/services/recommendation",
                                "/api/v1/services/search",
                                "/api/v1/bookmarks/services/{id:\\d++}/bookmark",
                                "/api/v1/reviews/{id:\\d++}",
                                "/api/v1/freelancers/ranking").permitAll()
                        .requestMatchers("/ws-stomp/**").permitAll()
                        .requestMatchers("/api/v1/auth/register",
                                "/api/v1/auth/email/verify/**",
                                "/api/v1/auth/reset-password/**",
                                "/api/v1/auth/token/refresh",
                                "/api/v1/auth/login",
                                "/api/v1/auth/token/logout",
                                "/api/v1/auth/check-nickname").permitAll()
                        .anyRequest().authenticated()
                )

        ;

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        //TODO : 순환 참조 발생하면 클래스 분리 필요
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
