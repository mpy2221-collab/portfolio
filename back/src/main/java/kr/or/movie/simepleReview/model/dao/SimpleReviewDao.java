package kr.or.movie.simepleReview.model.dao;

import org.apache.ibatis.annotations.Mapper;
import kr.or.movie.simepleReview.model.dto.SimpleReview;

@Mapper
public interface SimpleReviewDao {

    public int selectReviewCount(int movieId, String memberId);
    
    public int insertSimpleReview(SimpleReview simpleReview);
}

