package org.team4.project.domain.file.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.team4.project.domain.file.dto.FileResponse;
import org.team4.project.domain.file.entity.File;
import org.team4.project.domain.file.exception.FileUploadException;
import org.team4.project.domain.file.repository.FileRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FileService {

    private final S3UploadService s3UploadService;
    private final FileRepository fileRepository;

    // 파일 카테고리 -> S3 디렉토리 경로 반환
    private String getS3DirectoryPath(String fileCategory) {
        return switch (fileCategory) {
            case "PROFILE_IMAGE" -> "profile-images/";
            case "PORTFOLIO_FILE" -> "portfolio-files/";
            case "CHAT_FILE" -> "chat-files/";
            case "SERVICE_IMAGE" -> "service-images/";
            default -> throw new FileUploadException("유효하지 않은 파일 카테고리입니다: " + fileCategory);
        };
    }

    // 단일 파일 업로드 및 DB 저장
    public FileResponse uploadSingleFile(MultipartFile multipartFile, String fileCategory, Long referenceId) {
        String directoryPath = getS3DirectoryPath(fileCategory);
        String s3Url = s3UploadService.uploadFile(multipartFile, directoryPath);

        // S3 파일명 추출 (s3Url에서 도메인네임 제거)
        String s3FileName = s3Url.substring(s3Url.lastIndexOf(directoryPath));

        File fileEntity = File.builder()
                .originalFileName(multipartFile.getOriginalFilename())
                .s3FileName(s3FileName)
                .s3Url(s3Url)
                .fileExtension(StringUtils.getFilenameExtension(multipartFile.getOriginalFilename()))
                .fileSize(multipartFile.getSize())
                .fileCategory(fileCategory)
                .referenceId(referenceId)
                .build();

        File savedFile = fileRepository.save(fileEntity);
        log.info("파일 업로드 성공: originalFileName={}, s3Url={}", savedFile.getOriginalFileName(), savedFile.getS3Url());

        return FileResponse.from(savedFile);
    }

    // 다건 파일 업로드 및 DB 저장
    public List<FileResponse> uploadMultipleFiles(List<MultipartFile> multipartFiles, String fileCategory, Long referenceId) {
        if (multipartFiles == null || multipartFiles.isEmpty()) {
            throw new FileUploadException("업로드할 파일이 없습니다.");
        }

        return multipartFiles.stream()
                .map(file -> uploadSingleFile(file, fileCategory, referenceId))
                .collect(Collectors.toList());
    }

    // 단일 파일 수정 (기존 파일 삭제 후 새 파일 업로드)
    public FileResponse updateFile(Long fileId, MultipartFile newFile, String fileCategory, Long referenceId) {
        File existingFile = fileRepository.findById(fileId)
                .orElseThrow(() -> new EntityNotFoundException("기존 파일을 찾을 수 없습니다. fileId: " + fileId));

        // S3에서 기존 파일 삭제 및 DB에서도 삭제
        s3UploadService.deleteFile(existingFile.getS3FileName());
        fileRepository.delete(existingFile);

        // 새 파일 업로드
        return uploadSingleFile(newFile, fileCategory, referenceId);
    }

    // S3 및 DB 파일 삭제
    public void deleteFile(Long fileId, String fileCategory, Long referenceId) {
        File file = fileRepository.findByIdAndFileCategoryAndReferenceId(fileId, fileCategory, referenceId)
                .orElseThrow(() -> new EntityNotFoundException("삭제할 파일을 찾을 수 없습니다. fileId: " + fileId + ", category: " + fileCategory));

        s3UploadService.deleteFile(file.getS3FileName());
        fileRepository.delete(file);
        log.info("파일 삭제 성공: fileId={}, s3Url={}", fileId, file.getS3Url());
    }

    // 특정 카테고리와 참조 ID에 해당하는 파일들 조회
    @Transactional(readOnly = true)
    public List<FileResponse> getFilesByCategoryAndReferenceId(String fileCategory, Long referenceId) {
        List<File> files = fileRepository.findByFileCategoryAndReferenceId(fileCategory, referenceId);

        return files.stream()
                .map(FileResponse::from)
                .collect(Collectors.toList());
    }
}