package kr.or.movie.member.model.dao;

import org.apache.ibatis.annotations.Mapper;
import kr.or.movie.member.model.dto.Member;
@Mapper
public interface MemberDao {

    public Member idCheck(String memberId);
    public Member nicknameCheck(String memberNickname);
    public Member emailCheck(String memberEmail);
    public int insertMember(Member member);
}
