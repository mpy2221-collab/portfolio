package kr.or.movie.boardReview.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.or.movie.comment.model.dto.CommentTbl;
import kr.or.movie.userPick.model.dto.UserPickMovieGenre;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("board_review")
@Schema(description = "게시글 리뷰")
public class BoardReview {
    @Schema(description = "게시글 리뷰 번호")
    private int boardReviewNo;
    
    @Schema(description = "회원 아이디")
    private String boardReviewMemberId;
    
    @Schema(description = "TMDB 영화 아이디")
    private int boardReviewTmdbMovieId;
    
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
    private int boardReviewViewCount;

    // userpick_movie의 PK (장르 INSERT 시 필요)
    @Schema(description = "userpick_movie의 PK")
    private int userpickMovieNo;
    
 // 영화 정보 (userpick_movie 저장용)
    @Schema(description = "영화 제목")
    private String movieTitle;

    @Schema(description = "포스터 경로")
    private String moviePosterPath;

    @Schema(description = "개봉일")
    private String movieReleaseDate;

    @Schema(description = "러닝타임")
    private Integer movieRuntime;

    // 객체에서 추가한 필드
    @Schema(description = "장르 목록")
    private List<UserPickMovieGenre> userpickMovieGenres;

    @Schema(description = "유저 평가 리뷰 개수")
    private int userpickMovieReviewCount;

    @Schema(description = "프로필 이미지")
    private String profilePath;

    @Schema(description = "좋아요 수")
    private int likeCount;

    @Schema(description = "좋아요 여부")
    private boolean isLiked;

    @Schema(description = "게시글 리뷰 작성자 닉네임")
    private String boardReviewMemberNickname;

    // 첨부파일 목록
    @Schema(description = "첨부파일 목록")
    private List<BoardReviewFile> boardReviewFiles;

    @Schema(description = "댓글 목록")
    private List<CommentTbl> boardComments;

    @Schema(description = "삭제할 파일 번호 목록")
    private int[] delFileNo;

    @Schema(description = "게시글 리뷰 작성자 프로필 이미지")
    private String memberProfileImg;

    @Schema(description = "게시글 리뷰 작성자 닉네임")
    private String memberNickname;
}
