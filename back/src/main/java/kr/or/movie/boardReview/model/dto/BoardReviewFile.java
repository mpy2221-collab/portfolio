package kr.or.movie.boardReview.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("board_file")
@Schema(description = "게시글 리뷰 파일")
public class BoardReviewFile {
    @Schema(description = "게시글 리뷰 파일 번호")
    private int boardFileNo;
    
    @Schema(description = "게시글 리뷰 번호")
    private int boardFileReviewNo;
    
    @Schema(description = "원본 파일명")
    private String boardFilename;
    
    @Schema(description = "저장 파일명")
    private String boardFilepath;
}
