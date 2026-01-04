package kr.or.movie.userPick.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.movie.userPick.model.dto.UserPickMovieGenre;

@Mapper
public interface UserPickMovieGenreDao {

    public int insertUserpickMovieGenre(UserPickMovieGenre userPickMovieGenre);
    public List<UserPickMovieGenre> selectUserPickMovieGenre(int userPickMovieNo);
}

