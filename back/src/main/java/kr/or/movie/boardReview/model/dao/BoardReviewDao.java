package kr.or.movie.boardReview.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import kr.or.movie.boardReview.model.dto.BoardReview;
import kr.or.movie.boardReview.model.dto.BoardReviewFile;
import kr.or.movie.util.PageInfo;

@Mapper
public interface BoardReviewDao {
    public int selectReviewCount(int movieId, String memberId);
    public Double selectBoardReviewAvg(int tmdbMovieId);
    public int selectBoardReviewCount(int tmdbMovieId);
    public int insertBoardReview(BoardReview boardReview);
    public int checkReview(int movieId, String memberId);
    public int selectBoardReviewListCount();
    public List<BoardReview> selectBoardReviewList(PageInfo pageInfo);
    
    // 검색 관련 메서드
    public int selectBoardReviewSearchCountByTitle(@Param("keyword") String keyword);
    public List<BoardReview> selectBoardReviewSearchByTitle(@Param("keyword") String keyword, @Param("pageInfo") PageInfo pageInfo);
    public int selectBoardReviewSearchCountByGenre(@Param("genreId") int genreId);
    public List<BoardReview> selectBoardReviewSearchByGenre(@Param("genreId") int genreId, @Param("pageInfo") PageInfo pageInfo);
    public int selectBoardReviewSearchCountByReviewTitle(@Param("keyword") String keyword);
    public List<BoardReview> selectBoardReviewSearchByReviewTitle(@Param("keyword") String keyword, @Param("pageInfo") PageInfo pageInfo);
 
    // 상세 조회 관련 메서드
    public BoardReview selectBoardReviewByNo(int boardReviewNo);
    public int updateBoardReviewViewCount(int boardReviewNo);
    public int deleteBoardReview(int boardReviewNo);


    // 수정 관련 메서드
    public int updateBoardReview(BoardReview boardReview);

    // 통계 관련 메서드
    public int selectBoardReviewCountByTmdbMovieId(int tmdbMovieId);
    public Double selectBoardReviewAverageRatingByTmdbMovieId(int tmdbMovieId);
    public List<Map<String, Object>> selectBoardReviewRatingDistributionByTmdbMovieId(int tmdbMovieId);

    // 영화에 대한 게시글 리뷰 리스트 조회
    public List<BoardReview> selectBoardReviewListByMovieId(int movieId);
}
