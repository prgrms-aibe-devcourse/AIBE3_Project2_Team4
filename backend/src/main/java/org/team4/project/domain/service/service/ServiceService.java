package org.team4.project.domain.service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.entity.category.Tag;
import org.team4.project.domain.service.entity.category.TagService;
import org.team4.project.domain.service.entity.category.type.CategoryType;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.exception.ServiceException;
import org.team4.project.domain.service.repository.ServiceRepository;
import org.team4.project.domain.service.repository.TagRepository;
import org.team4.project.domain.service.repository.TagServiceRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {
    private final ServiceRepository serviceRepository;
    private final TagServiceRepository tagServiceRepository;
    private final TagRepository tagRepository;

    //서비스 개수 조회
    public Integer count() {
        return (int) serviceRepository.count();
    }

    // 서비스 생성
    public void createService(ServiceCreateRqBody serviceCreateRqBody, Member freeLancer, TagType tagName) {
        ProjectService service =  serviceRepository.save(
            ProjectService.addService(serviceCreateRqBody, freeLancer)
        );
        Tag tag = tagRepository.findByName(tagName);
        TagService tagService = new TagService(tag, service);
        tagServiceRepository.save(tagService);
    }

    //서비스 단건 조회 엔티티
    public ProjectService findById(Long id) {
        return serviceRepository
                .findById(id)
                .orElseThrow(() -> new ServiceException("해당 서비스가 존재하지 않습니다."));
    }

    //서비스 단건 조회 DTO
    public ServiceDTO fromFindById(Long id) {
        return new ServiceDTO(serviceRepository
                    .findById(id)
                    .orElseThrow(() -> new ServiceException("해당 서비스가 존재하지 않습니다.")));
    }

    //서비스 다건 조회
    public List<ServiceDTO> getServices(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return serviceRepository.findAllWithFreelancer(pageable).stream()
                .map(ServiceDTO::from)
                .toList();
    }

    //서비스 다건 조회 (카테고리)
    public List<ServiceDTO> getServicesByCategory(int page, int size, CategoryType category) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return tagServiceRepository.findByCategory(category, pageable).stream()
                .map(e -> new ServiceDTO(e.getService()))
                .toList();
    }

    //서비스 다건 조회 (태그)
    public List<ServiceDTO> getServicesByTags(int page, int size, List<TagType> tags) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return tagServiceRepository.findByTags(tags, pageable).stream()
                .map(e -> new ServiceDTO(e.getService()))
                .toList();
    }

    //서비스 수정
    public void updateService(Long id, ServiceCreateRqBody serviceCreateRqBody) {
        ProjectService existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new ServiceException("해당 서비스가 존재하지 않습니다."));

        existingService.modify(
                serviceCreateRqBody.title(),
                serviceCreateRqBody.content(),
                serviceCreateRqBody.price()
        );

        serviceRepository.save(existingService);
    }

    //서비스 삭제
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new ServiceException("해당 서비스가 존재하지 않습니다.");
        }
        serviceRepository.deleteById(id);
    }

}
