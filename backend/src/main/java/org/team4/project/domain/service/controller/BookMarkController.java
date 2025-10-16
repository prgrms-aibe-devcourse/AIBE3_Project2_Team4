package org.team4.project.domain.service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.service.BookMarkService;
import org.team4.project.global.security.CustomUserDetails;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/bookmarks")
public class BookMarkController {
    private final BookMarkService bookMarkService;

    @Transactional
    @PostMapping("/services/{serviceId}")
    public void toggleBookMark(
            @PathVariable Long serviceId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        bookMarkService.createBookmark(customUserDetails.getEmail(), serviceId);
    }

    @Transactional(readOnly = true)
    @GetMapping("/services/{serviceId}/bookmark")
    public boolean isBookmarked(
            @PathVariable Long serviceId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        if (customUserDetails == null || customUserDetails.getEmail().isEmpty()) return false;
        return bookMarkService.isBookmarked(customUserDetails.getEmail(), serviceId);
    }

    @Transactional(readOnly = true)
    @GetMapping("/services")
    public Page<ServiceDTO> getBookmarkedServices(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @PageableDefault(page = 0, size = 9, sort="id", direction = Sort.Direction.DESC) Pageable pageable) {
        return bookMarkService.getBookmarkedServices(customUserDetails.getEmail(), pageable);
    }

    @Transactional
    @DeleteMapping("/services/{serviceId}")
    public void deleteBookmark(
            @PathVariable Long serviceId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails) {
        bookMarkService.deleteBookmark(customUserDetails.getEmail(), serviceId);
    }
}
