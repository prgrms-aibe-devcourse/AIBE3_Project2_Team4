package org.team4.project.domain.profile.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@DiscriminatorValue("CLIENT")
public class ClientProfile extends Profile{
    private String companyName;
    private String teamName;
}
