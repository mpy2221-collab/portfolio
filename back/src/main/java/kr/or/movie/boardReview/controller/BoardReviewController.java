package kr.or.movie.boardReview.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;

import kr.or.movie.ResponseDTO;
import kr.or.movie.boardReview.model.service.BoardReviewService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/board/review")
@CrossOrigin("*")
@Tag(name = "게시글 리뷰 관리", description = "게시글 리뷰 관리 API")
public class BoardReviewController {

    @Autowired
    private BoardReviewService boardReviewService;

}
