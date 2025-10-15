package org.team4.project.domain.activeService.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.activeService.dto.ActiveServiceDTO;
import org.team4.project.domain.activeService.service.ActiveServiceService;
import org.team4.project.global.security.CustomUserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/v1/active-service")
@RequiredArgsConstructor
@Tag(name = "ActiveService API", description = "활성 서비스 기능 관련 API")
public class ActiveServiceController {
    final private ActiveServiceService activeServiceService;

    @PostMapping("/create")
    @Operation(summary = "활성 서비스 생성")
    public ResponseEntity<Void> createActiveService(
            @RequestBody String paymentKey
    ) {
        activeServiceService.createActiveService(paymentKey);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "내 활성 서비스 목록 조회")
    public ResponseEntity<List<ActiveServiceDTO>> getActiveServices(
            @AuthenticationPrincipal CustomUserDetails user
    ) {

        List<ActiveServiceDTO> response = activeServiceService.getActiveServices(user.getUsername());

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @PatchMapping("/update")
    @Operation(summary = "활성 서비스 상태 변경")
    public ResponseEntity<Void> updateActiveService(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody long id
    ) {
        activeServiceService.updateActiveServiceStatus(id);
        return ResponseEntity.ok().build();
    }
}
