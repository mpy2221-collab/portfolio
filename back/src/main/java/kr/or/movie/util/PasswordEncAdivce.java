package kr.or.movie.util;



import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import kr.or.movie.member.model.dto.Member;

@Aspect
@Component
public class PasswordEncAdivce {
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Pointcut("execution(* kr.or.movie.member.model.service.MemberService.*Member(kr.or.movie.member.model.dto.Member))")
    public void pwEncPointcut() {}

    @Before(value = "pwEncPointcut()")
    public void pwEncAdvice(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        Member member = (Member) args[0];
        String encPw = passwordEncoder.encode(member.getMemberPw());
        member.setMemberPw(encPw);
    }
}
