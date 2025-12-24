package kr.or.movie.userPick.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
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
    private int userpickTmdbMovieId;
    
    @Schema(description = "유저픽 영화 상태 (1: 활성, 2: 비활성)")
    private int userpickStatus;
    
    @Schema(description = "등록일")
    private Date userpickDate;
    
    @Schema(description = "포스터 경로")
    private String userpickPosterPath;
    
    @Schema(description = "영화 제목")
    private String userpickTitle;
    
    @Schema(description = "개봉일")
    private Date userpickReleaseDate;
    
    @Schema(description = "러닝타임")
    private Integer userpickRuntime;
    
    @Schema(description = "조회수")
    private int userpickViewCount;
}
