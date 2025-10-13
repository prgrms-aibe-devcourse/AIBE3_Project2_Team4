package org.team4.project.domain.service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.exception.ServiceException;
import org.team4.project.domain.service.repository.ServiceRepository;

import java.util.List;
import java.util.stream.Collectors;

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

    // email 기반으로 서비스 목록 찾기
    public Page<ServiceDTO> getServicesByEmail(String username, Pageable pageable) {
        return serviceRepository.findAllByFreelancer_Email(username, pageable).map(ServiceDTO::from);
    }
}
