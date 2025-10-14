package org.team4.project.global.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    public void sendVerificationCode(String toEmail, int code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[이바닥고수들] 이메일 인증 코드");
        message.setText("인증 코드는 " + code + " 입니다. 유효 시간은 5분입니다.");
        mailSender.send(message);
    }

    public void sendPasswordResetLink(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[이바닥고수들] 비밀번호 재설정 안내");

        String resetUrl = "http://localhost:3000/auth/reset-password?email="
                + toEmail + "&token=" + token;

        String text = "안녕하세요, 이바닥고수들입니다.\n\n" +
                "비밀번호 재설정을 요청하셨습니다.\n" +
                "아래 링크를 클릭하여 새 비밀번호를 설정해주세요.\n\n" +
                resetUrl + "\n\n" +
                "※ 해당 링크는 발송 후 5분 동안만 유효합니다.\n" +
                "   5분 내에 비밀번호 재설정을 완료하지 않으면 링크가 만료됩니다.\n\n" +
                "만약 비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시해주세요.";

        message.setText(text);

        mailSender.send(message);
    }
}
