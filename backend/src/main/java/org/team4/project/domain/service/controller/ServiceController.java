package org.team4.project.domain.service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.service.ServiceService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/services")
public class ServiceController {
    private final ServiceService serviceService;

    @GetMapping("/{id}")
    public ServiceDTO getItem(@PathVariable Long id) {
        return serviceService.findById(id);
    }
    
}
