package kr.or.movie.member.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.movie.member.model.dto.Member;

import org.springframework.beans.factory.annotation.Autowired;

import kr.or.movie.ResponseDTO;
import kr.or.movie.member.model.service.MemberService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/member")
@CrossOrigin("*")
@Tag(name = "회원 관리", description = "회원 관리 API")
public class MemberController {

    @Autowired
    private MemberService memberService;

    
    @GetMapping("/id/{memberId}")
    @Operation(summary = "아이디 중복 검사", description = "매개변수로 전달한 아이디 사용여부 조회")
    public ResponseEntity<ResponseDTO> idCheck(@PathVariable String memberId) {
        Member member = memberService.idCheck(memberId);

        if(member == null) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }
}
