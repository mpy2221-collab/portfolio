package kr.or.movie.member.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.member.model.dao.MemberDao;
import kr.or.movie.member.model.dto.Member;
import kr.or.movie.util.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
@Service
public class MemberService {
    @Autowired
    private MemberDao memberDao;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public Member idCheck(String memberId) {
        return memberDao.idCheck(memberId);
    }

    public Member nicknameCheck(String memberNickname) {
        return memberDao.nicknameCheck(memberNickname);
    }

    public Member emailCheck(String memberEmail) {
        return memberDao.emailCheck(memberEmail);
    }

    @Transactional
    public int insertMember(Member member) {
        return memberDao.insertMember(member);
    }

    public String login(Member member) {
        Member m = memberDao.idCheck(member.getMemberId());

        // 1. 아이디 존재 여부 확인
        // 2. 비밀번호 일치 여부 확인(평문 패스워드, 암호화된 패스워드 비교)
        if(m != null && passwordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
            
            long expiredDateMs = 60*60*1000l; // 1시간
            String accessToken = jwtUtil.createToken(m.getMemberId(), expiredDateMs);
            return accessToken;
        }
        else{
            return null;
        }
    }

    public String findId(String memberEmail) {
        return memberDao.findId(memberEmail);
    }

    @Transactional
    public int updatePwMember(Member member) {
        return memberDao.updatePwMember(member);
    }

    public Member selectMemberByEmailAndId(String memberEmail, String memberId) {
        return memberDao.selectMemberByEmailAndId(memberEmail, memberId);
    }

    public Member selectMemberById(String memberId) {
        return memberDao.selectMemberById(memberId);
    }

    @Transactional
    public int updateMemberInfo(Member member) {
        return memberDao.updateMemberInfo(member);
    }
}
