package org.team4.project.domain.service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.domain.service.dto.ReviewRqBody;
import org.team4.project.domain.service.dto.ServiceReviewDTO;
import org.team4.project.domain.service.entity.reviews.ServiceReview;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.exception.ServiceException;
import org.team4.project.domain.service.repository.ServiceRepository;
import org.team4.project.domain.service.repository.ServiceReviewRepository;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ServiceReviewRepository serviceReviewRepository;
    private final ServiceRepository serviceRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void createReview(Long serviceId, String email, ReviewRqBody reviewRqBody) {
        ProjectService service = serviceRepository.findById(serviceId).orElseThrow(
                () -> new ServiceException("서비스가 존재하지 않습니다.")
        );
        Member freelancer = service.getFreelancer();
        Member member = memberRepository.findByEmail(email).orElseThrow(() ->
                new ServiceException("존재하지 않는 회원입니다.")
        );

        serviceReviewRepository.save(
                ServiceReview.createReview(freelancer, member, service, reviewRqBody)
        );
    }

    public Page<ServiceReviewDTO> getReviewsWithServiceId(Pageable pageable, Long serviceId) {
        return serviceReviewRepository.findByServiceId(serviceId, pageable)
                .map(ServiceReviewDTO::from);
    }
}
