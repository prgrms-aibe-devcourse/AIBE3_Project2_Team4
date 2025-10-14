package org.team4.project.domain.file.dto;

import lombok.Builder;
import lombok.Getter;
import org.team4.project.domain.file.entity.File;

@Getter
@Builder
public class FileResponse {
    private Long id;
    private String originalFileName;
    private String s3Url;
    private String fileCategory;
    private Long referenceId;

    public static FileResponse from(File file) {
        return FileResponse.builder()
                .id(file.getId())
                .originalFileName(file.getOriginalFileName())
                .s3Url(file.getS3Url())
                .fileCategory(file.getFileCategory())
                .referenceId(file.getReferenceId())
                .build();
    }
}