package kr.or.movie.admin.model.service;
import org.springframework.stereotype.Service;
import kr.or.movie.member.model.dao.MemberDao;
import kr.or.movie.member.model.dto.Member;
import kr.or.movie.simepleReview.model.dao.SimpleReviewDao;
import kr.or.movie.simepleReview.model.dto.SimpleReview;
import kr.or.movie.userPick.model.dao.UserPickMovieGenreDao;
import kr.or.movie.userPick.model.dto.UserPickMovieGenre;
import kr.or.movie.boardReview.model.dao.BoardReviewDao;
import kr.or.movie.boardReview.model.dto.BoardReview;
import kr.or.movie.userPick.model.dao.UserPickMovieDao;
import kr.or.movie.userPick.model.dto.UserPickMovie;
import kr.or.movie.util.PageInfo;
import kr.or.movie.util.Pagination;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AdminService {
    @Autowired
    private MemberDao memberDao;
    @Autowired
    private SimpleReviewDao simpleReviewDao;
    @Autowired
    private UserPickMovieGenreDao userPickMovieGenreDao;
    @Autowired
    private BoardReviewDao boardReviewDao;
    @Autowired
    private UserPickMovieDao userPickMovieDao;
    @Autowired
    private Pagination pagination;

    public Map<String, Object> getMemberList(int reqPage) {
        Map<String, Object> map = new HashMap<>();

        // 1. 회원 목록 조회
        int numPerPage = 10;
        int pageNaviSize = 5;
        int totalCount = memberDao.getMemberListCount();
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        List<Member> members = memberDao.getMemberList(pageInfo);

        // 2. map에 데이터 담기
        map.put("memberList", members);
        map.put("pi", pageInfo);

        return map;
    }

    public Map<String, Object> searchMemberList(String searchType, String keyword, int reqPage) {
        Map<String, Object> map = new HashMap<>();

        // 1. 검색 타입에 따라 회원 목록 조회
        int numPerPage = 10;
        int pageNaviSize = 5;
        int totalCount = memberDao.getMemberSearchCount(searchType, keyword);
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        List<Member> members = memberDao.getMemberSearchList(searchType, keyword, pageInfo);

        // 2. map에 데이터 담기
        map.put("memberList", members);
        map.put("pi", pageInfo);

        return map;
    }

    public int updateMemberType(Member member) {
        return memberDao.updateMemberType(member);
    }

    public int deleteMember(String memberId) {
        return memberDao.deleteMember(memberId);
    }

    // 관리자 전체 심플 리뷰 통계 조회
    public Map<String, Object> getAllSimpleReviewStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 1. 전체 심플 리뷰 수 조회
        int totalCount = simpleReviewDao.selectAllSimpleReviewCount();
        statistics.put("totalCount", totalCount);
        
        // 2. 전체 평균 평점 조회
        Double averageRating = simpleReviewDao.selectAllSimpleReviewAverageRating();
        statistics.put("averageRating", averageRating != null ? averageRating : 0.0);
        
        // 3. 장르별 분포 조회 및 정규화
        List<Map<String, Object>> genreDistribution = simpleReviewDao.selectAllSimpleReviewGenreDistribution();
        statistics.put("genreDistribution", formatGenreDistribution(genreDistribution));
        
        // 4. 평점 분포 조회 및 정규화 (1~10점 모두 포함)
        List<Map<String, Object>> ratingDistribution = simpleReviewDao.selectAllSimpleReviewRatingDistribution();
        statistics.put("ratingDistribution", formatRatingDistribution(ratingDistribution));
        
        return statistics;
    }

    // 장르별 분포 정규화 헬퍼 메서드
    private List<Map<String, Object>> formatGenreDistribution(List<Map<String, Object>> genreDistribution) {
        if (genreDistribution == null || genreDistribution.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 장르별 카운트를 Map으로 변환 (대문자/소문자 키 모두 처리)
        Map<String, Integer> genreMap = new HashMap<>();
        for (Map<String, Object> item : genreDistribution) {
            // MyBatis map-underscore-to-camel-case 설정에 따라 genreName으로 반환됨
            Object genreNameObj = item.get("genreName");
            if (genreNameObj == null) genreNameObj = item.get("GENRENAME");
            if (genreNameObj == null) genreNameObj = item.get("GENRE_NAME");
            if (genreNameObj == null) genreNameObj = item.get("name");
            if (genreNameObj == null) genreNameObj = item.get("NAME");
            
            Object countObj = item.get("count");
            if (countObj == null) countObj = item.get("COUNT");
            
            if (genreNameObj != null && countObj != null) {
                String genreName = genreNameObj.toString();
                Integer count = ((Number) countObj).intValue();
                genreMap.put(genreName, genreMap.getOrDefault(genreName, 0) + count);
            }
        }
        
        // 조회된 장르만 포함하여 리스트 생성
        List<Map<String, Object>> formattedDistribution = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : genreMap.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("genreName", entry.getKey());
            item.put("name", entry.getKey()); // 호환성을 위해 두 개의 키 모두 추가
            item.put("count", entry.getValue());
            item.put("value", entry.getValue()); // 차트에서 사용할 수 있도록 value 키도 추가
            formattedDistribution.add(item);
        }
        
        return formattedDistribution;
    }

    // 평점 분포 정규화 헬퍼 메서드 (1~10점 모두 포함)
    private List<Map<String, Object>> formatRatingDistribution(List<Map<String, Object>> ratingDistribution) {
        // 1~10점별 카운트를 Map으로 변환
        Map<Integer, Integer> ratingMap = new HashMap<>();
        if (ratingDistribution != null) {
            for (Map<String, Object> item : ratingDistribution) {
                // 대문자 키(RATING) 또는 소문자 키(rating) 모두 처리
                Object ratingObj = item.get("rating");
                if (ratingObj == null) ratingObj = item.get("RATING");
                Object countObj = item.get("count");
                if (countObj == null) countObj = item.get("COUNT");
                
                if (ratingObj != null && countObj != null) {
                    Integer rating = ((Number) ratingObj).intValue();
                    Integer count = ((Number) countObj).intValue();
                    ratingMap.put(rating, count);
                }
            }
        }
        
        // 1~10점 모두 포함하여 리스트 생성 (없는 점수는 0으로)
        List<Map<String, Object>> formattedDistribution = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("rating", i);
            item.put("count", ratingMap.getOrDefault(i, 0));
            item.put("value", ratingMap.getOrDefault(i, 0)); // 차트에서 사용할 수 있도록 value 키도 추가
            formattedDistribution.add(item);
        }
        
        return formattedDistribution;
    }

    // 관리자 특정 유저 심플 리뷰 통계 조회
    public Map<String, Object> getUserSimpleReviewStatistics(String keyword) {
        Map<String, Object> result = new HashMap<>();
        
        // 1. 아이디 또는 닉네임으로 회원 찾기
        Member member = null;
        
        // 먼저 아이디로 검색
        member = memberDao.idCheck(keyword);
        
        // 아이디로 찾지 못하면 닉네임으로 검색
        if (member == null) {
            member = memberDao.nicknameCheck(keyword);
        }
        
        // 회원을 찾지 못한 경우
        if (member == null) {
            result.put("message", "not_found");
            return result;
        }
        
        // 2. 해당 회원의 심플 리뷰 통계 조회
        Map<String, Object> statistics = new HashMap<>();
        String memberId = member.getMemberId();
        
        // 작성한 심플 리뷰 수 조회
        int totalCount = simpleReviewDao.selectSimpleReviewCountByMemberId(memberId);
        statistics.put("totalCount", totalCount);
        
        // 평균 평점 조회
        Double averageRating = simpleReviewDao.selectSimpleReviewAverageRatingByMemberId(memberId);
        statistics.put("averageRating", averageRating != null ? averageRating : 0.0);
        
        // 장르별 분포 조회 및 정규화
        List<Map<String, Object>> genreDistribution = simpleReviewDao.selectSimpleReviewGenreDistributionByMemberId(memberId);
        statistics.put("genreDistribution", formatGenreDistribution(genreDistribution));
        
        // 평점 분포 조회 및 정규화 (1~10점 모두 포함)
        List<Map<String, Object>> ratingDistribution = simpleReviewDao.selectSimpleReviewRatingDistributionByMemberId(memberId);
        statistics.put("ratingDistribution", formatRatingDistribution(ratingDistribution));
        
        // 3. 결과 반환
        result.put("message", "success");
        result.put("statistics", statistics);
        result.put("memberId", memberId);
        
        return result;
    }

    // 관리자 전체 심플 리뷰 목록 조회 (페이지네이션)
    public Map<String, Object> getAllSimpleReviewList(int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 심플 리뷰 목록 조회
        int numPerPage = 12; // 한 페이지에 12개씩
        int pageNaviSize = 5;
        int totalCount = simpleReviewDao.selectAllSimpleReviewListCount();
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        List<SimpleReview> list = simpleReviewDao.selectAllSimpleReviewList(pageInfo);
        
        // 2. 각 리뷰에 장르 정보 추가
        for(SimpleReview review : list) {
            if(review.getUserpickMovieNo() > 0) {
                List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(review.getUserpickMovieNo());
                // List<UserPickMovieGenre>을 List<Map<String, Object>>로 변환
                List<Map<String, Object>> genreList = new ArrayList<>();
                for(UserPickMovieGenre genre : genres) {
                    Map<String, Object> genreMap = new HashMap<>();
                    genreMap.put("userpickGenreId", genre.getUserpickGenreId());
                    genreMap.put("userpickGenreName", genre.getUserpickGenreName());
                    genreList.add(genreMap);
                }
                review.setSimpleReviewGenres(genreList);
            }
        }
        
        // 3. map에 데이터 담기
        map.put("simpleReviewList", list);
        map.put("pi", pageInfo);
        return map;
    }

    // 관리자 심플 리뷰 검색
    public Map<String, Object> searchAllSimpleReviewList(String searchType, String keyword, String genreId, int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 검색 타입에 따라 심플 리뷰 목록 조회
        int numPerPage = 12; // 한 페이지에 12개씩
        int pageNaviSize = 5;
        int totalCount = 0;
        List<SimpleReview> list = new ArrayList<>();
        
        if ("title".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
            // 제목 검색
            totalCount = simpleReviewDao.selectAllSimpleReviewSearchCountByTitle(keyword);
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = simpleReviewDao.selectAllSimpleReviewSearchByTitle(keyword, pageInfo);
        } else if ("genre".equals(searchType) && genreId != null && !genreId.trim().isEmpty()) {
            // 장르 검색
            totalCount = simpleReviewDao.selectAllSimpleReviewSearchCountByGenre(Integer.parseInt(genreId));
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = simpleReviewDao.selectAllSimpleReviewSearchByGenre(Integer.parseInt(genreId), pageInfo);
        } else if ("user".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
            // 유저 검색
            totalCount = simpleReviewDao.selectAllSimpleReviewSearchCountByUser(keyword);
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = simpleReviewDao.selectAllSimpleReviewSearchByUser(keyword, pageInfo);
        } else {
            // 검색 조건이 없으면 빈 리스트 반환
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, 0);
            map.put("simpleReviewList", new ArrayList<>());
            map.put("pi", pageInfo);
            return map;
        }
        
        // 2. 각 리뷰에 장르 정보 추가
        for(SimpleReview review : list) {
            if(review.getUserpickMovieNo() > 0) {
                List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(review.getUserpickMovieNo());
                // List<UserPickMovieGenre>을 List<Map<String, Object>>로 변환
                List<Map<String, Object>> genreList = new ArrayList<>();
                for(UserPickMovieGenre genre : genres) {
                    Map<String, Object> genreMap = new HashMap<>();
                    genreMap.put("userpickGenreId", genre.getUserpickGenreId());
                    genreMap.put("userpickGenreName", genre.getUserpickGenreName());
                    genreList.add(genreMap);
                }
                review.setSimpleReviewGenres(genreList);
            }
        }
        
        // 3. map에 데이터 담기
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        map.put("simpleReviewList", list);
        map.put("pi", pageInfo);
        return map;
    }

    // 관리자 심플 리뷰 삭제
    public int deleteSimpleReview(int simpleReviewNo) {
        return simpleReviewDao.deleteSimpleReview(simpleReviewNo);
    }

    // 관리자 전체 게시글 리뷰 통계 조회
    public Map<String, Object> getAllBoardReviewStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 1. 전체 게시글 리뷰 수 조회
        int totalCount = boardReviewDao.selectAllBoardReviewCount();
        statistics.put("totalCount", totalCount);
        
        // 2. 전체 평균 평점 조회
        Double averageRating = boardReviewDao.selectAllBoardReviewAverageRating();
        statistics.put("averageRating", averageRating != null ? averageRating : 0.0);
        
        // 3. 장르별 분포 조회 및 정규화
        List<Map<String, Object>> genreDistribution = boardReviewDao.selectAllBoardReviewGenreDistribution();
        statistics.put("genreDistribution", formatGenreDistribution(genreDistribution));
        
        // 4. 평점 분포 조회 및 정규화 (1~10점 모두 포함)
        List<Map<String, Object>> ratingDistribution = boardReviewDao.selectAllBoardReviewRatingDistribution();
        statistics.put("ratingDistribution", formatRatingDistribution(ratingDistribution));
        
        return statistics;
    }

    // 관리자 전체 게시글 리뷰 목록 조회 (페이지네이션)
    public Map<String, Object> getAllBoardReviewList(int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 게시글 리뷰 목록 조회
        int numPerPage = 12; // 한 페이지에 12개씩
        int pageNaviSize = 5;
        int totalCount = boardReviewDao.selectAllBoardReviewListCount();
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        List<BoardReview> list = boardReviewDao.selectAllBoardReviewList(pageInfo);
        
        // 2. 각 리뷰에 장르 정보 추가
        for(BoardReview review : list) {
            if(review.getUserpickMovieNo() > 0) {
                List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(review.getUserpickMovieNo());
                review.setUserpickMovieGenres(genres);
            }
        }
        
        // 3. map에 데이터 담기
        map.put("boardReviewList", list);
        map.put("pi", pageInfo);
        return map;
    }

    // 관리자 게시글 리뷰 검색
    public Map<String, Object> searchAllBoardReviewList(String searchType, String keyword, String genreId, int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 검색 타입에 따라 게시글 리뷰 목록 조회
        int numPerPage = 12; // 한 페이지에 12개씩
        int pageNaviSize = 5;
        int totalCount = 0;
        List<BoardReview> list = new ArrayList<>();
        
        if ("title".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
            // 제목 검색
            totalCount = boardReviewDao.selectAllBoardReviewSearchCountByTitle(keyword);
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = boardReviewDao.selectAllBoardReviewSearchByTitle(keyword, pageInfo);
        } else if ("genre".equals(searchType) && genreId != null && !genreId.trim().isEmpty()) {
            // 장르 검색
            totalCount = boardReviewDao.selectAllBoardReviewSearchCountByGenre(Integer.parseInt(genreId));
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = boardReviewDao.selectAllBoardReviewSearchByGenre(Integer.parseInt(genreId), pageInfo);
        } else if ("user".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
            // 유저 검색
            totalCount = boardReviewDao.selectAllBoardReviewSearchCountByUser(keyword);
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = boardReviewDao.selectAllBoardReviewSearchByUser(keyword, pageInfo);
        } else {
            // 검색 조건이 없으면 전체 목록 조회
            totalCount = boardReviewDao.selectAllBoardReviewListCount();
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = boardReviewDao.selectAllBoardReviewList(pageInfo);
        }
        
        // 2. 각 리뷰에 장르 정보 추가
        for(BoardReview review : list) {
            if(review.getUserpickMovieNo() > 0) {
                List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(review.getUserpickMovieNo());
                review.setUserpickMovieGenres(genres);
            }
        }
        
        // 3. map에 데이터 담기
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        map.put("boardReviewList", list);
        map.put("pi", pageInfo);
        return map;
    }

    // 관리자 전체 유저픽 영화 통계 조회
    public Map<String, Object> getAllUserPickMovieStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 1. 전체 유저픽 영화 수 조회
        int totalCount = userPickMovieDao.selectAllUserPickMovieCount();
        statistics.put("totalCount", totalCount);
        
        // 2. 활성 영화 수 조회
        int activeCount = userPickMovieDao.selectActiveUserPickMovieCount();
        statistics.put("activeCount", activeCount);
        
        // 3. 비활성 영화 수 조회
        int inactiveCount = userPickMovieDao.selectInactiveUserPickMovieCount();
        statistics.put("inactiveCount", inactiveCount);
        
        // 4. 평균 조회수 조회
        Double averageViewCount = userPickMovieDao.selectAverageViewCount();
        statistics.put("averageViewCount", averageViewCount != null ? averageViewCount : 0.0);
        
        // 5. 리뷰가 작성된 영화 수 조회
        int reviewedMovieCount = userPickMovieDao.selectReviewedMovieCount();
        statistics.put("reviewedMovieCount", reviewedMovieCount);
        
        // 6. 평균 리뷰 수 조회
        Double averageReviewCount = userPickMovieDao.selectAverageReviewCount();
        statistics.put("averageReviewCount", averageReviewCount != null ? averageReviewCount : 0.0);
        
        // 7. 총 리뷰 수 조회
        int totalReviewCount = userPickMovieDao.selectTotalReviewCount();
        statistics.put("totalReviewCount", totalReviewCount);
        
        // 8. 장르별 분포 조회 및 정규화
        List<Map<String, Object>> genreDistribution = userPickMovieDao.selectGenreDistribution();
        statistics.put("genreDistribution", formatGenreDistribution(genreDistribution));
        
        // 9. 가장 많이 조회된 영화 TOP 5
        List<Map<String, Object>> topViewedMovies = userPickMovieDao.selectTopViewedMovies();
        statistics.put("topViewedMovies", topViewedMovies);
        
        // 10. 가장 많은 리뷰가 작성된 영화 TOP 5
        List<Map<String, Object>> topReviewedMovies = userPickMovieDao.selectTopReviewedMovies();
        statistics.put("topReviewedMovies", topReviewedMovies);
        
        return statistics;
    }

    // 관리자 전체 유저픽 영화 목록 조회 (페이지네이션)
    public Map<String, Object> getAllUserPickMovieList(int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 유저픽 영화 목록 조회
        int numPerPage = 12; // 한 페이지에 12개씩
        int pageNaviSize = 5;
        int totalCount = userPickMovieDao.selectAllUserPickMovieListCount();
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        List<UserPickMovie> list = userPickMovieDao.selectAllUserPickMovieList(pageInfo);
        
        // 2. 각 영화에 장르 정보 추가 및 유저 평점 계산
        for(UserPickMovie movie : list) {
            if(movie.getUserpickMovieNo() > 0) {
                List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(movie.getUserpickMovieNo());
                movie.setUserpickMovieGenres(genres);
            }
            
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
        
        // 3. map에 데이터 담기
        map.put("userPickMovieList", list);
        map.put("pi", pageInfo);
        return map;
    }

    // 관리자 유저픽 영화 검색
    public Map<String, Object> searchAllUserPickMovieList(String searchType, String keyword, String genreId, String status, int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 검색 타입에 따라 유저픽 영화 목록 조회
        int numPerPage = 12; // 한 페이지에 12개씩
        int pageNaviSize = 5;
        int totalCount = 0;
        List<UserPickMovie> list = new ArrayList<>();
        
        if ("title".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
            // 제목 검색
            totalCount = userPickMovieDao.selectAllUserPickMovieSearchCountByTitle(keyword);
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = userPickMovieDao.selectAllUserPickMovieSearchByTitle(keyword, pageInfo);
        } else if ("genre".equals(searchType) && genreId != null && !genreId.trim().isEmpty()) {
            // 장르 검색
            totalCount = userPickMovieDao.selectAllUserPickMovieSearchCountByGenre(Integer.parseInt(genreId));
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = userPickMovieDao.selectAllUserPickMovieSearchByGenre(Integer.parseInt(genreId), pageInfo);
        } else if ("status".equals(searchType) && status != null && !status.trim().isEmpty()) {
            // 상태 검색
            int statusValue = Integer.parseInt(status);
            if (statusValue == 0) {
                // 전체 조회
                totalCount = userPickMovieDao.selectAllUserPickMovieListCount();
                PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
                list = userPickMovieDao.selectAllUserPickMovieList(pageInfo);
            } else {
                totalCount = userPickMovieDao.selectAllUserPickMovieSearchCountByStatus(statusValue);
                PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
                list = userPickMovieDao.selectAllUserPickMovieSearchByStatus(statusValue, pageInfo);
            }
        } else {
            // 검색 조건이 없으면 전체 목록 조회
            totalCount = userPickMovieDao.selectAllUserPickMovieListCount();
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = userPickMovieDao.selectAllUserPickMovieList(pageInfo);
        }
        
        // 2. 각 영화에 장르 정보 추가 및 유저 평점 계산
        for(UserPickMovie movie : list) {
            if(movie.getUserpickMovieNo() > 0) {
                List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(movie.getUserpickMovieNo());
                movie.setUserpickMovieGenres(genres);
            }
            
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
        
        // 3. map에 데이터 담기
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        map.put("userPickMovieList", list);
        map.put("pi", pageInfo);
        return map;
    }

    // 관리자 유저픽 영화 상태 변경
    public int updateUserPickMovieStatus(int movieNo, int status) {
        return userPickMovieDao.updateUserPickMovieStatus(movieNo, status);
    }

    // 관리자 유저픽 영화 삭제
    public int deleteUserPickMovie(int movieNo) {
        return userPickMovieDao.deleteUserPickMovie(movieNo);
    }

    // 관리자 특정 유저 게시글 리뷰 통계 조회
    public Map<String, Object> getUserBoardReviewStatistics(String keyword) {
        Map<String, Object> result = new HashMap<>();
        
        // 1. 회원 조회 (아이디 또는 닉네임으로)
        Member member = memberDao.idCheck(keyword);
        
        // 아이디로 찾지 못하면 닉네임으로 검색
        if (member == null) {
            member = memberDao.nicknameCheck(keyword);
        }
        
        // 회원을 찾지 못한 경우
        if (member == null) {
            result.put("message", "not_found");
            return result;
        }
        
        // 2. 해당 회원의 게시글 리뷰 통계 조회
        Map<String, Object> statistics = new HashMap<>();
        String memberId = member.getMemberId();
        
        // 작성한 게시글 리뷰 수 조회
        int totalCount = boardReviewDao.selectBoardReviewCountByMemberId(memberId);
        statistics.put("totalCount", totalCount);
        
        // 평균 평점 조회
        Double averageRating = boardReviewDao.selectBoardReviewAverageRatingByMemberId(memberId);
        statistics.put("averageRating", averageRating != null ? averageRating : 0.0);
        
        // 장르별 분포 조회 및 정규화
        List<Map<String, Object>> genreDistribution = boardReviewDao.selectBoardReviewGenreDistributionByMemberId(memberId);
        statistics.put("genreDistribution", formatGenreDistribution(genreDistribution));
        
        // 평점 분포 조회 및 정규화 (1~10점 모두 포함)
        List<Map<String, Object>> ratingDistribution = boardReviewDao.selectBoardReviewRatingDistributionByMemberId(memberId);
        statistics.put("ratingDistribution", formatRatingDistribution(ratingDistribution));
        
        // 3. 결과 반환
        result.put("message", "success");
        result.put("statistics", statistics);
        result.put("memberId", memberId);
        
        return result;
    }

    // 관리자 게시글 리뷰 삭제
    public int deleteBoardReview(int boardReviewNo) {
        return boardReviewDao.deleteBoardReview(boardReviewNo);
    }
}
