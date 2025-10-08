package org.team4.project.domain.profile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.team4.project.domain.profile.entity.Profile;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByMemberId(Long id);
}
