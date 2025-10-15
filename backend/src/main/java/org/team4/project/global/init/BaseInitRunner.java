package org.team4.project.global.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

@Configuration
public class BaseInitRunner {
    @Autowired
    @Lazy
    BaseInitRunner self;

    @Bean
    public ApplicationRunner init(){
        return args -> {

        };
    }
}
