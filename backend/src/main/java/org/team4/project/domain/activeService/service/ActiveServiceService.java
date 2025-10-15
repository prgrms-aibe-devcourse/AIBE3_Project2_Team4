package org.team4.project.domain.activeService.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.activeService.dto.ActiveServiceDTO;
import org.team4.project.domain.activeService.entity.ActiveService;
import org.team4.project.domain.activeService.repository.ActiveServiceRepository;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatRoomRepository;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.domain.payment.entity.Payment;
import org.team4.project.domain.payment.service.PaymentService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActiveServiceService {
    private final ActiveServiceRepository activeServiceRepository;
    private final PaymentService paymentService;
    private final MemberService memberService;
    private final ChatRoomRepository chatRoomRepository;


    @Transactional
    public void createActiveService(String paymentKey) {
        Payment payment = paymentService.findPaymentById(paymentKey);

        ActiveService activeService = new ActiveService(payment);

        activeServiceRepository.save(activeService);
    }

    @Transactional(readOnly = true)
    public List<ActiveServiceDTO> getActiveServices(String email) {
        Member member = memberService.getMemberByEmail(email);


        Long memberId = member.getId();
        List<ActiveService> list = activeServiceRepository.findByFreelancer_IdOrClient_Id(memberId, memberId);
        return list
                .stream()
                .map((ac)-> {
                    ChatRoom chatRoom = chatRoomRepository.findByClientAndFreelancer(ac.getClient(), ac.getFreelancer())
                            .orElseThrow(()->new EntityNotFoundException("채팅방을 찾을 수 없습니다."));

                    return ActiveServiceDTO.from(ac, member.getMemberRole(), chatRoom.getId());
                })
                .toList();
    }

    @Transactional
    public void updateActiveServiceStatus(long id) {
        ActiveService activeService = activeServiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 활성 서비스입니다."));

        activeService.setFinished(true);
        activeServiceRepository.save(activeService);
    }
}
