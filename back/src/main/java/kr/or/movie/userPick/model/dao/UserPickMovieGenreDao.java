package kr.or.movie.userPick.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.movie.userPick.model.dto.UserPickMovieGenre;

@Mapper
public interface UserPickMovieGenreDao {

    public int insertUserpickMovieGenre(UserPickMovieGenre userPickMovieGenre);

}

