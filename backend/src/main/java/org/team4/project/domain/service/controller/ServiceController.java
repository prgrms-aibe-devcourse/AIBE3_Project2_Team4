package org.team4.project.domain.service.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.service.ServiceService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/services")
public class ServiceController {
    private final ServiceService serviceService;

    @GetMapping("/{id}")
    public ServiceDTO getItem(@PathVariable Long id) {
        return serviceService.findById(id);
    }

    @PostMapping
    public void createItem(
            @Valid @RequestBody ServiceCreateRqBody serviceCreateRqBody) {
        Member freeLancer = new Member(); // = 인증된 사용자 정보로 대체 필요
        serviceService.createService(serviceCreateRqBody, freeLancer);
    }

    @GetMapping
    public List<ServiceDTO> getServices(@RequestParam(required = false) Long lastId) {
        return serviceService.getServices(lastId);
    }
}
