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

	public String sendEmailAuth(String email) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		// 랜덤코드생성
		Random r = new Random();
		StringBuffer sb = new StringBuffer();
		for(int i=0;i<4;i++){
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
			helper.setFrom(new InternetAddress("mpy2221mpy2221@gmail.com","MOVIE PORTFOLIO"));
			helper.setTo(email);
			helper.setSubject("[MOVIE PORTFOLIO] 이메일 인증번호 안내");
			helper.setText(
				"<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
				"<meta charset='UTF-8'>" +
				"<style>" +
				"body { font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }" +
				".container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }" +
				".header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center; }" +
				".header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; }" +
				".header p { color: #b0b0b0; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 4px; }" +
				".content { padding: 50px 40px; }" +
				".greeting { font-size: 18px; color: #1e1e1e; margin-bottom: 20px; line-height: 1.6; }" +
				".auth-section { background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }" +
				".auth-code { font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 8px; margin: 20px 0; font-family: 'Courier New', monospace; }" +
				".auth-label { color: #ffffff; font-size: 16px; margin-bottom: 10px; }" +
				".notice { background-color: #f8f8f8; padding: 20px; border-left: 4px solid #ffa500; margin: 30px 0; border-radius: 4px; }" +
				".notice p { margin: 5px 0; color: #666666; font-size: 14px; line-height: 1.6; }" +
				".footer { background-color: #1a1a1a; padding: 30px; text-align: center; }" +
				".footer p { color: #b0b0b0; margin: 5px 0; font-size: 12px; }" +
				"</style>" +
				"</head>" +
				"<body>" +
				"<div class='container'>" +
				"<div class='header'>" +
				"<h1>MOVIE</h1>" +
				"<p>PORTFOLIO</p>" +
				"</div>" +
				"<div class='content'>" +
				"<div class='greeting'>" +
				"안녕하세요.<br>" +
				"<strong>MOVIE PORTFOLIO</strong>에 오신 것을 환영합니다." +
				"</div>" +
				"<div class='auth-section'>" +
				"<div class='auth-label'>이메일 인증번호</div>" +
				"<div class='auth-code'>" + sb.toString() + "</div>" +
				"</div>" +
				"<div class='notice'>" +
				"<p><strong>안내사항</strong></p>" +
				"<p>• 인증번호는 3분간 유효합니다.</p>" +
				"<p>• 인증번호는 타인에게 공유하지 마세요.</p>" +
				"<p>• 본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>" +
				"</div>" +
				"</div>" +
				"<div class='footer'>" +
				"<p>© 2025 MOVIE PORTFOLIO. All rights reserved.</p>" +
				"<p>영화 추천 사이트</p>" +
				"</div>" +
				"</div>" +
				"</body>" +
				"</html>"
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

	public boolean sendFindId(String email, String memberId) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		boolean result = false;

		try {
			helper.setSentDate(new Date());
			helper.setFrom(new InternetAddress("mpy2221mpy2221@gmail.com","MOVIE PORTFOLIO"));
			helper.setTo(email);
			helper.setSubject("[MOVIE PORTFOLIO] 아이디 찾기 안내");
			helper.setText(
				"<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
				"<meta charset='UTF-8'>" +
				"<style>" +
				"body { font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }" +
				".container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }" +
				".header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center; }" +
				".header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; }" +
				".header p { color: #b0b0b0; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 4px; }" +
				".content { padding: 50px 40px; }" +
				".greeting { font-size: 18px; color: #1e1e1e; margin-bottom: 20px; line-height: 1.6; }" +
				".id-section { background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }" +
				".id-value { font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 2px; margin: 20px 0; font-family: 'Courier New', monospace; }" +
				".id-label { color: #ffffff; font-size: 16px; margin-bottom: 10px; }" +
				".notice { background-color: #f8f8f8; padding: 20px; border-left: 4px solid #ffa500; margin: 30px 0; border-radius: 4px; }" +
				".notice p { margin: 5px 0; color: #666666; font-size: 14px; line-height: 1.6; }" +
				".footer { background-color: #1a1a1a; padding: 30px; text-align: center; }" +
				".footer p { color: #b0b0b0; margin: 5px 0; font-size: 12px; }" +
				"</style>" +
				"</head>" +
				"<body>" +
				"<div class='container'>" +
				"<div class='header'>" +
				"<h1>MOVIE</h1>" +
				"<p>PORTFOLIO</p>" +
				"</div>" +
				"<div class='content'>" +
				"<div class='greeting'>" +
				"안녕하세요.<br>" +
				"<strong>MOVIE PORTFOLIO</strong> 아이디 찾기 결과입니다." +
				"</div>" +
				"<div class='id-section'>" +
				"<div class='id-label'>회원 아이디</div>" +
				"<div class='id-value'>" + memberId + "</div>" +
				"</div>" +
				"<div class='notice'>" +
				"<p><strong>안내사항</strong></p>" +
				"<p>• 아이디는 타인에게 공유하지 마세요.</p>" +
				"<p>• 본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>" +
				"<p>• 비밀번호를 잊으셨다면 비밀번호 찾기를 이용해주세요.</p>" +
				"</div>" +
				"</div>" +
				"<div class='footer'>" +
				"<p>© 2025 MOVIE PORTFOLIO. All rights reserved.</p>" +
				"<p>영화 추천 사이트</p>" +
				"</div>" +
				"</div>" +
				"</body>" +
				"</html>"
			,true);
			sender.send(message);
			result = true;
		
		} catch (MessagingException e) {
			e.printStackTrace();
			result = false;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			result = false;
		}
		
		return result;
	}

	public String sendFindPw(String email, String memberId) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		// 임시 비밀번호 생성
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
			helper.setFrom(new InternetAddress("mpy2221mpy2221@gmail.com","MOVIE PORTFOLIO"));
			helper.setTo(email);
			helper.setSubject("[MOVIE PORTFOLIO] 임시 비밀번호 안내");
			helper.setText(
				"<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
				"<meta charset='UTF-8'>" +
				"<style>" +
				"body { font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }" +
				".container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }" +
				".header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center; }" +
				".header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; }" +
				".header p { color: #b0b0b0; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 4px; }" +
				".content { padding: 50px 40px; }" +
				".greeting { font-size: 18px; color: #1e1e1e; margin-bottom: 20px; line-height: 1.6; }" +
				".pw-section { background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }" +
				".pw-value { font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 4px; margin: 20px 0; font-family: 'Courier New', monospace; }" +
				".pw-label { color: #ffffff; font-size: 16px; margin-bottom: 10px; }" +
				".notice { background-color: #f8f8f8; padding: 20px; border-left: 4px solid #ffa500; margin: 30px 0; border-radius: 4px; }" +
				".notice p { margin: 5px 0; color: #666666; font-size: 14px; line-height: 1.6; }" +
				".footer { background-color: #1a1a1a; padding: 30px; text-align: center; }" +
				".footer p { color: #b0b0b0; margin: 5px 0; font-size: 12px; }" +
				"</style>" +
				"</head>" +
				"<body>" +
				"<div class='container'>" +
				"<div class='header'>" +
				"<h1>MOVIE</h1>" +
				"<p>PORTFOLIO</p>" +
				"</div>" +
				"<div class='content'>" +
				"<div class='greeting'>" +
				"안녕하세요.<br>" +
				"<strong>MOVIE PORTFOLIO</strong> 임시 비밀번호 안내입니다." +
				"</div>" +
				"<div class='pw-section'>" +
				"<div class='pw-label'>임시 비밀번호</div>" +
				"<div class='pw-value'>" + sb.toString() + "</div>" +
				"</div>" +
				"<div class='notice'>" +
				"<p><strong>안내사항</strong></p>" +
				"<p>• 임시 비밀번호로 로그인 후 반드시 비밀번호를 변경해주세요.</p>" +
				"<p>• 임시 비밀번호는 타인에게 공유하지 마세요.</p>" +
				"<p>• 본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>" +
				"</div>" +
				"</div>" +
				"<div class='footer'>" +
				"<p>© 2025 MOVIE PORTFOLIO. All rights reserved.</p>" +
				"<p>영화 추천 사이트</p>" +
				"</div>" +
				"</div>" +
				"</body>" +
				"</html>"
			,true);
			sender.send(message);
		
		} catch (MessagingException e) {
			e.printStackTrace();
			sb = null;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			sb = null;
		}
		
		if(sb == null){
			return null;
		}else{
			return sb.toString();
		}
	}

	public String sendPwAuth(String email) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		// 랜덤코드생성
		Random r = new Random();
		StringBuffer sb = new StringBuffer();
		for(int i=0;i<4;i++){
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
			helper.setFrom(new InternetAddress("mpy2221mpy2221@gmail.com","MOVIE PORTFOLIO"));
			helper.setTo(email);
			helper.setSubject("[MOVIE PORTFOLIO] 비밀번호 찾기 인증번호 안내");
			helper.setText(
				"<!DOCTYPE html>" +
				"<html>" +
				"<head>" +
				"<meta charset='UTF-8'>" +
				"<style>" +
				"body { font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }" +
				".container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }" +
				".header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 30px; text-align: center; }" +
				".header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; }" +
				".header p { color: #b0b0b0; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 4px; }" +
				".content { padding: 50px 40px; }" +
				".greeting { font-size: 18px; color: #1e1e1e; margin-bottom: 20px; line-height: 1.6; }" +
				".auth-section { background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }" +
				".auth-code { font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 8px; margin: 20px 0; font-family: 'Courier New', monospace; }" +
				".auth-label { color: #ffffff; font-size: 16px; margin-bottom: 10px; }" +
				".notice { background-color: #f8f8f8; padding: 20px; border-left: 4px solid #ffa500; margin: 30px 0; border-radius: 4px; }" +
				".notice p { margin: 5px 0; color: #666666; font-size: 14px; line-height: 1.6; }" +
				".footer { background-color: #1a1a1a; padding: 30px; text-align: center; }" +
				".footer p { color: #b0b0b0; margin: 5px 0; font-size: 12px; }" +
				"</style>" +
				"</head>" +
				"<body>" +
				"<div class='container'>" +
				"<div class='header'>" +
				"<h1>MOVIE</h1>" +
				"<p>PORTFOLIO</p>" +
				"</div>" +
				"<div class='content'>" +
				"<div class='greeting'>" +
				"안녕하세요.<br>" +
				"<strong>MOVIE PORTFOLIO</strong> 비밀번호 찾기 인증번호 안내입니다." +
				"</div>" +
				"<div class='auth-section'>" +
				"<div class='auth-label'>비밀번호 찾기 인증번호</div>" +
				"<div class='auth-code'>" + sb.toString() + "</div>" +
				"</div>" +
				"<div class='notice'>" +
				"<p><strong>안내사항</strong></p>" +
				"<p>• 인증번호는 3분간 유효합니다.</p>" +
				"<p>• 인증번호는 타인에게 공유하지 마세요.</p>" +
				"<p>• 본인이 요청하지 않은 경우 이 이메일을 무시하세요.</p>" +
				"</div>" +
				"</div>" +
				"<div class='footer'>" +
				"<p>© 2025 MOVIE PORTFOLIO. All rights reserved.</p>" +
				"<p>영화 추천 사이트</p>" +
				"</div>" +
				"</div>" +
				"</body>" +
				"</html>"
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
