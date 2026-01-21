package kr.or.movie.member.model.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import kr.or.movie.member.model.dto.Member;
import java.util.List;
import kr.or.movie.util.PageInfo;

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
    public int updateMemberInfo(Member member);
    public String selectMemberProfileImg(String memberId);

    // 관리자 회원 목록 조회
    public int getMemberListCount();
    public List<Member> getMemberList(PageInfo pageInfo);
    
    // 관리자 회원 검색
    public int getMemberSearchCount(@Param("searchType") String searchType, @Param("keyword") String keyword);
    public List<Member> getMemberSearchList(@Param("searchType") String searchType, @Param("keyword") String keyword, @Param("pageInfo") PageInfo pageInfo);
    
    // 관리자 회원 유형 변경
    public int updateMemberType(Member member);
    
    // 관리자 회원 삭제
    public int deleteMember(String memberId);
}
