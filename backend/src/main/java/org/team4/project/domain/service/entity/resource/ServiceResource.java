package org.team4.project.domain.service.entity.resource;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.team4.project.domain.file.entity.File;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.global.jpa.entity.BaseEntity;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResource extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private File file;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private ProjectService projectService;

    private Boolean isRepresentative;

    @Builder
    public ServiceResource(File file, ProjectService projectService, Boolean isRepresentative) {
        this.file = file;
        this.projectService = projectService;
        this.isRepresentative = isRepresentative;
    }
}
