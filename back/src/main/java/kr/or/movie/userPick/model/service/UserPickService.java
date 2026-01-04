package kr.or.movie.userPick.model.service;

import org.springframework.stereotype.Service;

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
        System.out.println(totalCount);
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        List<UserPickMovie> list = userPickMovieDao.selectUserPickList(pageInfo);
        System.out.println(list);
        
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
}

