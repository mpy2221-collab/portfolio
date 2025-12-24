package kr.or.movie.userPick.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;

import kr.or.movie.ResponseDTO;
import kr.or.movie.userPick.model.service.UserPickService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/board/user-pick")
@CrossOrigin("*")
@Tag(name = "유저픽 영화 관리", description = "유저픽 영화 관리 API")
public class UserPickController {

    @Autowired
    private UserPickService userPickService;

}

