package org.team4.project.domain.profile.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@DiscriminatorValue("FREELANCER")
public class FreelancerProfile extends Profile {
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tech_stack", joinColumns = @JoinColumn(name = "freelancer_profile_id"))
    private List<String> techStacks = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "certificate", joinColumns = @JoinColumn(name = "freelancer_profile_id"))
    private List<String> certificates = new ArrayList<>();

    @OneToMany(mappedBy = "freelancerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Career> careers = new ArrayList<>();

    @OneToMany(mappedBy = "freelancerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Portfolio> portfolios = new ArrayList<>();

    // careers 연관관계 편의 메서드
    public void addCareer(Career career) {
        this.careers.add(career);
        career.setFreelancerProfile(this); // career 객체에도 freelancer 자신을 설정
    }

    // portfolios 연관관계 편의 메서드
    public void addPortfolio(Portfolio portfolio) {
        this.portfolios.add(portfolio);
        portfolio.setFreelancerProfile(this); // portfolio 객체에도 freelancer 자신을 설정
    }
}
