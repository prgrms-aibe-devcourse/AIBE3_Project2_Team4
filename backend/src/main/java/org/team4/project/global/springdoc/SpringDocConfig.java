package org.team4.project.global.springdoc;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Team4 Project-2 API Docs", version = "1.0", description = "4팀 2차 프로젝트 API 문서입니다."))
public class SpringDocConfig {

    //TODO : 인증 처리 등 더 자세한 설정
}
