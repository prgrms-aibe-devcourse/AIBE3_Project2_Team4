package org.team4.project.domain.profile.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@DiscriminatorValue("CLIENT")
public class ClientProfile extends Profile{
    private String companyName;
    private String teamName;
}
