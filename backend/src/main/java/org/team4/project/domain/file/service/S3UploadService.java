package org.team4.project.domain.file.service;

import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.team4.project.domain.file.exception.FileUploadException;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class S3UploadService {

    private final S3Template s3Template;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    // S3 파일 업로드
    public String uploadFile(MultipartFile multipartFile, String directoryPath) {
        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new FileUploadException("업로드할 파일이 없습니다.");
        }

        String originalFileName = multipartFile.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String s3FileName = directoryPath + UUID.randomUUID() + "_" + originalFileName; // S3에 저장될 파일명 (폴더 경로 + UUID_원본파일명)

        validateFile(fileExtension, multipartFile.getSize());

        try (InputStream inputStream = multipartFile.getInputStream()) {
            S3Resource s3Resource = s3Template.upload(bucket, s3FileName, inputStream);

            return s3Resource.getURL().toString(); // 업로드 된 S3 파일 URL
        } catch (IOException e) {
            log.error("S3 파일 업로드 실패: {}", e.getMessage());
            throw new FileUploadException("S3 파일 업로드에 실패했습니다.", e);
        }
    }

    // S3 파일 삭제
    public void deleteFile(String s3FileName) {
        if (!StringUtils.hasText(s3FileName)) {
            log.warn("삭제할 S3 파일명이 비어있습니다.");
            return;
        }

        s3Template.deleteObject(bucket, s3FileName);
    }

    // 확장자 추출
    public String getFileExtension(String fileName) {
        try {
            return fileName.substring(fileName.lastIndexOf("."));
        } catch (StringIndexOutOfBoundsException e) {
            throw new FileUploadException("파일 확장자가 올바르지 않습니다.");
        }
    }

    // 파일 유효성 검사
    private void validateFile(String fileExtension, long fileSize) {
        // 허용된 확장자 목록 (임시)
        List<String> allowedExtensions = List.of(".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx");
        if (!allowedExtensions.contains(fileExtension.toLowerCase())) {
            throw new FileUploadException("허용되지 않는 파일 확장자입니다: " + fileExtension);
        }

        // 최대 파일 크기 (임시 10MB)
        long maxFileSize = 10 * 1024 * 1024;
        if (fileSize > maxFileSize) {
            throw new FileUploadException("파일 크기가 너무 큽니다. 최대 " + (maxFileSize / (1024 * 1024)) + "MB까지 허용됩니다.");
        }
    }
}