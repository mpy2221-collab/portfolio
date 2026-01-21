package kr.or.movie.userPick.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("userpick_movie")
@Schema(description = "유저픽 영화")
public class UserPickMovie {
    @Schema(description = "유저픽 영화 번호")
    private int userpickMovieNo;
    
    @Schema(description = "TMDB 영화 아이디")
    private int userpickMovieTmdbMovieId;
    
    @Schema(description = "유저픽 영화 상태 (1: 활성, 2: 비활성)")
    private int userpickMovieStatus;
    
    @Schema(description = "등록일")
    private Date userpickMovieDate;
    
    @Schema(description = "포스터 경로")
    private String userpickMoviePosterPath;
    
    @Schema(description = "영화 제목")
    private String userpickMovieTitle;
    
    @Schema(description = "개봉일")
    private Date userpickMovieReleaseDate;
    
    @Schema(description = "러닝타임")
    private Integer userpickMovieRuntime;
    
    @Schema(description = "조회수")
    private int userpickMovieViewCount;

    // 객체에서 추가한 필드
    @Schema(description = "장르 목록")
    private List<UserPickMovieGenre> userpickMovieGenres;

    @Schema(description = "유저 평가 평점")
    private Double userpickMovieRating;

    @Schema(description = "유저 평가 리뷰 개수")
    private int userpickMovieReviewCount;

    @Schema(description = "리뷰 수 (simple_review + board_review)")
    private int reviewCount;
}
