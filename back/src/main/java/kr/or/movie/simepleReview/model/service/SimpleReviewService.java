package kr.or.movie.simepleReview.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.simepleReview.model.dao.SimpleReviewDao;
import kr.or.movie.simepleReview.model.dto.SimpleReview;
import kr.or.movie.userPick.model.dao.UserPickMovieDao;
import kr.or.movie.userPick.model.dao.UserPickMovieGenreDao;
import kr.or.movie.userPick.model.dto.UserPickMovieGenre;
import kr.or.movie.boardReview.model.dao.BoardReviewDao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SimpleReviewService {
    @Autowired
    private SimpleReviewDao simpleReviewDao;

    @Autowired
    private BoardReviewDao boardReviewDao;

    @Autowired
    private UserPickMovieDao userpickMovieDao;
    @Autowired
    private UserPickMovieGenreDao userpickMovieGenreDao;
    
    

    @Transactional
    public int insertSimpleReview(SimpleReview simpleReview) {
    	// 1. 심플 리뷰 테이블에 리뷰 저장
    	int result = simpleReviewDao.insertSimpleReview(simpleReview);

        int result2 = 0;
        int result3 = 0;
    	
    	// 2-1. userpick_movie 테이블에 해당 영화가 있는지 체크
        int isUserpickMovie = userpickMovieDao.selectUserpickMovie(simpleReview.getSimpleReviewTmdbMovieId());
        System.out.println("userpick_movie 테이블에 해당 영화가 있는지 체크 : " + isUserpickMovie);
    	
    	// 2-2. 없으면 (== 0) userpick_movie에 영화 정보 추가
        // 2-3. 그리고 userpick_genre에 해당 영화 장르들 추가 
        if(isUserpickMovie == 0){
            // userpick_movie에 영화 정보 추가
            result2 = userpickMovieDao.insertUserpickMovie(simpleReview);
            
            // userpick_genre에 장르들 추가 (각 장르마다 개별 INSERT)
            if(result2 > 0 && simpleReview.getSimpleReviewGenres() != null 
               && simpleReview.getSimpleReviewGenres().size() > 0) {
                // 각 장르마다 개별 INSERT
                for(Map<String, Object> genreMap : simpleReview.getSimpleReviewGenres()) {
                    UserPickMovieGenre genre = new UserPickMovieGenre();
                    genre.setUserpickGenreMovieNo(simpleReview.getUserpickMovieNo());
                    genre.setUserpickGenreId(((Number) genreMap.get("id")).intValue());
                    genre.setUserpickGenreName((String) genreMap.get("name"));
                    result3 += userpickMovieGenreDao.insertUserpickMovieGenre(genre);
                }
            }
        }
    	
    	// 결과 반환
    	if(isUserpickMovie == 0){
            // 새로 추가한 경우: 모든 작업이 성공해야 함
            int expectedGenreCount = simpleReview.getSimpleReviewGenres() != null ? 
                simpleReview.getSimpleReviewGenres().size() : 0;
            if(result > 0 && result2 > 0 && (expectedGenreCount == 0 || result3 == expectedGenreCount)){
                return 1;
            }
            else{
                return 0;
            }
        } else {
            // 이미 존재하는 경우: 심플 리뷰만 성공하면 됨
            if(result > 0){
                return 1;
            }
            else{
                return 0;
            }
        }
    }

    // 리뷰 작성 여부 확인
    public boolean checkHasReview(int movieId, String memberId) {
//    	System.out.println(movieId);
//    	System.out.println(memberId);
        // simple_review 테이블에서 확인
        int simpleReviewCount = simpleReviewDao.selectReviewCount(movieId, memberId);
        
        // board_review 테이블에서 확인
        int boardReviewCount = boardReviewDao.selectReviewCount(movieId, memberId);
        
        System.out.println(simpleReviewCount);
        System.out.println(boardReviewCount);
        
        // 둘 중 하나라도 있으면 true (리뷰 작성 불가)
        return (simpleReviewCount > 0 || boardReviewCount > 0);
    }

    public List<SimpleReview> selectListReview(int movieId) {
        return simpleReviewDao.selectSimpleReviewList(movieId);
    }

    @Transactional
    public int updateSimpleReview(SimpleReview simpleReview) {
        return simpleReviewDao.updateSimpleReview(simpleReview);
    }

    @Transactional
    public int deleteSimpleReview(int simpleReviewNo) {
        return simpleReviewDao.deleteSimpleReview(simpleReviewNo);
    }

   
}

