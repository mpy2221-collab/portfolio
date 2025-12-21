package kr.or.movie.member.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("member")
@Schema(description = "회원 정보")
public class Member {
    @Schema(description = "회원 아이디")
    private String memberId;
    @Schema(description = "회원 비밀번호")
    private String memberPw;
    @Schema(description = "회원 닉네임")
    private String memberNickname;
    @Schema(description = "회원 전화번호")
    private String memberPhone;
    @Schema(description = "회원 이메일")
    private String memberEmail;
    @Schema(description = "회원 유형")
    private int memberType;
    @Schema(description = "가입일")
    private Date memberEnrollDate;
    @Schema(description = "회원 프로필 이미지")
    private String memberProfileImg;
}
