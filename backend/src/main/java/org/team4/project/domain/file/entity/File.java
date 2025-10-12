package org.team4.project.domain.file.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@DynamicUpdate // 변경된 필드만 업데이트 쿼리에 포함
@Table(name = "uploaded_file")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalFileName; // 원본 파일명
    private String s3FileName;       // S3 파일명 (폴더 경로 + UUID_원본파일명)
    private String s3Url;            // S3 파일의 URL
    private String fileExtension;    // 파일 확장자
    private Long fileSize;           // 파일 크기 (bytes)
    private String fileCategory;     // 파일 카테고리 ("PROFILE_IMAGE", "PORTFOLIO_FILE")

    // 어떤 엔티티에 연관된 파일인지 식별하기 위한 필드
    private Long referenceId; // memberId, portfolioId, ProjectServiceId, chatId 등
}