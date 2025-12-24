package kr.or.movie.simepleReview.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestAttribute;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;

import kr.or.movie.ResponseDTO;
import kr.or.movie.simepleReview.model.service.SimpleReviewService;
import kr.or.movie.simepleReview.model.dto.SimpleReview;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/simple/review")
@CrossOrigin("*")
@Tag(name = "심플 리뷰 관리", description = "심플 리뷰 관리 API")
public class SimpleReviewController {

    @Autowired
    private SimpleReviewService simpleReviewService;

    @PostMapping("")
    @Operation(summary = "심플 리뷰 작성", description = "심플 리뷰 작성")
    public ResponseEntity<ResponseDTO> insertSimpleReview(
        @RequestBody SimpleReview simpleReview,
        @RequestAttribute String memberId
    ) {
        simpleReview.setSimpleReviewMemberId(memberId);
        int result = simpleReviewService.insertSimpleReview(simpleReview);

        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/check/{movieId}")
    @Operation(summary = "리뷰 작성 여부 확인", description = "해당 영화에 대한 리뷰 작성 여부 확인")
    public ResponseEntity<ResponseDTO> checkReview(
        @PathVariable int movieId,
        @RequestAttribute String memberId
    ) {
        boolean hasReview = simpleReviewService.checkHasReview(movieId, memberId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("hasReview", hasReview);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", result);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}

