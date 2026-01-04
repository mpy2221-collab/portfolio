package kr.or.movie.boardReview.model.dto;

import java.util.Date;

import io.swagger.v3.oas.annotations.media.Schema;
// BOARD_LIKE_NO
// BOARD_LIKE_REVIEW_NO
// BOARD_LIKE_MEMBER_ID
// BOARD_LIKE_DATE
public class BoardLike {

    @Schema(description = "게시글 좋아요 번호")
    private int boardLikeNo;
    @Schema(description = "게시글 리뷰 번호")
    private int boardLikeReviewNo;
    @Schema(description = "회원 아이디")
    private String boardLikeMemberId;
    @Schema(description = "좋아요 일시")
    private Date boardLikeDate;

 

}
