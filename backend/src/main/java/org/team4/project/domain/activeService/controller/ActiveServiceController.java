package org.team4.project.domain.activeService.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.team4.project.domain.activeService.dto.ActiveServiceDTO;
import org.team4.project.domain.activeService.service.ActiveServiceService;
import org.team4.project.domain.member.dto.MemberProfileResponseDTO;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.global.security.CustomUserDetails;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RestController("/api/v1/active-service")
@Tag(name = "ActiveService API", description = "활성 서비스 기능 관련 API")
public class ActiveServiceController {
    final private ActiveServiceService activeServiceService;
    final private MemberService memberService;

    @PostMapping("/create")
    @Operation()
    public ResponseEntity<Void> createActiveService(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody String paymentKey
    ) {
        activeServiceService.createActiveService(paymentKey);

        return ResponseEntity.ok().build();
    }

    // 활성 서비스 목록 보기
    @PostMapping
    @Operation()
    public ResponseEntity<List<ActiveServiceDTO>> getActiveServices(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        Member member = memberService.getMemberByEmail(user.getUsername());
        List<ActiveServiceDTO> response = activeServiceService.findActiveServicesByMemberId(member.getId())
                .stream()
                .map((ac)-> ActiveServiceDTO.from(ac, member.getMemberRole()))
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    // 활성 서비스 상태 변경
    @PatchMapping
    @Operation()
    public ResponseEntity<Void> updateActiveService(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody long id) {

        activeServiceService.updateActiveServiceStatus(id);

        return ResponseEntity.ok().build();
    }
}
