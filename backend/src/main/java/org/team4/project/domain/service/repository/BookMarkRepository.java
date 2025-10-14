package org.team4.project.domain.service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.service.entity.bookmark.BookMark;

import java.util.Optional;

@Repository
public interface BookMarkRepository extends JpaRepository<BookMark,Long> {
    @Query("SELECT COUNT(bm) FROM BookMark bm WHERE bm.service.id = :serviceId" )
    Integer countByServiceId(@Param("serviceId")Long serviceId);

    @Query("SELECT bm FROM BookMark bm WHERE bm.member.id = :memberId AND bm.service.id = :serviceId" )
    Optional<BookMark> findOneByMemberIdAndMemberId(@Param("memberId") Long memberId,
                                                   @Param("serviceId") Long serviceId);

    Boolean existsByServiceIdAndMemberId(Long serviceId, Long memberId);

    @Query("""
    SELECT bm FROM BookMark bm
    JOIN FETCH bm.service WHERE bm.member.id = :memberId
    """)
    Page<BookMark> findByServiceIdAndMemberId(@Param("memberId") Long memberId,
                                              Pageable pageable);
}
