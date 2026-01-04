package kr.or.movie.boardReview.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;

import kr.or.movie.boardReview.model.dao.BoardLikeDao;
import kr.or.movie.boardReview.model.dao.BoardReviewDao;
import kr.or.movie.boardReview.model.dao.BoardReviewFileDao;
import kr.or.movie.boardReview.model.dto.BoardReview;
import kr.or.movie.boardReview.model.dto.BoardReviewFile;
import kr.or.movie.comment.model.dao.CommentDao;
import kr.or.movie.comment.model.dto.CommentTbl;
import kr.or.movie.member.model.dao.MemberDao;
import kr.or.movie.member.model.dto.Member;
import kr.or.movie.simepleReview.model.dao.SimpleReviewDao;
import kr.or.movie.userPick.model.dao.UserPickMovieDao;
import kr.or.movie.userPick.model.dao.UserPickMovieGenreDao;
import kr.or.movie.userPick.model.dto.UserPickMovie;
import kr.or.movie.userPick.model.dto.UserPickMovieGenre;
import kr.or.movie.util.PageInfo;
import kr.or.movie.util.Pagination;
import java.util.HashMap;

@Service
public class BoardReviewService {
    @Autowired
    private BoardReviewDao boardReviewDao;
    @Autowired
    private UserPickMovieGenreDao userPickMovieGenreDao;
    @Autowired
    private UserPickMovieDao userPickMovieDao;
    @Autowired
    private BoardReviewFileDao boardReviewFileDao;
    @Autowired
    private SimpleReviewDao simpleReviewDao;
    @Autowired
    private Pagination pagination;
    @Autowired
    private MemberDao memberDao;
    @Autowired
    private BoardLikeDao boardLikeDao;
    @Autowired
    private CommentDao commentDao;

   @Transactional
public int insertBoardReview(BoardReview boardReview, String[] boardReviewGenreIds, String[] boardReviewGenreNames, ArrayList<BoardReviewFile> boardReviewFileList){
    // 1. 게시글 리뷰 저장
    int result = boardReviewDao.insertBoardReview(boardReview);
    if(result == 0) return 0; // 게시글 저장 실패

    // 2. 첨부파일 저장
    for(BoardReviewFile boardReviewFile : boardReviewFileList){
        boardReviewFile.setBoardFileReviewNo(boardReview.getBoardReviewNo());
        int fileResult = boardReviewFileDao.insertBoardReviewFile(boardReviewFile);
        if(fileResult == 0) return 0; // 파일 저장 실패
    }

    // 3. 유저픽 영화인지 체크
    int isUserpickMovie = userPickMovieDao.selectUserpickMovie(boardReview.getBoardReviewTmdbMovieId());

    // 3-1 isUserpickMovie==0 이면 userpick_movie 테이블에 저장
    if(isUserpickMovie == 0){
        int result2 = userPickMovieDao.insertUserpickMovieFromBoardReview(boardReview);
        if(result2 <= 0) {
            return 0; // userpick_movie 저장 실패
        }
        
        // 3-2 userpick_movie_genre 테이블에 저장
        if(boardReviewGenreIds != null && boardReviewGenreIds.length > 0) {
            for(int i = 0; i < boardReviewGenreIds.length; i++) {
                UserPickMovieGenre genre = new UserPickMovieGenre();
                genre.setUserpickGenreMovieNo(boardReview.getUserpickMovieNo());
                genre.setUserpickGenreId(Integer.parseInt(boardReviewGenreIds[i]));
                genre.setUserpickGenreName(boardReviewGenreNames[i]);
                int genreResult = userPickMovieGenreDao.insertUserpickMovieGenre(genre);
                if(genreResult == 0) return 0; // 장르 저장 실패
            }
        }
    }
    
    return 1; // 모든 작업 성공
}


public int checkReview(int movieId, String memberId){
    //1. 심플리뷰에서 검사
    int result1 = simpleReviewDao.checkReview(movieId, memberId);

    //2. 게시글리뷰에서 검사
    int result2 = boardReviewDao.checkReview(movieId, memberId);

    if(result1 == 1 || result2 == 1){
        return 1;
    } else {
        return 0;
    }
}

public Map selectBoardReviewList(int reqPage){
    Map<String, Object> map = new HashMap<>();

    // 1. 게시글리뷰 목록 조회
    int numPerPage = 12;
    int pageNaviSize = 5;
    int totalCount = boardReviewDao.selectBoardReviewListCount();
    PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
    List<BoardReview> list = boardReviewDao.selectBoardReviewList(pageInfo);

    // 2. 유저픽 영화 테이블에서 posterPath, movieTitle, releaseDate,runtime 가져오기 및 userpickMovieNo 설정
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    for(BoardReview boardReview : list) {
        int tmdbMovieId = boardReview.getBoardReviewTmdbMovieId();
        UserPickMovie userPickMovie = userPickMovieDao.selectUserPickMovie(tmdbMovieId);
        if(userPickMovie != null) {
            boardReview.setUserpickMovieNo(userPickMovie.getUserpickMovieNo());
            boardReview.setMoviePosterPath(userPickMovie.getUserpickMoviePosterPath());
            boardReview.setMovieTitle(userPickMovie.getUserpickMovieTitle());
            if(userPickMovie.getUserpickMovieReleaseDate() != null) {
                boardReview.setMovieReleaseDate(dateFormat.format(userPickMovie.getUserpickMovieReleaseDate()));
            } else {
                boardReview.setMovieReleaseDate(null);
            }
            boardReview.setMovieRuntime(userPickMovie.getUserpickMovieRuntime());
        }
    }

    //3. list의 각 게시글리뷰에 장르 추가
    for(BoardReview boardReview : list) {
        if(boardReview.getUserpickMovieNo() > 0) {
            List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(boardReview.getUserpickMovieNo());
            boardReview.setUserpickMovieGenres(genres);
        }
    }

    // 4. 유저평가 계산
    for(BoardReview boardReview : list) {
        int tmdbMovieId = boardReview.getBoardReviewTmdbMovieId();

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
        if(userRating != null) {
            boardReview.setBoardReviewRating(userRating.intValue());
        }
        boardReview.setUserpickMovieReviewCount(reviewTotalCount);
    }

    // 5. 회원 테이블에서 프로필 이미지 가져오기 
    for(BoardReview boardReview : list) {
        String memberId = boardReview.getBoardReviewMemberId();
        Member member = memberDao.idCheck(memberId);
        boardReview.setProfilePath(member.getMemberProfileImg());
    }
    // 5. map에 데이터 담기
    map.put("boardReviewList", list);
    map.put("pi", pageInfo);
    return map;
}

public Map searchBoardReviewList(String searchType, String keyword, String genreId, int reqPage) {
    Map<String, Object> map = new HashMap<>();

    // 1. 검색 타입에 따라 게시글 리뷰 목록 조회
    int numPerPage = 12;
    int pageNaviSize = 5;
    int totalCount = 0;
    List<BoardReview> list = new ArrayList<>();

    if ("title".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
        // 영화 제목 검색
        totalCount = boardReviewDao.selectBoardReviewSearchCountByTitle(keyword);
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        list = boardReviewDao.selectBoardReviewSearchByTitle(keyword, pageInfo);
    } else if ("genre".equals(searchType) && genreId != null && !genreId.trim().isEmpty()) {
        // 장르 검색
        totalCount = boardReviewDao.selectBoardReviewSearchCountByGenre(Integer.parseInt(genreId));
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        list = boardReviewDao.selectBoardReviewSearchByGenre(Integer.parseInt(genreId), pageInfo);
    } else if ("reviewTitle".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
        // 리뷰 제목 검색
        totalCount = boardReviewDao.selectBoardReviewSearchCountByReviewTitle(keyword);
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
        list = boardReviewDao.selectBoardReviewSearchByReviewTitle(keyword, pageInfo);
    } else {
        // 검색 조건이 없으면 빈 리스트 반환
        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, 0);
        map.put("boardReviewList", new ArrayList<>());
        map.put("pi", pageInfo);
        return map;
    }

