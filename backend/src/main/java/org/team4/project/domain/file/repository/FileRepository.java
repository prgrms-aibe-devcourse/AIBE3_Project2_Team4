package org.team4.project.domain.file.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.team4.project.domain.file.entity.File;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Long> {
    Optional<File> findByIdAndFileCategoryAndReferenceId(Long id, String fileCategory, Long referenceId);
    List<File> findByFileCategoryAndReferenceId(String fileCategory, Long referenceId);
    List<File> findAllByS3UrlIn(List<String> s3Urls);
}