package kr.or.movie.boardReview.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.movie.boardReview.model.dto.BoardReviewFile;

@Mapper
public interface BoardReviewFileDao {

	int insertBoardReviewFile(BoardReviewFile boardReviewFile);
	List<BoardReviewFile> selectBoardReviewFile(int boardReviewNo);
	BoardReviewFile selectBoardReviewFileByNo(int boardFileNo);
	List<BoardReviewFile> selectBoardReviewFileByNoList(int[] boardFileNo);
	int deleteBoardReviewFile(int[] boardFileNo);



}
