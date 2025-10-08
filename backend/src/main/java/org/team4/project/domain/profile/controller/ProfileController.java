package org.team4.project.domain.profile.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.profile.dto.ProfileResponse;
import org.team4.project.domain.profile.dto.ProfileUpdateRequest;
import org.team4.project.domain.profile.service.ProfileService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/profiles")
public class ProfileController {
    private final ProfileService profileService;

    /**
     * 특정 회원 프로필 조회
     * @param memberId 조회할 회원의 ID
     */
    @GetMapping("/{memberId}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Long memberId) {
        ProfileResponse profileResponse = profileService.findProfileByMemberId(memberId);

        return ResponseEntity
                .ok()
                .body(profileResponse);
    }

    /**
     * 내 프로필 조회
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        // TODO: 실제 로그인된 ID 가져오기
        Long memberId = 1L; // 임시 사용자 ID
        ProfileResponse profileResponse = profileService.findProfileByMemberId(memberId);

        return ResponseEntity
                .ok()
                .body(profileResponse);
    }

    /**
     * 내 프로필 수정
     */
    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(@RequestBody ProfileUpdateRequest request) {
        // TODO: 실제 로그인된 ID 가져오기
        Long memberId = 1L; // 임시 사용자 ID
        profileService.updateMyProfile(memberId, request);

        return ResponseEntity
                .ok()
                .build();
    }
}
