package kr.or.movie.comment.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;

import kr.or.movie.ResponseDTO;
import kr.or.movie.comment.model.service.CommentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/comment")
@CrossOrigin("*")
@Tag(name = "댓글 관리", description = "댓글 관리 API")
public class CommentController {

    @Autowired
    private CommentService commentService;

}

