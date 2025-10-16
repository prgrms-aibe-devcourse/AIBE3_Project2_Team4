package org.team4.project.domain.service.entity.reviews;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.team4.project.domain.file.entity.File;
import org.team4.project.global.jpa.entity.BaseEntity;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResource extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private File file;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private ServiceReview serviceReview;

    private Boolean isRepresentative;

    @Builder
    public ReviewResource(File file, ServiceReview serviceReview, Boolean isRepresentative) {
        this.file = file;
        this.serviceReview = serviceReview;
        this.isRepresentative = isRepresentative;
    }
}
