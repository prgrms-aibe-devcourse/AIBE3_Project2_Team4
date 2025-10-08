package org.team4.project.domain.profile.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Career {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String position;
    private String companyName;
    private String term;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id")
    private FreelancerProfile freelancerProfile; // 외래키
}
