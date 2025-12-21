package kr.or.movie.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	@Value("${jwt.secret}")
	private String secret;

	// 아이디/패스워드 정상적으로 입력해서 로그인을 성공하면
	// 로그인 성공했다는 토큰을 발행해서 전달(accesstoken)
	// access toekn에 포함되는 정보
	// 1. 회원을 식별할 수 있는 식별자(memberId)
	// 2. 로그인 성공 시간(인증 시작시간)
	// 3. 로그인 만료 시간(인증 만료시간)

	// access token을 생성하는 메소드(첫번째 매개변수는 토큰에다가 저장할 정도 -> 식별자, 두번째 매개변수 토큰만료시간 long타입)
	public String createToken(String memberId, long expiredDateMs) {
		Claims claims = Jwts.claims();
		// Claims claims = Jwts.claims();//생성하는 토큰을 통해서 얻을수있는 값을 저장하는 객체
		claims.put("memberId", memberId);// 회원 아이디값을 저장. 프라이머리 키만 넣어놓자.
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes()); // 우리가 지정한 문자열을 이용해서 암호화코드 생성

		return Jwts.builder() // Jwp토큰 생성시작
				.setClaims(claims) // 아이디 정보 세팅
				.setIssuedAt(new Date(System.currentTimeMillis())) // 인증시작시간
				.setExpiration(new Date(System.currentTimeMillis() + expiredDateMs)) // 인증만료시간
				.signWith(key, SignatureAlgorithm.HS256)// 암호화할때 사용할 키값 및 알고리즘
				.compact();// 위 내용들 종합해서 jwp 토큰 생성

	}

	// 매개변수로 토큰을 받아서 토큰시간이 만료되었는지 체크하는 메소드
	public boolean isExpired(String token) {
		// jwt 객체에 시크릿키 (인증번호 정상인지 체크하는용도),토큰(사용자가 보내온값),현재시간이랑 비교해서 만료되었는지
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
		
		// JWT 파싱 및 검증, 만료 시간 추출
	    return Jwts.parserBuilder()
	            .setSigningKey(key) // 시크릿키를 사용하여 서명 검증
	            .build()
	            .parseClaimsJws(token) // 토큰을 파싱하여 Claims 객체를 얻음
	            .getBody() // Claims 객체에서 페이로드(body) 부분을 얻음
	            .getExpiration() // 만료 시간 추출
	            .before(new Date()); // 만료 시간이 현재 시간보다 이전인지 확인 (만료 여부 반환)
	}

	// 매개변수로 토큰을 받앗더 회원 아이디값을 추출하는 메소드
	public String getMemberId(String token) {
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
		
		 // JWT 파싱 및 검증, 회원 아이디 추출
	    return Jwts.parserBuilder()
	            .setSigningKey(key) // 시크릿키를 사용하여 서명 검증
	            .build()
	            .parseClaimsJws(token) // 토큰을 파싱하여 Claims 객체를 얻음
	            .getBody() // Claims 객체에서 페이로드(body) 부분을 얻음
	            .get("memberId", String.class); // 회원 아이디 추출하여 반환

	}
}
