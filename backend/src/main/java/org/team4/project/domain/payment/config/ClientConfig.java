package org.team4.project.domain.payment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;
import org.team4.project.domain.payment.infra.PaymentClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Configuration
public class ClientConfig {

    @Bean
    public PaymentClient paymentClient(RestClient.Builder builder,
                                       @Value("${payment.secret-key}") String secretKey) {
        String authHeaderValue = "Basic " + Base64.getEncoder().encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        RestClient restClient = builder.baseUrl("https://api.tosspayments.com/v1/payments")
                                       .defaultHeader(AUTHORIZATION, authHeaderValue)
                                       .defaultHeader(CONTENT_TYPE, APPLICATION_JSON_VALUE)
                                       .build();

        return HttpServiceProxyFactory.builderFor(RestClientAdapter.create(restClient))
                                      .build()
                                      .createClient(PaymentClient.class);
    }
}
