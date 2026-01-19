package kr.or.movie.userPick.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.userPick.model.dao.UserPickMovieDao;
import kr.or.movie.userPick.model.dao.UserPickMovieGenreDao;
import kr.or.movie.userPick.model.dto.UserPickMovie;
import kr.or.movie.userPick.model.dto.UserPickMovieGenre;
import kr.or.movie.util.PageInfo;
import kr.or.movie.util.Pagination;
import kr.or.movie.simepleReview.model.dao.SimpleReviewDao;
import kr.or.movie.boardReview.model.dao.BoardReviewDao;

@Service
public class UserPickService {
    @Autowired
    private UserPickMovieDao userPickMovieDao;
    @Autowired
    private UserPickMovieGenreDao userPickMovieGenreDao;
    @Autowired
    private Pagination pagination;
    @Autowired
    private SimpleReviewDao simpleReviewDao;
    @Autowired
    private BoardReviewDao boardReviewDao;


    public Map selectUserPickList(int reqPage) {
        Map<String, Object> map = new HashMap<>();

        //1. userpick_movie 테이블에서 영화 목록 조회
        int numPerPage = 12;
        int pageNaviSize = 5;
        int totalCount = userPickMovieDao.selectUserPickListCount();
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        List<UserPickMovie> list = userPickMovieDao.selectUserPickList(pageInfo);
        
        //2. list의 각 영화에 장르 추가
        for(UserPickMovie userPickMovie : list) {
            List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(userPickMovie.getUserpickMovieNo());
            userPickMovie.setUserpickMovieGenres(genres);
        }

        // 3. 유저평가 계산
        for(UserPickMovie userPickMovie : list) {
            int tmdbMovieId = userPickMovie.getUserpickMovieTmdbMovieId();
            
            // 심플리뷰 평균 평점
            Double simpleAvg = simpleReviewDao.selectSimpleReviewAvg(tmdbMovieId);
            // 게시글 리뷰 평균 평점
            Double boardReviewAvg = boardReviewDao.selectBoardReviewAvg(tmdbMovieId);

            // 리뷰 개수
            int simpleReviewCount = simpleReviewDao.selectSimpleReviewCount(tmdbMovieId);
            int boardReviewCount = boardReviewDao.selectBoardReviewCount(tmdbMovieId);
            int reviewTotalCount = simpleReviewCount + boardReviewCount;

            // 평균 계산
            Double userRating = null;
            if(simpleAvg != null && boardReviewAvg != null) {
                userRating = (simpleAvg + boardReviewAvg) / 2.0;
            }else if(simpleAvg != null) {
                userRating = simpleAvg;
            }else if(boardReviewAvg != null) {
                userRating = boardReviewAvg;
            }

            userPickMovie.setUserpickMovieRating(userRating);
            userPickMovie.setUserpickMovieReviewCount(reviewTotalCount); 
        }

       //3. map에 데이터 담기
        map.put("userPickList", list);
        map.put("pi", pageInfo);
        return map;
    }

    public Map searchUserPickList(String searchType, String keyword, String genreId, int reqPage) {
        Map<String, Object> map = new HashMap<>();

        //1. 검색 타입에 따라 영화 목록 조회
        int numPerPage = 12;
        int pageNaviSize = 5;
        int totalCount = 0;
        List<UserPickMovie> list = new ArrayList<>();

        if ("title".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
            // 제목 검색
            totalCount = userPickMovieDao.selectUserPickSearchCountByTitle(keyword);
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = userPickMovieDao.selectUserPickSearchByTitle(keyword, pageInfo);
        } else if ("genre".equals(searchType) && genreId != null && !genreId.trim().isEmpty()) {
            // 장르 검색
            totalCount = userPickMovieDao.selectUserPickSearchCountByGenre(Integer.parseInt(genreId));
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = userPickMovieDao.selectUserPickSearchByGenre(Integer.parseInt(genreId), pageInfo);
        } else {
            // 검색 조건이 없으면 빈 리스트 반환
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, 0);
            map.put("userPickList", new ArrayList<>());
            map.put("pi", pageInfo);
            return map;
        }

        //2. list의 각 영화에 장르 추가
        for(UserPickMovie userPickMovie : list) {
            List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(userPickMovie.getUserpickMovieNo());
            userPickMovie.setUserpickMovieGenres(genres);
        }

        // 3. 유저평가 계산
        for(UserPickMovie userPickMovie : list) {
            int tmdbMovieId = userPickMovie.getUserpickMovieTmdbMovieId();
            
            // 심플리뷰 평균 평점
            Double simpleAvg = simpleReviewDao.selectSimpleReviewAvg(tmdbMovieId);
            // 게시글 리뷰 평균 평점
            Double boardReviewAvg = boardReviewDao.selectBoardReviewAvg(tmdbMovieId);

            // 리뷰 개수
            int simpleReviewCount = simpleReviewDao.selectSimpleReviewCount(tmdbMovieId);
            int boardReviewCount = boardReviewDao.selectBoardReviewCount(tmdbMovieId);
            int reviewTotalCount = simpleReviewCount + boardReviewCount;

            // 평균 계산
            Double userRating = null;
            if(simpleAvg != null && boardReviewAvg != null) {
                userRating = (simpleAvg + boardReviewAvg) / 2.0;
            }else if(simpleAvg != null) {
                userRating = simpleAvg;
            }else if(boardReviewAvg != null) {
                userRating = boardReviewAvg;
            }

            userPickMovie.setUserpickMovieRating(userRating);
            userPickMovie.setUserpickMovieReviewCount(reviewTotalCount); 
        }

