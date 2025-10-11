package org.team4.project.domain.profile.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.profile.dto.ClientProfileResponse;
import org.team4.project.domain.profile.dto.FreelancerProfileResponse;
import org.team4.project.domain.profile.dto.ProfileResponse;
import org.team4.project.domain.profile.dto.ProfileUpdateRequest;
import org.team4.project.domain.profile.service.ProfileService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/profiles")
public class ProfileController {
    private final ProfileService profileService;

    /**
     * 클라이언트 프로필 상세 조회
     * @param id 조회할 클라이언트의 ID
     */
    @GetMapping("/clients/{id}")
    public ResponseEntity<ClientProfileResponse> getClientProfile(@PathVariable Long id) {
        ClientProfileResponse response = profileService.findClientProfile(id);

        return ResponseEntity
                .ok()
                .body(response);
    }

    /**
     * 프리랜서 프로필 상세 조회
     * @param id 조회할 프리랜서의 ID
     */
    @GetMapping("/freelancers/{id}")
    public ResponseEntity<FreelancerProfileResponse> getFreelancerProfile(@PathVariable Long id) {
        FreelancerProfileResponse response = profileService.findFreelancerProfile(id);

        return ResponseEntity
                .ok()
                .body(response);
    }

    /**
     * 특정 회원 프로필 조회
     * @param memberId 조회할 회원의 ID
     */
    @GetMapping("/{memberId}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Long memberId) {
        ProfileResponse response = profileService.findProfileByMemberId(memberId);

        return ResponseEntity
                .ok()
                .body(response);
    }

    /**
     * 내 프로필 조회
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        // TODO: 실제 로그인된 ID 가져오기
        Long memberId = 1L; // 임시 사용자 ID
        ProfileResponse response = profileService.findProfileByMemberId(memberId);

        return ResponseEntity
                .ok()
                .body(response);
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
