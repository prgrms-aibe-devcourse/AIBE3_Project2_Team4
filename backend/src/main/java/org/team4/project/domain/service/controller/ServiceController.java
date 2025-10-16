package org.team4.project.domain.service.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.dto.ServiceDetailDTO;
import org.team4.project.domain.service.entity.category.type.CategoryType;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.exception.ServiceException;
import org.team4.project.domain.service.service.BookMarkService;
import org.team4.project.domain.service.service.ServiceService;
import org.team4.project.global.security.CustomUserDetails;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/services")
public class ServiceController {
    private final ServiceService serviceService;
    private final BookMarkService bookMarkService;

    @PostMapping
    @Transactional
    public ProjectService createItem(
            @Valid @RequestBody ServiceCreateRqBody serviceCreateRqBody,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        return serviceService.createService(serviceCreateRqBody, customUserDetails);
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ServiceDetailDTO getItem(@PathVariable Long id) {
        return serviceService.fromFindById(id);
    }

    @GetMapping
    @Transactional(readOnly = true)
    public Page<ServiceDTO> getServices(
        @PageableDefault(page = 0, size = 10, sort="id", direction = Sort.Direction.DESC)Pageable pageable) {
        return serviceService.getServices(pageable);
    }

    @GetMapping("/recommendation")
    @Transactional(readOnly = true)
    public Page<ServiceDTO> getRecommendationServices(
            @PageableDefault(page = 0, size = 10, sort="id", direction = Sort.Direction.DESC)Pageable pageable) {
        return serviceService.getRecommendationServices(pageable);
    }

    @GetMapping("/category")
    @Transactional(readOnly = true)
    public Page<ServiceDTO> getServicesByCategory(
            @PageableDefault(page = 0, size = 10, sort="id", direction = Sort.Direction.DESC)Pageable pageable,
            @RequestParam CategoryType category) {
        return serviceService.getServicesByCategory(pageable, category);
    }

    @GetMapping("/tags")
    @Transactional(readOnly = true)
    public Page<ServiceDTO> getServicesByTags(
            @PageableDefault(page = 0, size = 10, sort="id", direction = Sort.Direction.DESC)Pageable pageable,
            @RequestParam List<TagType> tags) {
        return serviceService.getServicesByTags(pageable, tags);
    }


    @PutMapping("/{id}")
    @Transactional
    public void updateItem(
            @PathVariable Long id,
            @Valid @RequestBody ServiceCreateRqBody serviceCreateRqBody,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        String actor = customUserDetails.getEmail();

        ProjectService service = serviceService.findById(id);

        service.checkActorCanModify(actor);

        serviceService.updateService(id, serviceCreateRqBody);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public void deleteItem(@PathVariable Long id,
                           @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        String actor = customUserDetails.getEmail();

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
