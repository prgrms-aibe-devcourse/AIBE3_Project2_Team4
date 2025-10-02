package org.team4.project.domain.payment.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ViewTestController {

    @Value("${payment.client-key}")
    private String clientKey;

    @Value("${payment.customer-key}")
    private String customerKey;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(Model model) {
        model.addAttribute("clientKey", clientKey);
        model.addAttribute("customerKey", customerKey);
        return "/checkout";
    }

    @RequestMapping(value = "/success", method = RequestMethod.GET)
    public String success() {
        return "/success";
    }
}
