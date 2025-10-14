package org.team4.project.domain.file.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.team4.project.domain.file.dto.FileResponse;
import org.team4.project.domain.file.service.FileService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileService fileService;

    /**
     * 단일 파일 업로드
     * POST /api/v1/uploads/single
     *
     * @param fileCategory 파일 카테고리 (예: PROFILE_IMAGE, CHAT_FILE)
     * @param referenceId  이 파일이 어떤 엔티티에 속하는지 (예: memberId, chatRoomId)
     * @param file         실제 업로드할 파일
     */
    @PostMapping(value = "/single", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> uploadSingleFile(
            @RequestParam String fileCategory,
            @RequestParam(required = false) Long referenceId,
            @RequestParam MultipartFile file) {
        FileResponse response = fileService.uploadSingleFile(file, fileCategory, referenceId);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * 다중 파일 업로드
     * POST /api/v1/uploads/multi
     *
     * @param fileCategory 파일 카테고리
     * @param referenceId  참조 ID
     * @param files        실제 업로드할 파일 목록
     */
    @PostMapping(value = "/multi", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<FileResponse>> uploadMultipleFiles(
            @RequestParam String fileCategory,
            @RequestParam(required = false) Long referenceId,
            @RequestParam List<MultipartFile> files) {
        List<FileResponse> responses = fileService.uploadMultipleFiles(files, fileCategory, referenceId);

        return new ResponseEntity<>(responses, HttpStatus.CREATED);
    }

    /**
     * 파일 수정 (단일 파일 교체)
     * PUT /api/v1/uploads/{fileId}
     *
     * @param fileId       수정할 기존 파일의 ID
     * @param fileCategory 파일 카테고리
     * @param referenceId  참조 ID
     * @param newFile      새 파일
     */
    @PutMapping(value = "/{fileId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> updateFile(
            @PathVariable Long fileId,
            @RequestParam String fileCategory,
            @RequestParam(required = false) Long referenceId,
            @RequestParam("file") MultipartFile newFile) {
        FileResponse response = fileService.updateFile(fileId, newFile, fileCategory, referenceId);

        return ResponseEntity.ok(response);
    }

    /**
     * 파일 삭제
     * DELETE /api/v1/uploads/{fileId}
     *
     * @param fileId       삭제할 파일의 ID
     * @param fileCategory 파일 카테고리
     * @param referenceId  참조 ID
     */
    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable Long fileId,
            @RequestParam String fileCategory,
            @RequestParam(required = false) Long referenceId) {
        fileService.deleteFile(fileId, fileCategory, referenceId);

        return ResponseEntity.noContent().build(); // 204 No Content
    }

    /**
     * 특정 카테고리/참조 ID에 해당하는 파일 목록 조회 (예: 특정 포트폴리오의 이미지들)
     * GET /api/v1/uploads?fileCategory=PORTFOLIO_FILE&referenceId=123
     */
    @GetMapping
    public ResponseEntity<List<FileResponse>> getFiles(
            @RequestParam String fileCategory,
            @RequestParam(required = false) Long referenceId) {
        List<FileResponse> responses = fileService.getFilesByCategoryAndReferenceId(fileCategory, referenceId);

        return ResponseEntity.ok(responses);
    }
}