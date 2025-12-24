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
@Alias("board_review")
@Schema(description = "게시글 리뷰")
public class BoardReview {
    @Schema(description = "게시글 리뷰 번호")
    private int boardReviewNo;
    
    @Schema(description = "회원 아이디")
    private String boardMemberId;
    
    @Schema(description = "TMDB 영화 아이디")
    private int boardTmdbMovieId;
    
    @Schema(description = "게시글 리뷰 제목")
    private String boardReviewTitle;
    
    @Schema(description = "게시글 리뷰 내용")
    private String boardReviewContent;
    
    @Schema(description = "게시글 리뷰 평점")
    private int boardReviewRating;
    
    @Schema(description = "게시글 리뷰 작성일")
    private Date boardReviewDate;
    
    @Schema(description = "게시글 리뷰 상태 (1: 노출, 2: 숨김)")
    private int boardReviewStatus;
    
    @Schema(description = "조회수")
    private int boardViewCount;
}
