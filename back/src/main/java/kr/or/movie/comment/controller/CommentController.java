package kr.or.movie.comment.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import kr.or.movie.ResponseDTO;
import kr.or.movie.comment.model.dto.CommentTbl;
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

    @GetMapping("/list/{commentType}/{targetNo}")
    @Operation(summary = "댓글 목록 조회", description = "댓글 타입과 대상 번호로 댓글 목록 조회")
    public ResponseEntity<ResponseDTO> commentList(@PathVariable String commentType, @PathVariable int targetNo) {
        Map<String, Object> map = new HashMap<>();
        map = commentService.selectCommentList(commentType, targetNo);

        return new ResponseEntity<>(new ResponseDTO(200, HttpStatus.OK, "success", map), HttpStatus.OK);
    }

    @PostMapping("/write")
    @Operation(summary = "댓글 작성", description = "댓글 타입과 대상 번호로 댓글 작성")
    public ResponseEntity<ResponseDTO> writeComment(@RequestBody CommentTbl commentTbl, @RequestAttribute String memberId) {
        System.out.println(commentTbl.getCommentType());
        commentTbl.setCommentMemberId(memberId);
        System.out.println(commentTbl);
        int result = commentService.insertComment(commentTbl);

        if(result > 0) {
            return new ResponseEntity<>(new ResponseDTO(200, HttpStatus.OK, "success", null), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(new ResponseDTO(200, HttpStatus.OK, "fail", null), HttpStatus.OK);
        }
    }

    @PutMapping()
    @Operation(summary = "댓글 수정", description = "댓글 번호로 댓글 수정")
    public ResponseEntity<ResponseDTO> updateComment(@RequestBody CommentTbl commentTbl) {
        int result = commentService.updateComment(commentTbl);
        if(result > 0) {
            return new ResponseEntity<>(new ResponseDTO(200, HttpStatus.OK, "success", null), HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(new ResponseDTO(200, HttpStatus.OK, "fail", null), HttpStatus.OK);
        }
    }

    @DeleteMapping("/{commentNo}")
    @Operation(summary = "댓글 삭제", description = "댓글 번호로 댓글 삭제")
    public ResponseEntity<ResponseDTO> deleteComment(@PathVariable int commentNo) {
        CommentTbl commentTbl = new CommentTbl();
        commentTbl.setCommentNo(commentNo);
        
    	int result = commentService.deleteComment(commentTbl);
        if(result > 0) {
            return new ResponseEntity<>(new ResponseDTO(200, HttpStatus.OK, "success", null), HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(new ResponseDTO(200, HttpStatus.OK, "fail", null), HttpStatus.OK);
        }
    }


}

