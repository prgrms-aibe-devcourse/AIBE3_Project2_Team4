package org.team4.project.domain.profile.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
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
}
