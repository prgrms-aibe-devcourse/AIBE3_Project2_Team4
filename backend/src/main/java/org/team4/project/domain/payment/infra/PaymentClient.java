package org.team4.project.domain.payment.infra;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.team4.project.domain.payment.dto.PaymentConfirmDTO;

@HttpExchange
public interface PaymentClient {

    @PostExchange("/confirm")
    JsonNode confirmPayment(@RequestBody PaymentConfirmDTO paymentConfirmDTO);
}
