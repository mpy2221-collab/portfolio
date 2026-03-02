package kr.or.movie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import kr.or.movie.util.LoginInterceptor;


@Configuration
public class WebConfig implements WebMvcConfigurer{
	@Autowired
	private LoginInterceptor loginInterceptor;
	@Value("${file.root}")
	private String root;
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(loginInterceptor)
			.addPathPatterns("/member/**", "/simple/review/**","/api/**","/board/review/**","/comment/**","/board/user-pick/**")
			// 로그인 관련 요청
			.excludePathPatterns("/member/login",
			// 회원가입 관련 요청
			"/member/join","/member/email/auth", "/member/id/*","/member/nickname/*","/member/email/*",
			// 계정 찾기 관련 요청
			"/member/find-id","/member/find-pw","/member/pw/auth")
			// 프로필 이미지 관련 요청
			.excludePathPatterns("/member/profile/**")
			// API 관련 요청
			.excludePathPatterns("/api/popular/*", "/api/popular/search", "/api/popular/view/*")
			// 게시글 리뷰 관련 요청
			.excludePathPatterns("/board/review/editor", "/board/review/list/*","/board/review/search","/board/review/view/*","/board/review/file/*")
			// 댓글 관련 요청
			.excludePathPatterns("/comment/list/**")
			// 유저픽 영화 관련 요청
			.excludePathPatterns("/board/user-pick/view/*","/board/user-pick/list/*","/board/user-pick/search","/simple/review/list/*")
			// 메인 페이지 관련 요청
			.excludePathPatterns("/main/**")
			;
	}
//	
//	
//
	
//	@Override
//	public void addResourceHandlers(ResourceHandlerRegistry registry) {
//		registry.addResourceHandler("/member/profile/**")
//		.addResourceLocations("file:///" + root + "/member/profile_img/");
//
//		registry.addResourceHandler("/board/editor/**")
//		.addResourceLocations("file:///" + root + "/board/editor/");
//	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/member/profile/**")
		.addResourceLocations("file:///" + root + "/member/profile_img/");

		registry.addResourceHandler("/board/editor/**")
		.addResourceLocations("file:///" + root + "/board/editor/");
	}

	



	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");	
	}



	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}
	

	@Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
