package org.team4.project.domain.service.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.service.ServiceService;
import org.team4.project.global.security.CustomUserDetails;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/services")
public class ServiceController {
    private final ServiceService serviceService;

    @PostMapping
    @Transactional
    public void createItem(
            @Valid @RequestBody ServiceCreateRqBody serviceCreateRqBody) {
        Member freeLancer = new Member(); // = 인증된 사용자 정보로 대체 필요
        serviceService.createService(serviceCreateRqBody, freeLancer);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ServiceDTO getItem(@PathVariable Long id) {
        return serviceService.fromFindById(id);
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<ServiceDTO> getServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return serviceService.getServices(page, size);
    }

    @PutMapping("/{id}")
    @Transactional
    public void updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ServiceCreateRqBody serviceCreateRqBody) {
        Member actor = new Member(); // = 인증된 사용자 정보로 대체 필요

        ProjectService service = serviceService.findById(id);

        service.checkActorCanModify(actor);

        serviceService.updateService(id, serviceCreateRqBody);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteItem(@PathVariable Long id) {
        Member actor = new Member(); // = 인증된 사용자 정보로 대체 필요

        ProjectService service = serviceService.findById(id);

        service.checkActorCanDelete(actor);

        serviceService.deleteService(id);
    }

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<ServiceDTO>> getMyServices(
            @PageableDefault(page=0, size=10, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {

        Page<ServiceDTO> response = serviceService.getServicesByEmail(currentUser.getUsername(), pageable);
        return ResponseEntity
                .ok()
                .body(response);
    }
}
