package org.team4.project.domain.service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.repository.ServiceRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceService {
    private final ServiceRepository serviceRepository;

    //서비스 개수 조회
    public Integer count() {
        return (int) serviceRepository.count();
    }

    // 서비스 생성 (혹시 반환값 필요할까봐 반환값 작성 필요 없을 시 추후 void로 변경)
    public void createService(ServiceCreateRqBody serviceCreateRqBody, Member freeLancer) {
        serviceRepository.save(
            ProjectService.addService(serviceCreateRqBody, freeLancer)
        );
    }

    //서비스 단건 조회
    public ServiceDTO findById(Long id) {
        return new ServiceDTO(
                serviceRepository
                        .findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("해당 서비스가 존재하지 않습니다.")));
    }

    /**
     * Retrieve a paginated list of services ordered by id descending.
     *
     * @param page zero-based page index to retrieve
     * @param size number of items per page
     * @return a list of ServiceDTO for the requested page ordered by id descending
     */
    public List<ServiceDTO> getServices(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        return serviceRepository.findAllWithFreelancer(pageable).stream()
                .map(ServiceDTO::from)
                .toList();
    }

    /**
     * Update an existing service's title, content, and price.
     *
     * @param id the identifier of the service to update
     * @param serviceCreateRqBody request body containing the new title, content, and price
     * @throws IllegalArgumentException if no service exists with the given id
     */
    public void updateService(Long id, ServiceCreateRqBody serviceCreateRqBody) {
        ProjectService existingService = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 서비스가 존재하지 않습니다."));

        existingService.modify(
                serviceCreateRqBody.title(),
                serviceCreateRqBody.content(),
                serviceCreateRqBody.price()
        );

        serviceRepository.save(existingService);
    }

    /**
     * Delete the service with the given id.
     *
     * @param id the identifier of the service to delete
     * @throws IllegalArgumentException if no service exists with the given id
     */
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 서비스가 존재하지 않습니다.");
        }
        serviceRepository.deleteById(id);
    }

}
