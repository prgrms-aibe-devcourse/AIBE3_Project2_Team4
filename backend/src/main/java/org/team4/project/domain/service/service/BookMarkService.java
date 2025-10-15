package org.team4.project.domain.service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.entity.bookmark.BookMark;
import org.team4.project.domain.service.entity.category.Category;
import org.team4.project.domain.service.entity.category.TagService;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.exception.ServiceException;
import org.team4.project.domain.service.repository.*;
import org.team4.project.domain.service.repository.BookMarkRepository;
import org.team4.project.domain.service.repository.ServiceRepository;
import org.team4.project.domain.service.repository.ServiceReviewRepository;
import org.team4.project.domain.service.repository.TagServiceRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookMarkService {
    private final BookMarkRepository bookMarkRepository;
    private final ServiceRepository serviceRepository;
    private final MemberRepository memberRepository;
    private final TagServiceRepository tagServiceRepository;
    private final ServiceReviewRepository serviceReviewRepository;
    private final ServiceResourceRepository serviceResourceRepository;

    @Transactional
    public void createBookmark(String memberEmail, Long serviceId) {
        Member member = memberRepository.findByEmail(memberEmail).orElseThrow(
                () -> new ServiceException("멤버가 존재하지 않습니다.")
        );

        ProjectService service = serviceRepository.findById(serviceId).orElseThrow(
                () -> new ServiceException("서비스가 존재하지 않습니다.")
        );
        bookMarkRepository.save(BookMark.createBookMark(service, member));
    }

    public boolean isBookmarked(String memberEmail, Long serviceId) {
        Member member = memberRepository.findByEmail(memberEmail).orElseThrow(() ->
                new ServiceException("멤버가 존재하지 않습니다.")
        );
        return bookMarkRepository.existsByServiceIdAndMemberId(member.getId(), serviceId);
    }

    public Page<ServiceDTO> getBookmarkedServices(String memberEmail, Pageable page) {
        Member member = memberRepository.findByEmail(memberEmail).orElseThrow(() ->
                new ServiceException("멤버가 존재하지 않습니다.")
        );
        return bookMarkRepository.findByServiceIdAndMemberId(member.getId(), page)
                .map(Bookmark -> {
                    ProjectService service = Bookmark.getService();
                    List<TagService> tagServices = tagServiceRepository.findByService(service);
                    Category category = tagServices.getFirst().getTag().getCategory();
                    Integer reviewCount = serviceReviewRepository.countByServiceId(service.getId());
                    Float rating = serviceReviewRepository.findAvgRatingByService(service.getId());
                    String mainImage = serviceResourceRepository.findByProjectServiceAndIsRepresentative(service.getId())
                            .map(resource -> resource.getFile().getS3Url())
                            .orElse(null);
                    return new ServiceDTO(service, tagServices, category, reviewCount, rating, mainImage);
                });
    }

    @Transactional
    public void deleteBookmark(String memberEmail, Long serviceId) {
        Member member = memberRepository.findByEmail(memberEmail).orElseThrow(
                () -> new ServiceException("멤버가 존재하지 않습니다.")
        );

        ProjectService service = serviceRepository.findById(serviceId).orElseThrow(
                () -> new ServiceException("서비스가 존재하지 않습니다.")
        );

        BookMark bookMark = bookMarkRepository.findOneByMemberIdAndMemberId(member.getId(), service.getId()).orElseThrow(
                () -> new ServiceException("북마크가 존재하지 않습니다.")
        );

        bookMarkRepository.delete(bookMark);
    }
}
