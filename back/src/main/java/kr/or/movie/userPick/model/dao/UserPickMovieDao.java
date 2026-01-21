package kr.or.movie.userPick.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.movie.simepleReview.model.dto.SimpleReview;
import kr.or.movie.boardReview.model.dto.BoardReview;
import kr.or.movie.userPick.model.dto.UserPickMovie;
import kr.or.movie.util.PageInfo;

@Mapper
public interface UserPickMovieDao {

    public int selectUserpickMovie(int tmdbMovieId);  
    public int insertUserpickMovie(SimpleReview simpleReview);
    public int insertUserpickMovieFromBoardReview(BoardReview boardReview);
    public int selectUserPickListCount();
    public List<UserPickMovie> selectUserPickList(PageInfo pageInfo);
    
    // 검색 관련 메서드
    public int selectUserPickSearchCountByTitle(@Param("keyword") String keyword);
    public List<UserPickMovie> selectUserPickSearchByTitle(@Param("keyword") String keyword, @Param("pageInfo") PageInfo pageInfo);
    public int selectUserPickSearchCountByGenre(@Param("genreId") int genreId);
    public List<UserPickMovie> selectUserPickSearchByGenre(@Param("genreId") int genreId, @Param("pageInfo") PageInfo pageInfo);

    public UserPickMovie selectUserPickMovie(int tmdbMovieId);

    // 상세 조회 관련 메서드
    public int updateUserPickViewCount(int tmdbMovieId);
    
    // 통계 관련 메서드
    public Map<String, Object> calculateTotalRatingDistribution(int tmdbMovieId);
    
    // 관리자 전체 유저픽 영화 통계 조회
    public int selectAllUserPickMovieCount();
    public int selectActiveUserPickMovieCount();
    public int selectInactiveUserPickMovieCount();
    public Double selectAverageViewCount();
    public int selectReviewedMovieCount();
    public Double selectAverageReviewCount();
    public int selectTotalReviewCount();
    public List<Map<String, Object>> selectGenreDistribution();
    public List<Map<String, Object>> selectTopViewedMovies();
    public List<Map<String, Object>> selectTopReviewedMovies();
    
    // 관리자 전체 유저픽 영화 목록 조회 (페이지네이션)
    public int selectAllUserPickMovieListCount();
    public List<UserPickMovie> selectAllUserPickMovieList(@Param("pageInfo") PageInfo pageInfo);
    
    // 관리자 전체 유저픽 영화 검색 (영화 제목)
    public int selectAllUserPickMovieSearchCountByTitle(@Param("keyword") String keyword);
    public List<UserPickMovie> selectAllUserPickMovieSearchByTitle(@Param("keyword") String keyword, @Param("pageInfo") PageInfo pageInfo);
    
    // 관리자 전체 유저픽 영화 검색 (장르)
    public int selectAllUserPickMovieSearchCountByGenre(@Param("genreId") int genreId);
    public List<UserPickMovie> selectAllUserPickMovieSearchByGenre(@Param("genreId") int genreId, @Param("pageInfo") PageInfo pageInfo);
    
    // 관리자 전체 유저픽 영화 검색 (상태)
    public int selectAllUserPickMovieSearchCountByStatus(@Param("status") int status);
    public List<UserPickMovie> selectAllUserPickMovieSearchByStatus(@Param("status") int status, @Param("pageInfo") PageInfo pageInfo);
    
    // 관리자 유저픽 영화 상태 변경
    public int updateUserPickMovieStatus(@Param("movieNo") int movieNo, @Param("status") int status);
    
    // 관리자 유저픽 영화 삭제
    public int deleteUserPickMovie(@Param("movieNo") int movieNo);
    
}

