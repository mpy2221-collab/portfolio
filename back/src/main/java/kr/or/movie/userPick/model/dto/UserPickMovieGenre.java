package kr.or.movie.userPick.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("userpick_genre")
@Schema(description = "유저픽 영화 장르")
public class UserPickMovieGenre {
    @Schema(description = "유저픽 영화 장르 번호")
    private int userpickGenreNo;
    
    @Schema(description = "유저픽 영화 번호")
    private int userpickGenreMovieNo;
    
    @Schema(description = "TMDB 장르 ID")
    private int userpickGenreId;
    
    @Schema(description = "장르 이름")
    private String userpickGenreName;
}
