package org.team4.project.domain.payment.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class ViewTestController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        return "/checkout";
    }

    @RequestMapping(value = "/success", method = RequestMethod.GET)
    public String success() {
        return "/success";
    }
}
