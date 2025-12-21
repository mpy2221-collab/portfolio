package kr.or.movie.member.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.member.model.dao.MemberDao;
import kr.or.movie.member.model.dto.Member;

@Service
public class MemberService {
    @Autowired
    private MemberDao memberDao;

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
}
