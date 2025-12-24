package kr.or.movie.comment.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("comment_tbl")
@Schema(description = "댓글")
public class CommentTbl {
    @Schema(description = "댓글 번호")
    private int commentNo;
    
    @Schema(description = "댓글 유형 (userpick 또는 board)")
    private String commentType;
    
    @Schema(description = "유저픽 영화 번호")
    private Integer commentUserpickNo;
    
    @Schema(description = "게시글 리뷰 번호")
    private Integer commentBoardNo;
    
    @Schema(description = "회원 아이디")
    private String commentMemberId;
    
    @Schema(description = "댓글 내용")
    private String commentContent;
    
    @Schema(description = "댓글 작성일")
    private Date commentDate;
    
    @Schema(description = "부모 댓글 번호")
    private Integer commentParentNo;
}