    // 2. 유저픽 영화 테이블에서 posterPath, movieTitle, releaseDate,runtime 가져오기 및 userpickMovieNo 설정
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    for(BoardReview boardReview : list) {
        int tmdbMovieId = boardReview.getBoardReviewTmdbMovieId();
        UserPickMovie userPickMovie = userPickMovieDao.selectUserPickMovie(tmdbMovieId);
        if(userPickMovie != null) {
            boardReview.setUserpickMovieNo(userPickMovie.getUserpickMovieNo());
            boardReview.setMoviePosterPath(userPickMovie.getUserpickMoviePosterPath());
            boardReview.setMovieTitle(userPickMovie.getUserpickMovieTitle());
            if(userPickMovie.getUserpickMovieReleaseDate() != null) {
                boardReview.setMovieReleaseDate(dateFormat.format(userPickMovie.getUserpickMovieReleaseDate()));
            } else {
                boardReview.setMovieReleaseDate(null);
            }
            boardReview.setMovieRuntime(userPickMovie.getUserpickMovieRuntime());
        }
    }

    //3. list의 각 게시글리뷰에 장르 추가
    for(BoardReview boardReview : list) {
        if(boardReview.getUserpickMovieNo() > 0) {
            List<UserPickMovieGenre> genres = userPickMovieGenreDao.selectUserPickMovieGenre(boardReview.getUserpickMovieNo());
            boardReview.setUserpickMovieGenres(genres);
        }
    }

    // 4. 유저평가 계산
    for(BoardReview boardReview : list) {
        int tmdbMovieId = boardReview.getBoardReviewTmdbMovieId();

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
        if(userRating != null) {
            boardReview.setBoardReviewRating(userRating.intValue());
        }
        boardReview.setUserpickMovieReviewCount(reviewTotalCount);
    }

