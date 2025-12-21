package kr.or.movie;

import java.io.ObjectInputFilter.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration
public class SecurityConfig {
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
		return http
				.httpBasic(HttpBasicConfigurer::disable)	//http 기본인증 사용하지 않음(security 실행시 나타나는 로그인)
				.csrf(CsrfConfigurer::disable)				//csrf 기본설정 사용안함
				.cors(Customizer.withDefaults())			//cors 기본설정 사용안함
				//더이상 세션인증을 사용하지 않겠다 -> 서버는 상태값을 갖지 않음(STATELESS)
				.sessionManagement(config -> config.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				//모든 요청에 대해서 승인(추후에 인터셉터에서 로그인 체크 처리)
				.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
				//보안설정 객체 생성
				.build();
		
		
		
		
		
		
		
		
		
		
	}
}
