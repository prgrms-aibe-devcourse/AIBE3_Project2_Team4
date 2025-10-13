package org.team4.project.domain.service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.service.entity.reviews.ServiceReview;

import java.util.List;

@Repository
public interface ServiceReviewRepository extends JpaRepository<ServiceReview,Long> {
    @Query("SELECT AVG(sr.rating) FROM ServiceReview sr WHERE sr.service.id = :serviceId")
    Float findAvgRatingByService(@Param("serviceId") Long serviceId);

    @Query("SELECT COUNT(sr) FROM ServiceReview sr WHERE sr.service.id = :serviceId")
    Integer countByServiceId(@Param("serviceId") Long serviceId);

    @Query("""
    SELECT sr
    FROM ServiceReview sr
    WHERE sr.service.id = :serviceId
""")
    Page<ServiceReview> findByServiceId(@Param("serviceId") Long serviceId, Pageable pageable);
}