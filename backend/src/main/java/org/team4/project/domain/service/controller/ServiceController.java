package org.team4.project.domain.service.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.entity.category.type.CategoryType;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.service.ServiceService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/service")
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

    @GetMapping("/category")
    @Transactional(readOnly = true)
    public List<ServiceDTO> getServicesByCategory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam CategoryType category) {
        return serviceService.getServicesByCategory(page, size, category);
    }

    @GetMapping("/tags")
    @Transactional(readOnly = true)
    public List<ServiceDTO> getServicesByTags(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam List<TagType> tags) {
        return serviceService.getServicesByTags(page, size, tags);
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

}
