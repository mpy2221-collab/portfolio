package kr.or.movie.api.controller;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.api.model.service.ApiService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import kr.or.movie.ResponseDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@Tag(name = "API 관리", description = "API 관리 API")
public class ApiController {
    @Autowired
    private ApiService apiService;

    @GetMapping("/popular/{reqPage}")
    public ResponseEntity<ResponseDTO> getPopular(@PathVariable int reqPage) {
        Map map = apiService.selectPopularList(reqPage);

        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    // ApiController.java
    @GetMapping("/popular/search")
    public ResponseEntity<ResponseDTO> searchPopular(
        @RequestParam(required = false) String searchType,  // "title" 또는 "genre"
        @RequestParam(required = false) String keyword,      // 검색어 (제목)
        @RequestParam(required = false) String genreId,      // 장르 ID
        @RequestParam int reqPage
    ) {
        Map map = apiService.searchPopularList(searchType, keyword, genreId, reqPage);
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/popular/view/{movieId}")
    public ResponseEntity<ResponseDTO> getPopularMovie(@PathVariable int movieId) {
        Map map = apiService.selectPopularMovie(movieId);

        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/movie/search")
    public ResponseEntity<ResponseDTO> searchMovie(
        @RequestParam String keyword
    ) {
        Map map = apiService.searchMovie(keyword);
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

   
}
