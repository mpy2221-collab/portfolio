package kr.or.movie.boardReview.model.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardLikeDao {
    public int selectBoardReviewLikeCount(int boardReviewNo);
    public int checkBoardReviewLike(int boardReviewNo, String memberId);
    public int insertBoardReviewLike(int boardReviewNo, String memberId);
    public int deleteBoardReviewLike(int boardReviewNo, String memberId);
}
