package kr.or.movie.member.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("member")
public class Member {
    private String memberId;
    private String memberPw;
    private String memberNickname;
    private String memberPhone;
    private String memberEmail;
    private int memberType;
    private Date memberEnrollDate;
    private String memberProfileImg;
}
