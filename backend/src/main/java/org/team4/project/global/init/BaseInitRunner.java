package org.team4.project.global.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.activeService.entity.ActiveService;
import org.team4.project.domain.activeService.repository.ActiveServiceRepository;
import org.team4.project.domain.activeService.service.ActiveServiceService;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.service.ChatRoomService;
import org.team4.project.domain.member.dto.MemberSignUpRequestDTO;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.domain.payment.entity.Payment;
import org.team4.project.domain.payment.entity.PaymentMethod;
import org.team4.project.domain.payment.entity.PaymentStatus;
import org.team4.project.domain.payment.repository.PaymentRepository;
import org.team4.project.domain.payment.service.PaymentService;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.domain.service.repository.ServiceRepository;
import org.team4.project.domain.service.repository.TagRepository;
import org.team4.project.domain.service.service.ServiceService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class BaseInitRunner {
    @Autowired
    @Lazy
    BaseInitRunner self;

    @Bean
    public ApplicationRunner init(){
        return args -> {

        };
    }
}
