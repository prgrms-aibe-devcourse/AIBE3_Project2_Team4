package org.team4.project.domain.activeService.service;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.activeService.dto.ActiveServiceDTO;
import org.team4.project.domain.activeService.entity.ActiveService;
import org.team4.project.domain.activeService.exception.OwnerMismatchException;
import org.team4.project.domain.activeService.repository.ActiveServiceRepository;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatRoomRepository;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.domain.payment.entity.Payment;
import org.team4.project.domain.payment.repository.PaymentRepository;
import org.team4.project.domain.payment.service.PaymentService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ActiveServiceService {
    private final ActiveServiceRepository activeServiceRepository;
    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;


    @Transactional
    public void createActiveService(String paymentKey, String userEmail) {
        if (activeServiceRepository.existsByPayment_PaymentKey(paymentKey)) {
            throw new EntityExistsException("이미 활성 서비스가 만들어졌습니다.");
        }

        Payment payment = paymentRepository.findByPaymentKeyAndMemberEmail(paymentKey,userEmail)
                .orElseThrow(() -> new OwnerMismatchException("사용자는 결제의 주인이 아닙니다."));

        activeServiceRepository.save(new ActiveService(payment));
    }

    @Transactional(readOnly = true)
    public List<ActiveServiceDTO> getActiveServices(String email) {
        Member member = memberRepository.findByEmail(email).orElseThrow(()->new EntityNotFoundException("사용자를 찾을 수 없습니다."));


        Long memberId = member.getId();
        List<ActiveService> list = activeServiceRepository.findDistinctByFreelancer_IdOrClient_Id(memberId, memberId);
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
    public void updateActiveServiceStatus(long actionServiceKey, String userEmail) {

        Member client = memberRepository.findByEmail(userEmail).orElseThrow(()->new EntityNotFoundException("사용자를 찾을 수 없습니다."));

        ActiveService activeService = activeServiceRepository.findByIdAndClient_Id(actionServiceKey, client.getId())
                .orElseThrow(()->new OwnerMismatchException("사용자가 활성 서비스의 클라이언트가 아닙니다."));

        activeService.setFinished(true);
    }
}
