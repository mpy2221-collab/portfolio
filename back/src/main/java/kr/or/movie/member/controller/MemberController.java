package kr.or.movie.member.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.member.model.service.MemberService;

@RestController
@RequestMapping("/member")
@CrossOrigin("*")
@Tag(name = "회원 관리", description = "회원 관리 API")
public class MemberController {

    @Autowired
    private MemberService memberService;

    
}
