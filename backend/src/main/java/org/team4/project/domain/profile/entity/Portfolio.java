package org.team4.project.domain.profile.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.team4.project.domain.profile.dto.PortfolioRequestDto;

@Entity
@Getter
@Setter
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

    // DTO와 부모 엔티티 -> Portfolio
    public static Portfolio from(PortfolioRequestDto dto, FreelancerProfile freelancerProfile) {
        return new Portfolio (
                dto.getTitle(),
                dto.getDescription(),
                dto.getLink(),
                freelancerProfile
        );
    }

    public Portfolio(String title, String description, String link, FreelancerProfile freelancerProfile) {
        this.title = title;
        this.description = description;
        this.link = link;
        this.freelancerProfile = freelancerProfile;
    }
}