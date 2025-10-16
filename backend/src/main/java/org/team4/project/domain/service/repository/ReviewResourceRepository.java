package org.team4.project.domain.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.service.entity.resource.ServiceResource;
import org.team4.project.domain.service.entity.reviews.ReviewResource;
import org.team4.project.domain.service.entity.reviews.ServiceReview;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewResourceRepository extends JpaRepository<ReviewResource,Long> {
    List<ReviewResource> findByServiceReview(ServiceReview serviceReview);

    @Query("SELECT rr FROM ReviewResource rr WHERE rr.serviceReview.id = :reviewId AND rr.isRepresentative = true")
    Optional<ReviewResource> findByServiceReviewAndIsRepresentative(@Param("reviewId") Long reviewId);
}
