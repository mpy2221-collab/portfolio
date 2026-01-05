package kr.or.movie.userPick.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import kr.or.movie.ResponseDTO;
import kr.or.movie.userPick.model.service.UserPickService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("/board/user-pick")
@CrossOrigin("*")
@Tag(name = "유저픽 영화 관리", description = "유저픽 영화 관리 API")
public class UserPickController {

    @Autowired
    private UserPickService userPickService;

    @Operation(summary = "유저픽 영화 목록 조회", description = "유저픽 영화 목록 조회")
    @GetMapping("/list/{reqPage}")
    public ResponseEntity<ResponseDTO> getUserPickList(@PathVariable int reqPage) {
        Map map = userPickService.selectUserPickList(reqPage);

        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);




    }

    @Operation(summary = "유저픽 영화 검색", description = "유저픽 영화 검색")
    @GetMapping("/search")
    public ResponseEntity<ResponseDTO> searchUserPickList(
            @RequestParam String searchType, 
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String genreId,
            @RequestParam int reqPage) {
        Map map = userPickService.searchUserPickList(searchType, keyword, genreId, reqPage);

        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "유저픽 영화 상세 조회", description = "유저픽 영화 상세 조회")
    @GetMapping("/view/{tmdbMovieId}")
    public ResponseEntity<ResponseDTO> selectUserPickView(@PathVariable int tmdbMovieId) {
        Map map = userPickService.selectUserPickView(tmdbMovieId);

        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}

