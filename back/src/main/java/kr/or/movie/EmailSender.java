package kr.or.movie;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailSender {
	@Autowired
	private JavaMailSender sender;

//	public boolean sendMail(String mailTitle, String receiver, String mailContent) {
//		MimeMessage message = sender.createMimeMessage();
//		MimeMessageHelper helper = new MimeMessageHelper(message);
//		boolean result = false;
//
//		try {
//			helper.setSentDate(new Date());
//			// 수신자
//			helper.setFrom(new InternetAddress("mpy2221mpy2221@gmail.com","kh"));
//			helper.setTo(receiver);
//			helper.setSubject(mailTitle);
//			helper.setText(mailContent, true);
//			sender.send(message);
//			result = true;
//		} catch (MessagingException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (UnsupportedEncodingException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
//		return result;
//	}

	public String sendPw(String email) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		// 랜덤코드생성
		Random r = new Random();
		StringBuffer sb = new StringBuffer();
		for(int i=0;i<10;i++){
			int flag = r.nextInt(3); //0,1,2
			if(flag == 0){
				int randomCode = r.nextInt(10);
				sb.append(randomCode);
			}else if(flag == 1){
				char randomChar = (char)(r.nextInt(26)+65);
				sb.append(randomChar);
			}else{
				char randomChar = (char)(r.nextInt(26)+97);
				sb.append(randomChar);
			}
		}

	
		try {
			helper.setSentDate(new Date());
			// 수신자
			helper.setFrom(new InternetAddress("mpy2221mpy2221@gmail.com","kh"));
			helper.setTo(email);
			helper.setSubject("Park's 입니다.");
			helper.setText(
				"<h1>안녕하세요. Park's 입니다.</h1>" +
				"<h3>임시비밀번호는 <span style='color:red;'> " + sb.toString() + " </span>입니다.</h3>"
			,true);
			sender.send(message);
		
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			sb = null;
			e.printStackTrace();
		}
		if(sb == null){
			return null;
		}else{
			return sb.toString();
		}
		
	}
}
