package kr.or.movie.member.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.member.model.dao.MemberDao;
import kr.or.movie.member.model.dto.Member;
import kr.or.movie.util.JwtUtil;
import kr.or.movie.simepleReview.model.dao.SimpleReviewDao;
import kr.or.movie.simepleReview.model.dto.SimpleReview;
import kr.or.movie.boardReview.model.dao.BoardReviewDao;
import kr.or.movie.boardReview.model.dto.BoardReview;
import kr.or.movie.util.PageInfo;
import kr.or.movie.util.Pagination;
import kr.or.movie.userPick.model.dao.UserPickMovieGenreDao;
import kr.or.movie.userPick.model.dto.UserPickMovieGenre;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class MemberService {
    @Autowired
    private MemberDao memberDao;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private SimpleReviewDao simpleReviewDao;
    @Autowired
    private BoardReviewDao boardReviewDao;
    @Autowired
    private Pagination pagination;
    @Autowired
    private UserPickMovieGenreDao userPickMovieGenreDao;

    public Member idCheck(String memberId) {
        return memberDao.idCheck(memberId);
    }

    public Member nicknameCheck(String memberNickname) {
        return memberDao.nicknameCheck(memberNickname);
    }

    public Member emailCheck(String memberEmail) {
        return memberDao.emailCheck(memberEmail);
    }

    @Transactional
    public int insertMember(Member member) {
        return memberDao.insertMember(member);
    }

    public String login(Member member) {
        Member m = memberDao.idCheck(member.getMemberId());

        // 1. 아이디 존재 여부 확인
        // 2. 비밀번호 일치 여부 확인(평문 패스워드, 암호화된 패스워드 비교)
        if(m != null && passwordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
            
            long expiredDateMs = 60*60*1000l; // 1시간
            String accessToken = jwtUtil.createToken(m.getMemberId(), expiredDateMs);
            return accessToken;
        }
        else{
            return null;
        }
    }

    public String findId(String memberEmail) {
        return memberDao.findId(memberEmail);
    }

    @Transactional
    public int updatePwMember(Member member) {
        return memberDao.updatePwMember(member);
    }

    public Member selectMemberByEmailAndId(String memberEmail, String memberId) {
        return memberDao.selectMemberByEmailAndId(memberEmail, memberId);
    }

    public Member selectMemberById(String memberId) {
        return memberDao.selectMemberById(memberId);
    }

    @Transactional
    public int updateMemberInfo(Member member) {
        return memberDao.updateMemberInfo(member);
    }

    public Member selectMemberByIdAndPw(Member member) {
        // 1. 아이디 존재 여부 확인 -> 암호화된 비밀번호 얻기
        Member m = memberDao.selectMemberById(member.getMemberId());

        // 2. 사용자 입력 패스워드와 암호화된 패스워드 비교 
        if(m != null && passwordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
            return m;
        }
        else{
            return null;
        }
    }

    // 마이페이지 심플 리뷰 통계 조회
    public Map<String, Object> selectSimpleReviewStatistics(String memberId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // 1. 작성한 심플 리뷰 수 조회
        int totalCount = simpleReviewDao.selectSimpleReviewCountByMemberId(memberId);
        statistics.put("totalCount", totalCount);
        
        // 2. 평균 평점 조회
        Double averageRating = simpleReviewDao.selectSimpleReviewAverageRatingByMemberId(memberId);
        statistics.put("averageRating", averageRating != null ? averageRating : 0.0);
        
        // 3. 장르별 분포 조회 및 정규화
        List<Map<String, Object>> genreDistribution = simpleReviewDao.selectSimpleReviewGenreDistributionByMemberId(memberId);
        statistics.put("genreDistribution", formatGenreDistribution(genreDistribution));
        
        // 4. 평점 분포 조회 및 정규화 (1~10점 모두 포함)
        List<Map<String, Object>> ratingDistribution = simpleReviewDao.selectSimpleReviewRatingDistributionByMemberId(memberId);
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
        
        // 1~10점 모두 포함하도록 리스트 생성
        List<Map<String, Object>> formattedDistribution = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("rating", i);
            item.put("count", ratingMap.getOrDefault(i, 0));
            formattedDistribution.add(item);
        }
        
        return formattedDistribution;
    }

    // 회원별 심플 리뷰 목록 조회 (페이지네이션)
    public Map<String, Object> selectSimpleReviewList(String memberId, int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 심플 리뷰 목록 조회
        int numPerPage = 4; // 한 페이지에 4개씩
        int pageNaviSize = 5;
        int totalCount = simpleReviewDao.selectSimpleReviewListCountByMemberId(memberId);
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        List<SimpleReview> list = simpleReviewDao.selectSimpleReviewListByMemberId(memberId, pageInfo);
        
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

    // 회원별 심플 리뷰 검색
    public Map<String, Object> searchSimpleReviewList(String memberId, String searchType, String keyword, String genreId, int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 검색 타입에 따라 심플 리뷰 목록 조회
        int numPerPage = 3; // 한 페이지에 3개씩
        int pageNaviSize = 5;
        int totalCount = 0;
        List<SimpleReview> list = new ArrayList<>();
        
        if ("title".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
            // 제목 검색
            totalCount = simpleReviewDao.selectSimpleReviewSearchCountByTitle(memberId, keyword);
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = simpleReviewDao.selectSimpleReviewSearchByTitle(memberId, keyword, pageInfo);
        } else if ("genre".equals(searchType) && genreId != null && !genreId.trim().isEmpty()) {
            // 장르 검색
            totalCount = simpleReviewDao.selectSimpleReviewSearchCountByGenre(memberId, Integer.parseInt(genreId));
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = simpleReviewDao.selectSimpleReviewSearchByGenre(memberId, Integer.parseInt(genreId), pageInfo);
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

    // 회원별 게시글 리뷰 목록 조회 (페이지네이션)
    public Map<String, Object> selectBoardReviewList(String memberId, int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 게시글 리뷰 목록 조회
        int numPerPage = 4; // 한 페이지에 4개씩
        int pageNaviSize = 5;
        int totalCount = boardReviewDao.selectBoardReviewListCountByMemberId(memberId);
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        List<BoardReview> list = boardReviewDao.selectBoardReviewListByMemberId(memberId, pageInfo);
        
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

    // 회원별 게시글 리뷰 검색
    public Map<String, Object> searchBoardReviewList(String memberId, String searchType, String keyword, String genreId, int reqPage) {
        Map<String, Object> map = new HashMap<>();
        
        // 1. 검색 타입에 따라 게시글 리뷰 목록 조회
        int numPerPage = 4; // 한 페이지에 4개씩
        int pageNaviSize = 5;
        int totalCount = 0;
        List<BoardReview> list = new ArrayList<>();
        
        if ("title".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
            // 제목 검색
            totalCount = boardReviewDao.selectBoardReviewSearchCountByTitle(memberId, keyword);
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = boardReviewDao.selectBoardReviewSearchByTitle(memberId, keyword, pageInfo);
        } else if ("genre".equals(searchType) && genreId != null && !genreId.trim().isEmpty()) {
            // 장르 검색
            totalCount = boardReviewDao.selectBoardReviewSearchCountByGenre(memberId, Integer.parseInt(genreId));
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            list = boardReviewDao.selectBoardReviewSearchByGenre(memberId, Integer.parseInt(genreId), pageInfo);
        } else {
            // 검색 조건이 없으면 빈 리스트 반환
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, 0);
            map.put("boardReviewList", new ArrayList<>());
            map.put("pi", pageInfo);
            return map;
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

    // 회원별 게시글 리뷰 통계 조회
    public Map<String, Object> selectBoardReviewStatistics(String memberId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // 1. 작성한 게시글 리뷰 수 조회
        int totalCount = boardReviewDao.selectBoardReviewCountByMemberId(memberId);
        statistics.put("totalCount", totalCount);
        
        // 2. 평균 평점 조회
        Double averageRating = boardReviewDao.selectBoardReviewAverageRatingByMemberId(memberId);
        statistics.put("averageRating", averageRating != null ? averageRating : 0.0);
        
        // 3. 장르별 분포 조회 및 정규화
        List<Map<String, Object>> genreDistribution = boardReviewDao.selectBoardReviewGenreDistributionByMemberId(memberId);
        statistics.put("genreDistribution", formatGenreDistribution(genreDistribution));
        
        // 4. 평점 분포 조회 및 정규화 (1~10점 모두 포함)
        List<Map<String, Object>> ratingDistribution = boardReviewDao.selectBoardReviewRatingDistributionByMemberId(memberId);
        statistics.put("ratingDistribution", formatRatingDistribution(ratingDistribution));
        
        return statistics;
    }

  
}
