package org.team4.project.global.redis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

@Configuration
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory(@Value("${spring.data.redis.host}") String host,
                                                         @Value("${spring.data.redis.port}") int port) {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();

        config.setHostName(host);
        config.setPort(port);

        return new LettuceConnectionFactory(config);
    }
}
