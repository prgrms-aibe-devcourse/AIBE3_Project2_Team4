package org.team4.project.domain.profile.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.team4.project.domain.profile.dto.CareerRequestDto;

@Entity
@Getter
@Setter
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

    // // DTO와 부모 엔티티 -> Career
    public static Career from(CareerRequestDto dto, FreelancerProfile freelancer) {
        return new Career(
                dto.getPosition(),
                dto.getCompanyName(),
                dto.getTerm(),
                dto.getDescription(),
                freelancer
        );
    }

    public Career(String position, String companyName, String term, String description, FreelancerProfile freelancerProfile) {
        this.position = position;
        this.companyName = companyName;
        this.term = term;
        this.description = description;
        this.freelancerProfile = freelancerProfile;
    }

}
