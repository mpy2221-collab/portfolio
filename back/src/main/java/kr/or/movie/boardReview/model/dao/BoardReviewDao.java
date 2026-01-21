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
    
    // 회원별 게시글 리뷰 목록 조회 (페이지네이션)
    public int selectBoardReviewListCountByMemberId(@Param("memberId") String memberId);
    public List<BoardReview> selectBoardReviewListByMemberId(@Param("memberId") String memberId, @Param("pageInfo") PageInfo pageInfo);
    
    // 회원별 게시글 리뷰 검색 (제목)
    public int selectBoardReviewSearchCountByTitle(@Param("memberId") String memberId, @Param("keyword") String keyword);
    public List<BoardReview> selectBoardReviewSearchByTitle(@Param("memberId") String memberId, @Param("keyword") String keyword, @Param("pageInfo") PageInfo pageInfo);
    
    // 회원별 게시글 리뷰 검색 (장르)
    public int selectBoardReviewSearchCountByGenre(@Param("memberId") String memberId, @Param("genreId") int genreId);
    public List<BoardReview> selectBoardReviewSearchByGenre(@Param("memberId") String memberId, @Param("genreId") int genreId, @Param("pageInfo") PageInfo pageInfo);
    
    // 회원별 게시글 리뷰 통계
    public int selectBoardReviewCountByMemberId(@Param("memberId") String memberId);
    public Double selectBoardReviewAverageRatingByMemberId(@Param("memberId") String memberId);
    public List<Map<String, Object>> selectBoardReviewGenreDistributionByMemberId(@Param("memberId") String memberId);
    public List<Map<String, Object>> selectBoardReviewRatingDistributionByMemberId(@Param("memberId") String memberId);
    
    // 관리자 전체 게시글 리뷰 통계 조회
    public int selectAllBoardReviewCount();
    public Double selectAllBoardReviewAverageRating();
    public List<Map<String, Object>> selectAllBoardReviewGenreDistribution();
    public List<Map<String, Object>> selectAllBoardReviewRatingDistribution();
    
    // 관리자 전체 게시글 리뷰 목록 조회 (페이지네이션)
    public int selectAllBoardReviewListCount();
    public List<BoardReview> selectAllBoardReviewList(@Param("pageInfo") PageInfo pageInfo);
    
    // 관리자 전체 게시글 리뷰 검색 (영화 제목)
    public int selectAllBoardReviewSearchCountByTitle(@Param("keyword") String keyword);
    public List<BoardReview> selectAllBoardReviewSearchByTitle(@Param("keyword") String keyword, @Param("pageInfo") PageInfo pageInfo);
    
    // 관리자 전체 게시글 리뷰 검색 (장르)
    public int selectAllBoardReviewSearchCountByGenre(@Param("genreId") int genreId);
    public List<BoardReview> selectAllBoardReviewSearchByGenre(@Param("genreId") int genreId, @Param("pageInfo") PageInfo pageInfo);
    
    // 관리자 전체 게시글 리뷰 검색 (유저 아이디/닉네임)
    public int selectAllBoardReviewSearchCountByUser(@Param("keyword") String keyword);
    public List<BoardReview> selectAllBoardReviewSearchByUser(@Param("keyword") String keyword, @Param("pageInfo") PageInfo pageInfo);
    
    // 최근 게시글 리뷰 조회 (메인 페이지용)
    public List<BoardReview> selectRecentBoardReviews(@Param("limit") int limit);
}
