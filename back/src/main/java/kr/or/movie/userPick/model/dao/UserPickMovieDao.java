package kr.or.movie.userPick.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.movie.simepleReview.model.dto.SimpleReview;

@Mapper
public interface UserPickMovieDao {

    public int selectUserpickMovie(int tmdbMovieId);  
    public int insertUserpickMovie(SimpleReview simpleReview);

}