        //4. map에 데이터 담기
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        map.put("userPickList", list);
        map.put("pi", pageInfo);
        return map;
    }

    @Transactional
    public Map<String, Object> selectUserPickView(int tmdbMovieId) {
    // 조회수 1 증가
    userPickMovieDao.updateUserPickViewCount(tmdbMovieId);

    // 통계 정보
    Map<String, Object> statistics = new HashMap<>();
    
    // 심플 리뷰 통계
    Map<String, Object> simpleReviewStats = new HashMap<>();
    int simpleCount = simpleReviewDao.selectSimpleReviewCountByTmdbMovieId(tmdbMovieId);
    Double simpleAvg = simpleReviewDao.selectSimpleReviewAverageRatingByTmdbMovieId(tmdbMovieId);
    simpleReviewStats.put("count", simpleCount);
    simpleReviewStats.put("averageRating", simpleAvg != null ? simpleAvg : 0.0);
    simpleReviewStats.put("ratingDistribution", simpleReviewDao.selectSimpleReviewRatingDistributionByTmdbMovieId(tmdbMovieId));
    statistics.put("simpleReview", simpleReviewStats);
    
    // 게시판 리뷰 통계
    Map<String, Object> boardReviewStats = new HashMap<>();
    int boardCount = boardReviewDao.selectBoardReviewCountByTmdbMovieId(tmdbMovieId);
    Double boardAvg = boardReviewDao.selectBoardReviewAverageRatingByTmdbMovieId(tmdbMovieId);
    boardReviewStats.put("count", boardCount);
    boardReviewStats.put("averageRating", boardAvg != null ? boardAvg : 0.0);
    boardReviewStats.put("ratingDistribution", boardReviewDao.selectBoardReviewRatingDistributionByTmdbMovieId(tmdbMovieId));
    statistics.put("boardReview", boardReviewStats);
    
    // 통합 통계
    Map<String, Object> totalStats = new HashMap<>();
    int totalCount = simpleCount + boardCount;
    
    // 전체 평균 평점 계산 (가중 평균)
    double totalAverage = 0.0;
    if (totalCount > 0) {
        double simpleTotal = (simpleAvg != null ? simpleAvg : 0.0) * simpleCount;
        double boardTotal = (boardAvg != null ? boardAvg : 0.0) * boardCount;
        totalAverage = (simpleTotal + boardTotal) / totalCount;
    }
    
    totalStats.put("count", totalCount);
    totalStats.put("averageRating", totalAverage);
    totalStats.put("ratingDistribution", calculateTotalRatingDistribution(tmdbMovieId));
    statistics.put("total", totalStats);

    // 조회수 조회
    UserPickMovie userPickMovie = userPickMovieDao.selectUserPickMovie(tmdbMovieId);
    int viewCount = userPickMovie != null ? userPickMovie.getUserpickMovieViewCount() : 0;

    // 결과 Map 생성
    Map<String, Object> resultMap = new HashMap<>();
    resultMap.put("viewCount", viewCount);
    resultMap.put("statistics", statistics);

    return resultMap;
    }

    // 전체 평점 분포 계산 헬퍼 메서드
    private List<Map<String, Object>> calculateTotalRatingDistribution(int tmdbMovieId) {
        List<Map<String, Object>> simpleDistribution = simpleReviewDao.selectSimpleReviewRatingDistributionByTmdbMovieId(tmdbMovieId);
        List<Map<String, Object>> boardDistribution = boardReviewDao.selectBoardReviewRatingDistributionByTmdbMovieId(tmdbMovieId);
        
        // 1~10점별로 합산
        Map<Integer, Integer> ratingMap = new HashMap<>();
        
        // 심플 리뷰 분포 추가
        if (simpleDistribution != null) {
            for (Map<String, Object> item : simpleDistribution) {
                // 대문자 키(RATING, COUNT) 또는 소문자 키(rating, count) 모두 처리
                Object ratingObj = item.get("RATING");
                if (ratingObj == null) ratingObj = item.get("rating");
                Object countObj = item.get("COUNT");
                if (countObj == null) countObj = item.get("count");
                if (ratingObj != null && countObj != null) {
                    Integer rating = ((Number) ratingObj).intValue();
                    Integer count = ((Number) countObj).intValue();
                    ratingMap.put(rating, ratingMap.getOrDefault(rating, 0) + count);
                }
            }
        }
        
        // 게시판 리뷰 분포 추가
        if (boardDistribution != null) {
            for (Map<String, Object> item : boardDistribution) {
                // 대문자 키(RATING, COUNT) 또는 소문자 키(rating, count) 모두 처리
                Object ratingObj = item.get("RATING");
                if (ratingObj == null) ratingObj = item.get("rating");
                Object countObj = item.get("COUNT");
                if (countObj == null) countObj = item.get("count");
                if (ratingObj != null && countObj != null) {
                    Integer rating = ((Number) ratingObj).intValue();
                    Integer count = ((Number) countObj).intValue();
                    ratingMap.put(rating, ratingMap.getOrDefault(rating, 0) + count);
                }
            }
        }
        
        // 1~10점 모두 포함하도록 리스트 생성
        List<Map<String, Object>> totalDistribution = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("rating", i);
            item.put("count", ratingMap.getOrDefault(i, 0));
            totalDistribution.add(item);
        }
        
        return totalDistribution;
    }
}

