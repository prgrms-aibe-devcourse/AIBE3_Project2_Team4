package org.team4.project.domain.profile.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String link;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id")
    private FreelancerProfile freelancerProfile; // 외래키
}