package kr.or.movie.userPick.model.dao;

import java.util.List;

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
}

