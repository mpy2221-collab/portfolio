package kr.or.movie.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.movie.ResponseDTO;
import kr.or.movie.main.model.service.MainService;
import kr.or.movie.boardReview.model.dto.BoardReview;
import kr.or.movie.userPick.model.dto.UserPickMovie;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/main")
@CrossOrigin("*")
@Tag(name = "메인 페이지", description = "메인 페이지 API")
public class MainController {

    @Autowired
    private MainService mainService;

    @GetMapping("/popular/top5")
    @Operation(summary = "인기 영화 TOP 5 조회", description = "TMDB 인기 영화 상위 5개 조회")
    public ResponseEntity<ResponseDTO> getPopularTop5() {
        List<Map<String, Object>> popularMovies = mainService.getPopularTop5();
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", popularMovies);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user-pick/top5")
    @Operation(summary = "인기 유저픽 영화 TOP 5 조회", description = "유저 평점 기준 유저픽 영화 상위 5개 조회")
    public ResponseEntity<ResponseDTO> getUserPickTop5() {
        List<UserPickMovie> userPickMovies = mainService.getUserPickTop5();
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", userPickMovies);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/recent-reviews")
    @Operation(summary = "최근 리뷰 게시글 조회", description = "최근 작성된 게시글 리뷰 5개 조회")
    public ResponseEntity<ResponseDTO> getRecentReviews() {
        List<BoardReview> recentReviews = mainService.getRecentReviews();
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", recentReviews);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

