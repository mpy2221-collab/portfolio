package kr.or.movie.main.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.movie.api.model.service.ApiService;
import kr.or.movie.boardReview.model.dao.BoardReviewDao;
import kr.or.movie.boardReview.model.dto.BoardReview;
import kr.or.movie.boardReview.model.dao.BoardLikeDao;
import kr.or.movie.member.model.dao.MemberDao;
import kr.or.movie.member.model.dto.Member;
import kr.or.movie.userPick.model.dto.UserPickMovie;
import kr.or.movie.userPick.model.dao.UserPickMovieDao;
import kr.or.movie.userPick.model.dao.UserPickMovieGenreDao;
import kr.or.movie.userPick.model.dto.UserPickMovieGenre;
import kr.or.movie.simepleReview.model.dao.SimpleReviewDao;
import kr.or.movie.util.PageInfo;
import kr.or.movie.util.Pagination;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MainService {

    @Autowired
    private ApiService apiService;

    @Autowired
    private BoardReviewDao boardReviewDao;

    @Autowired
    private BoardLikeDao boardLikeDao;

    @Autowired
    private MemberDao memberDao;

    @Autowired
    private UserPickMovieDao userPickMovieDao;

    @Autowired
    private UserPickMovieGenreDao userPickMovieGenreDao;

    @Autowired
    private SimpleReviewDao simpleReviewDao;

    @Autowired
    private Pagination pagination;

    /**
     * 인기 영화 TOP 5 조회
     * TMDB API에서 인기 영화를 가져와서 상위 5개만 반환
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getPopularTop5() {
        // ApiService의 selectPopularList를 사용해서 첫 페이지 데이터 가져오기
        Map<String, Object> result = apiService.selectPopularList(1);
        
        List<Map<String, Object>> popularList = (List<Map<String, Object>>) result.get("popularList");
        
        // 상위 5개만 반환
        List<Map<String, Object>> top5 = new ArrayList<>();
        if (popularList != null) {
            int size = Math.min(5, popularList.size());
            for (int i = 0; i < size; i++) {
                top5.add(popularList.get(i));
            }
        }
        
        return top5;
    }

    /**
     * 인기 유저픽 영화 TOP 5 조회
     * 유저 평점 기준으로 상위 5개 반환
     */
    public List<UserPickMovie> getUserPickTop5() {
        // 전체 유저픽 영화 목록 가져오기
        int totalCount = userPickMovieDao.selectUserPickListCount();
        PageInfo pageInfo = pagination.getPageInfo(1, totalCount, 1, totalCount);
        List<UserPickMovie> allMovies = userPickMovieDao.selectUserPickList(pageInfo);
        
        // 각 영화에 장르 추가 및 유저 평점 계산
        for (UserPickMovie movie : allMovies) {
            // 장르 추가
            List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(movie.getUserpickMovieNo());
            movie.setUserpickMovieGenres(genres);
            
            // 유저 평점 계산
            int tmdbMovieId = movie.getUserpickMovieTmdbMovieId();
            
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
            if (simpleAvg != null && boardReviewAvg != null) {
                userRating = (simpleAvg + boardReviewAvg) / 2.0;
            } else if (simpleAvg != null) {
                userRating = simpleAvg;
            } else if (boardReviewAvg != null) {
                userRating = boardReviewAvg;
            }
            
            movie.setUserpickMovieRating(userRating);
            movie.setUserpickMovieReviewCount(reviewTotalCount);
        }
        
        // 유저 평점 기준으로 정렬 (내림차순, null은 맨 뒤로)
        allMovies.sort((a, b) -> {
            Double ratingA = a.getUserpickMovieRating();
            Double ratingB = b.getUserpickMovieRating();
            
            // null 처리: null인 경우 맨 뒤로
            if (ratingA == null && ratingB == null) {
                return 0;
            }
            if (ratingA == null) {
                return 1; // ratingA가 null이면 뒤로
            }
            if (ratingB == null) {
                return -1; // ratingB가 null이면 뒤로
            }
            
            // 내림차순 정렬 (높은 평점이 앞으로)
            return ratingB.compareTo(ratingA);
        });
        
        // 상위 5개만 반환
        return allMovies.stream().limit(5).collect(Collectors.toList());
    }

    /**
     * 최근 리뷰 게시글 조회
     * 최근 작성일 기준으로 5개 반환
     */
    public List<BoardReview> getRecentReviews() {
        // BoardReviewDao에서 최근 게시글 5개 조회
        List<BoardReview> recentReviews = boardReviewDao.selectRecentBoardReviews(5);
        
        // 각 리뷰에 추가 정보 설정
        for (BoardReview review : recentReviews) {
            // 작성자 닉네임 조회
            Member member = memberDao.idCheck(review.getBoardReviewMemberId());
            if (member != null) {
                review.setMemberNickname(member.getMemberNickname());
            }
            
            // 좋아요 수 조회
            int likeCount = boardLikeDao.selectBoardReviewLikeCount(review.getBoardReviewNo());
            review.setLikeCount(likeCount);
        }
        
        return recentReviews;
    }
}