    // 5. 회원 테이블에서 프로필 이미지 가져오기 
    for(BoardReview boardReview : list) {
        String memberId = boardReview.getBoardReviewMemberId();
        Member member = memberDao.idCheck(memberId);
        if(member != null) {
            boardReview.setProfilePath(member.getMemberProfileImg());
        }
    }

    // 6. map에 데이터 담기
    PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
    map.put("boardReviewList", list);
    map.put("pi", pageInfo);
    return map;
}

@Transactional
public BoardReview selectBoardReviewByNo(int boardReviewNo){

    // 1. 게시글 리뷰 조회
    BoardReview boardReview = boardReviewDao.selectBoardReviewByNo(boardReviewNo);

    // 2. 유저픽 영화 테이블에서 posterPath, movieTitle, releaseDate,runtime 가져오기
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    int tmdbMovieId = boardReview.getBoardReviewTmdbMovieId();
    UserPickMovie userPickMovie = userPickMovieDao.selectUserPickMovie(tmdbMovieId);
    boardReview.setMoviePosterPath(userPickMovie.getUserpickMoviePosterPath());
    boardReview.setMovieTitle(userPickMovie.getUserpickMovieTitle());

    if(userPickMovie.getUserpickMovieReleaseDate() != null) {
        boardReview.setMovieReleaseDate(dateFormat.format(userPickMovie.getUserpickMovieReleaseDate()));
    }else{
        boardReview.setMovieReleaseDate(null);
    }
    boardReview.setMovieRuntime(userPickMovie.getUserpickMovieRuntime());

    // 3. 게시글 리뷰 첨부파일 조회
    List<BoardReviewFile> boardReviewFiles = boardReviewFileDao.selectBoardReviewFile(boardReviewNo);
    boardReview.setBoardReviewFiles(boardReviewFiles);

    // 4. 게시글 좋아요 수 조회
    int likeCount = boardLikeDao.selectBoardReviewLikeCount(boardReviewNo);
    boardReview.setLikeCount(likeCount);

    // 5. 내가 좋아요 눌렀는지 체크 조회
    int isLiked = boardLikeDao.checkBoardReviewLike(boardReviewNo, boardReview.getBoardReviewMemberId());
    boardReview.setLiked(isLiked > 0);

    // 6. 댓글 목록
    List<CommentTbl> boardComments = commentDao.selectCommentList("board", boardReviewNo);
    boardReview.setBoardComments(boardComments);

    // 7. 회원 프로필 이미지 조회
    String memberProfileImg = memberDao.selectMemberProfileImg(boardReview.getBoardReviewMemberId());
    boardReview.setProfilePath(memberProfileImg);

    // 8. 조회수 증가
    boardReviewDao.updateBoardReviewViewCount(boardReviewNo);


    return boardReview;
}

    public BoardReviewFile selectBoardReviewFileByNo(int boardFileNo) {
        return boardReviewFileDao.selectBoardReviewFileByNo(boardFileNo);
    }

    @Transactional
    public int insertBoardReviewLike(int boardReviewNo, String memberId){
 
        // 1. 해당 게시글에 좋아요를 눌렀는가?
        int isLiked = boardLikeDao.checkBoardReviewLike(boardReviewNo, memberId);


        if(isLiked == 0){
            // 2. 좋아요 추가
            int result = boardLikeDao.insertBoardReviewLike(boardReviewNo, memberId);
            if(result > 0){
       
                return 1;
            }else{
       
                return 0;
            }
        }else{
            // 3. 좋아요 취소
            int result = boardLikeDao.deleteBoardReviewLike(boardReviewNo, memberId);
            if(result > 0){
            
                return 1;
            }else{
            
                return 0;
            }
        }
    }

    @Transactional
    public List<BoardReviewFile> selectBoardReviewFileList(int boardReviewNo){
        List<BoardReviewFile> fileList = boardReviewFileDao.selectBoardReviewFile(boardReviewNo);
        int result = boardReviewDao.deleteBoardReview(boardReviewNo);
        if(result > 0){
            return fileList;
        }else{
            return null;
        }
    }

    @Transactional
    public List<BoardReviewFile> updateBoardReview(BoardReview boardReview, ArrayList<BoardReviewFile> fileList){
        List<BoardReviewFile> delFileList = new ArrayList<BoardReviewFile>();
        int result = 0;
        int delFileCount = 0;

        // 삭제한 파일이 있으면 파일정보를 조회하고, db에서 정보 삭제
        if(boardReview.getDelFileNo() != null){
            delFileCount = boardReview.getDelFileNo().length;
            delFileList = boardReviewFileDao.selectBoardReviewFileByNoList(boardReview.getDelFileNo());
            result += boardReviewFileDao.deleteBoardReviewFile(boardReview.getDelFileNo());
        }
        // 추가한 파일이 있으면 db에 추가
        for(BoardReviewFile file : fileList){
            result += boardReviewFileDao.insertBoardReviewFile(file);
        }

        // 게시글 리뷰 정보 수정
        result += boardReviewDao.updateBoardReview(boardReview);

        if(result == 1+fileList.size()+delFileCount){
            return delFileList;
        }else{
            return null;
        }
    }
}
