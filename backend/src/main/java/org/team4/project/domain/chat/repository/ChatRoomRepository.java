package org.team4.project.domain.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.member.entity.Member;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    // 두 사용자가 참여중인 채팅방이 있는지 확인
    @Query("SELECT r FROM ChatRoom r WHERE (r.client = :user1 AND r.freelancer = :user2) OR (r.client = :user2 AND r.freelancer = :user1)")
    Optional<ChatRoom> findByClientAndFreelancer(@Param("user1") Member user1, @Param("user2") Member user2);

    // 특정 사용자가 참여하고 있는 모든 채팅방을 조회
    @Query("SELECT r FROM ChatRoom r WHERE r.client = :participant OR r.freelancer = :participant")
    List<ChatRoom> findAllByParticipant(@Param("participant") Member participant);
}