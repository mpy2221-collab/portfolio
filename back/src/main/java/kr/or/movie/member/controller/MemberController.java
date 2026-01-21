package kr.or.movie.member.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.movie.member.model.dto.Member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import kr.or.movie.ResponseDTO;
import kr.or.movie.member.model.service.MemberService;
import kr.or.movie.util.FileUtils;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import io.swagger.v3.oas.annotations.Operation;
import kr.or.movie.EmailSender;

import java.util.Map;


@RestController
@RequestMapping("/member")
@CrossOrigin("*")
@Tag(name = "회원 관리", description = "회원 관리 API")
public class MemberController {

    @Autowired
    private MemberService memberService;
    @Value("${file.root}")
    private String root;
    @Autowired
    private FileUtils fileUtils;
    @Autowired
    private EmailSender emailSender;

    
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

    @GetMapping("/nickname/{memberNickname}")
    @Operation(summary = "닉네임 중복 검사", description = "매개변수로 전달한 닉네임 사용여부 조회")
    public ResponseEntity<ResponseDTO> nicknameCheck(@PathVariable String memberNickname) {
        Member member = memberService.nicknameCheck(memberNickname);

        if(member == null) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/email/{memberEmail}")
    @Operation(summary = "이메일 중복 검사", description = "매개변수로 전달한 이메일 사용여부 조회")
    public ResponseEntity<ResponseDTO> emailCheck(@PathVariable String memberEmail) {
        Member member = memberService.emailCheck(memberEmail);
        if(member == null) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @PostMapping("/join")
    @Operation(summary = "회원가입", description = "회원가입 정보 전달")
    public ResponseEntity<ResponseDTO> join(@ModelAttribute Member member, @ModelAttribute MultipartFile memberImg) {
        String savepath = root + "/member/profile_img/";

        System.out.println(memberImg);

        if(memberImg != null) {
            String filepath = fileUtils.upload(savepath, memberImg);
            member.setMemberProfileImg(filepath);
        }

        int result = memberService.insertMember(member);

        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

    }

    @PostMapping("/email/auth")
    @Operation(summary = "이메일 인증번호 발송", description = "이메일로 인증번호 발송")
    public ResponseEntity<ResponseDTO> emailAuth(@RequestBody Member member) {
    	System.out.println(member.getMemberEmail());
    
        String authCode = emailSender.sendEmailAuth(member.getMemberEmail());
        
        if(authCode != null) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", authCode);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else {
        	ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "로그인 정보 전달")
    public ResponseEntity<ResponseDTO> login(@RequestBody Member member) {
        String result = memberService.login(member);

        if("SUSPENDED".equals(result)) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "suspended", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else if(result != null) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", result);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @PostMapping("/find-id")
    @Operation(summary = "아이디 찾기", description = "이메일로 아이디 찾기")
    public ResponseEntity<ResponseDTO> findId(@RequestBody Member member) {
        String memberId = memberService.findId(member.getMemberEmail());

        boolean result =  emailSender.sendFindId(member.getMemberEmail(), memberId);

        if(result) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @PostMapping("/pw/auth")
    @Operation(summary = "비밀번호 인증번호 발송", description = "이메일로 비밀번호 인증번호 발송")
    public ResponseEntity<ResponseDTO> pwAuth(@RequestBody Member member) {
    	System.out.println(member);
        // 1. 해당 아이디와 이메일로 회원 조회
        Member m = memberService.selectMemberByEmailAndId(member.getMemberEmail(), member.getMemberId());
        
        System.out.println(m);
        
        if(m != null) {
            String authCode = emailSender.sendPwAuth(m.getMemberEmail());
            if(authCode != null) {
                ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", authCode);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            else{
                ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @PostMapping("/find-pw")
    @Operation(summary = "비밀번호 찾기", description = "아이디와 이메일로 비밀번호 찾기")
    public ResponseEntity<ResponseDTO> findPw(@RequestBody Member member) {
        // 1. 임시 비밀번호 발송
        String memberPw = emailSender.sendFindPw(member.getMemberEmail(), member.getMemberId());
        member.setMemberPw(memberPw);

        // 2. 임시 비밀번호 업데이트. 아이디를 조건절로 사용
        int result = memberService.updatePwMember(member);

        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getMember(@RequestAttribute String memberId) {
        Member member = memberService.selectMemberById(memberId);

        if(member != null) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", member);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @PatchMapping("/info")
    @Operation(summary = "회원 정보 수정", description = "회원 정보 수정")
    public ResponseEntity<ResponseDTO> updateMember(@ModelAttribute Member member,@ModelAttribute MultipartFile memberImg, @RequestAttribute String memberId) {
        String savepath = root + "/member/profile_img/";
        member.setMemberId(memberId);

        // 1. 프로필 이미지가 변경된 경우 처리
        if(member.isMemberImgChangeCheck()) {
            if(memberImg != null) {
                String filepath = fileUtils.upload(savepath, memberImg);
                member.setMemberProfileImg(filepath);
            }else{
                member.setMemberProfileImg(null);
            }
        }else {
        // 프로필 이미지를 변경하지 않은 경우, 기존 프로필 이미지 유지
        Member existingMember = memberService.selectMemberById(memberId);
        if(existingMember != null) {
            member.setMemberProfileImg(existingMember.getMemberProfileImg());
        }
    }
        
        // 2. 회원 정보 수정
        int result = memberService.updateMemberInfo(member);

        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @PostMapping("/pw/check")
    @Operation(summary = "비밀번호 인증", description = "비밀번호 인증")
    public ResponseEntity<ResponseDTO> pwCheck(@RequestBody Member member,@RequestAttribute String memberId) {
        member.setMemberId(memberId);
        Member m = memberService.selectMemberByIdAndPw(member);

        if(m != null) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @PatchMapping("/pw")
    @Operation(summary = "비밀번호 변경", description = "비밀번호 변경")
    public ResponseEntity<ResponseDTO> changePw(@RequestBody Member member,@RequestAttribute String memberId) {
        member.setMemberId(memberId);
        // aop로 인해 자동 암호화 
        // 비밀번호 찾기때 만든 기능 재사용
        int result = memberService.updatePwMember(member);

        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/id")
    public ResponseEntity<ResponseDTO> getMemberId(@RequestAttribute String memberId) {
        Member member = memberService.selectMemberById(memberId);

        if(member != null) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", member.getMemberId());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/simple-review/statistics")
    @Operation(summary = "심플 리뷰 통계 조회", description = "현재 로그인한 회원의 심플 리뷰 통계 조회")
    public ResponseEntity<ResponseDTO> getSimpleReviewStatistics(
        @RequestAttribute String memberId
    ) {
        Map<String, Object> statistics = memberService.selectSimpleReviewStatistics(memberId);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", statistics);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/simple-review/list/{reqPage}")
    @Operation(summary = "심플 리뷰 목록 조회", description = "현재 로그인한 회원의 심플 리뷰 목록 조회")
    public ResponseEntity<ResponseDTO> getSimpleReviewList(
        @PathVariable int reqPage,
        @RequestAttribute String memberId
    ) {
        Map<String, Object> map = memberService.selectSimpleReviewList(memberId, reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/simple-review/search")
    @Operation(summary = "심플 리뷰 검색", description = "현재 로그인한 회원의 심플 리뷰 검색")
    public ResponseEntity<ResponseDTO> searchSimpleReviewList(
        @RequestParam String searchType,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String genreId,
        @RequestParam int reqPage,
        @RequestAttribute String memberId
    ) {
        Map<String, Object> map = memberService.searchSimpleReviewList(memberId, searchType, keyword, genreId, reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/board-review/statistics")
    @Operation(summary = "게시글 리뷰 통계 조회", description = "현재 로그인한 회원의 게시글 리뷰 통계 조회")
    public ResponseEntity<ResponseDTO> getBoardReviewStatistics(
        @RequestAttribute String memberId
    ) {
        Map<String, Object> statistics = memberService.selectBoardReviewStatistics(memberId);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", statistics);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/board-review/list/{reqPage}")
    @Operation(summary = "게시글 리뷰 목록 조회", description = "현재 로그인한 회원의 게시글 리뷰 목록 조회")
    public ResponseEntity<ResponseDTO> getBoardReviewList(
        @PathVariable int reqPage,
        @RequestAttribute String memberId
    ) {
        Map<String, Object> map = memberService.selectBoardReviewList(memberId, reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/board-review/search")
    @Operation(summary = "게시글 리뷰 검색", description = "현재 로그인한 회원의 게시글 리뷰 검색")
    public ResponseEntity<ResponseDTO> searchBoardReviewList(
        @RequestParam String searchType,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String genreId,
        @RequestParam int reqPage,
        @RequestAttribute String memberId
    ) {
        Map<String, Object> map = memberService.searchBoardReviewList(memberId, searchType, keyword, genreId, reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
}

