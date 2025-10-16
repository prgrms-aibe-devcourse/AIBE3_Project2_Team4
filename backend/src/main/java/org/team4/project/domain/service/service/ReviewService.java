package org.team4.project.domain.service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.file.entity.File;
import org.team4.project.domain.file.repository.FileRepository;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.domain.service.dto.ReviewRqBody;
import org.team4.project.domain.service.dto.ServiceReviewDTO;
import org.team4.project.domain.service.entity.resource.ServiceResource;
import org.team4.project.domain.service.entity.reviews.ReviewResource;
import org.team4.project.domain.service.entity.reviews.ServiceReview;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.exception.ServiceException;
import org.team4.project.domain.service.repository.ReviewResourceRepository;
import org.team4.project.domain.service.repository.ServiceRepository;
import org.team4.project.domain.service.repository.ServiceReviewRepository;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ServiceReviewRepository serviceReviewRepository;
    private final ServiceRepository serviceRepository;
    private final MemberRepository memberRepository;
    private final ReviewResourceRepository reviewResourceRepository;
    private final FileRepository fileRepository;

    @Transactional
    public void createReview(Long serviceId, String email, ReviewRqBody reviewRqBody) {
        ProjectService service = serviceRepository.findById(serviceId).orElseThrow(
                () -> new ServiceException("서비스가 존재하지 않습니다.")
        );
        Member freelancer = service.getFreelancer();
        Member member = memberRepository.findByEmail(email).orElseThrow(() ->
                new ServiceException("존재하지 않는 회원입니다.")
        );

        ServiceReview review = serviceReviewRepository.save(
                ServiceReview.createReview(freelancer, member, service, reviewRqBody)
        );

        if(reviewRqBody.imageUrls() == null || reviewRqBody.imageUrls().isEmpty()) return;

        List<File> files = fileRepository.findAllByS3UrlIn(reviewRqBody.imageUrls());
        Map<String, File> fileMap = files.stream()
                .collect(Collectors.toMap(File::getS3Url, Function.identity()));

        List<ReviewResource> resources = reviewRqBody.imageUrls().stream()
                .map(url -> {
                    File file = fileMap.get(url);
                    if (file == null) throw new ServiceException("해당 파일이 존재하지 않습니다.");
                    boolean isMain = url.equals(reviewRqBody.mainImageUrl());
                    return new ReviewResource(file, review, isMain);
                })
                .collect(Collectors.toList());

        try {
            reviewResourceRepository.saveAll(resources);
        } catch (Exception e) {
            throw new ServiceException("서비스 리소스 저장에 실패했습니다.");
        }
    }

    public Page<ServiceReviewDTO> getReviewsWithServiceId(Pageable pageable, Long serviceId) {
        return serviceReviewRepository.findByServiceId(serviceId, pageable)
                .map(review -> {
                    List<ReviewResource> resources = reviewResourceRepository.findByServiceReview(review);
                    List<String> imageUrls = resources.stream()
                            .map(resource -> resource.getFile().getS3Url())
                            .collect(Collectors.toList());
                    String mainImageUrl = resources.stream()
                            .filter(ReviewResource::getIsRepresentative)
                            .findFirst()
                            .map(resource -> resource.getFile().getS3Url())
                            .orElse(null);
                    return new ServiceReviewDTO(review, imageUrls, mainImageUrl);
                });
    }
}
