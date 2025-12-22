package kr.or.movie.member.model.dao;

import org.apache.ibatis.annotations.Mapper;
import kr.or.movie.member.model.dto.Member;
@Mapper
public interface MemberDao {

    public Member idCheck(String memberId);
    public Member nicknameCheck(String memberNickname);
    public Member emailCheck(String memberEmail);
    public int insertMember(Member member);
    public String findId(String memberEmail);
    public int updatePwMember(Member member);
    public Member selectMemberByEmailAndId(String memberEmail, String memberId);
    public Member selectMemberById(String memberId);
}
