package org.team4.project.global.springdoc;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Team4 Project-2 API Docs", version = "1.0", description = "4팀 2차 프로젝트 API 문서입니다."))
public class SpringDocConfig {

    @Bean
    public GroupedOpenApi groupApiV1() {
        return GroupedOpenApi.builder()
                .group("apiV1")
                .pathsToMatch("/api/v1/**")
                .build();
    }

    @Bean GroupedOpenApi GroupNone() {
        return GroupedOpenApi.builder()
                .group("none-group")
                .pathsToExclude("/api/**")
                .pathsToMatch("/**")
                .build();
    }

    //TODO : 인증 처리 등 더 자세한 설정


}
