package kr.or.movie.simepleReview.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("simple_review")
@Schema(description = "심플 리뷰")
public class SimpleReview {
    @Schema(description = "심플 리뷰 번호")
    private int simpleReviewNo;
    
    @Schema(description = "회원 아이디")
    private String simpleReviewMemberId;
    
    @Schema(description = "TMDB 영화 아이디")
    private int simpleReviewTmdbMovieId;
    
    @Schema(description = "심플 리뷰 점수")
    private int simpleReviewRating;
    
    @Schema(description = "심플 리뷰 내용")
    private String simpleReviewContent;
    
    @Schema(description = "심플 리뷰 날짜")
    private Date simpleReviewDate;

    @Schema(description = "심플 리뷰 장르들")
    private List<Map<String, Object>> simpleReviewGenres;

    // userpick_movie의 PK (장르 INSERT 시 필요)
    @Schema(description = "userpick_movie의 PK")
    private int userpickMovieNo;

    // 영화 정보 (userpick_movie 저장용)
    @Schema(description = "영화 제목")
    private String movieTitle;

    @Schema(description = "포스터 경로")
    private String moviePosterPath;

    @Schema(description = "개봉일")
    private Date movieReleaseDate;

    @Schema(description = "러닝타임")
    private Integer movieRuntime;
}
