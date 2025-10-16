package org.team4.project.domain.service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ProjectService, Long> {
    @Query("select s from ProjectService s join fetch s.freelancer")
    List<ProjectService> findAllWithFreelancer(Pageable pageable);

    @EntityGraph(attributePaths = {"freelancer", "reviews"})
    Page<ProjectService> findAllByFreelancer_Email(String email, Pageable pageable);

    @Query("""
        SELECT s
        FROM ProjectService s
        LEFT JOIN s.reviews r
        GROUP BY s
        ORDER BY COUNT(r) DESC
        """)
    Page<ProjectService> findAllOrderByReviewCountDesc(Pageable pageable);

    @Query("SELECT s FROM ProjectService s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ProjectService> searchByTitle(@Param("keyword") String keyword, Pageable pageable);
}
