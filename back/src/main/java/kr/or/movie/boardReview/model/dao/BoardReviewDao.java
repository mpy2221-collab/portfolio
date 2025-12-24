package kr.or.movie.boardReview.model.dao;

import org.apache.ibatis.annotations.Mapper;
import kr.or.movie.boardReview.model.dto.BoardReview;

@Mapper
public interface BoardReviewDao {
    public int selectReviewCount(int movieId, String memberId);
}
