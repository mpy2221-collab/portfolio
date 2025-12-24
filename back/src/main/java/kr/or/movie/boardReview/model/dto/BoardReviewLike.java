package kr.or.movie.boardReview.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("board_like")
@Schema(description = "게시글 리뷰 추천")
public class BoardReviewLike {
    @Schema(description = "게시글 리뷰 좋아요 번호")
    private int boardLikeNo;
    
    @Schema(description = "게시글 리뷰 번호")
    private int boardLikeReviewNo;
    
    @Schema(description = "회원 아이디")
    private String boardLikeMemberId;
    
    @Schema(description = "좋아요 날짜")
    private Date boardLikeDate;
}
