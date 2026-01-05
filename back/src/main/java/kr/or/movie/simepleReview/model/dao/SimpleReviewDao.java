package kr.or.movie.simepleReview.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import kr.or.movie.simepleReview.model.dto.SimpleReview;

@Mapper
public interface SimpleReviewDao {

    public int selectReviewCount(int movieId, String memberId);
    public int insertSimpleReview(SimpleReview simpleReview);
    public Double selectSimpleReviewAvg(int tmdbMovieId);
    public int selectSimpleReviewCount(int tmdbMovieId);
    public int checkReview(int movieId, String memberId);

    // 심플 리뷰 통계
    public int selectSimpleReviewCountByTmdbMovieId(int tmdbMovieId);
    public Double selectSimpleReviewAverageRatingByTmdbMovieId(int tmdbMovieId);
// 데이터 구조 예시
//     [
//   { rating: 1, count: 0 },  // 1점을 준 리뷰 0개
//   { rating: 2, count: 1 },  // 2점을 준 리뷰 1개
//   { rating: 3, count: 2 },  // 3점을 준 리뷰 2개
//   { rating: 4, count: 5 },  // 4점을 준 리뷰 5개
//   { rating: 5, count: 3 },  // 5점을 준 리뷰 3개
//   { rating: 6, count: 8 },  // 6점을 준 리뷰 8개
//   { rating: 7, count: 12 }, // 7점을 준 리뷰 12개
//   { rating: 8, count: 15 }, // 8점을 준 리뷰 15개
//   { rating: 9, count: 10 }, // 9점을 준 리뷰 10개
//   { rating: 10, count: 4 }  // 10점을 준 리뷰 4개
// ]
    public List<Map<String, Object>> selectSimpleReviewRatingDistributionByTmdbMovieId(int tmdbMovieId);

    // 심플 리뷰 목록 조회
    public List<SimpleReview> selectSimpleReviewList(int movieId);

    // 심플 리뷰 수정
    public int updateSimpleReview(SimpleReview simpleReview);

    // 심플 리뷰 삭제
    public int deleteSimpleReview(int simpleReviewNo);


}

