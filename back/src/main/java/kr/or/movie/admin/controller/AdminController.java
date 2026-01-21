package kr.or.movie.admin.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import io.swagger.v3.oas.annotations.Operation;
import kr.or.movie.ResponseDTO;
import kr.or.movie.member.model.dto.Member;
import java.util.HashMap;
import java.util.Map;

import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.movie.admin.model.service.AdminService;
@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
@Tag(name = "관리자", description = "관리자 API")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/member/list/{reqPage}")
    @Operation(summary = "회원 목록 조회", description = "회원 목록 조회")
    public ResponseEntity<ResponseDTO> getMemberList(@PathVariable int reqPage) {
        Map<String, Object> map = adminService.getMemberList(reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/member/search")
    @Operation(summary = "회원 검색", description = "검색 타입과 키워드로 회원 검색")
    public ResponseEntity<ResponseDTO> searchMemberList(
        @RequestParam String searchType,
        @RequestParam String keyword,
        @RequestParam int reqPage
    ) {
        Map<String, Object> map = adminService.searchMemberList(searchType, keyword, reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/member/type")
    @Operation(summary = "회원 유형 변경", description = "회원 유형 변경")
    public ResponseEntity<ResponseDTO> updateMemberType(@RequestBody Member member) {
        int result = adminService.updateMemberType(member);
        
        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @DeleteMapping("/member/{memberId}")
    @Operation(summary = "회원 삭제", description = "회원 삭제")
    public ResponseEntity<ResponseDTO> deleteMember(@PathVariable String memberId) {
        // admin 계정은 삭제 불가
        if ("admin".equals(memberId)) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        int result = adminService.deleteMember(memberId);
        
        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/simple-review/statistics/all")
    @Operation(summary = "전체 심플 리뷰 통계 조회", description = "전체 유저의 심플 리뷰 통계 조회")
    public ResponseEntity<ResponseDTO> getAllSimpleReviewStatistics() {
        Map<String, Object> statistics = adminService.getAllSimpleReviewStatistics();
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", statistics);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/simple-review/statistics/user")
    @Operation(summary = "특정 유저 심플 리뷰 통계 조회", description = "아이디 또는 닉네임으로 특정 유저의 심플 리뷰 통계 조회")
    public ResponseEntity<ResponseDTO> getUserSimpleReviewStatistics(
        @RequestParam String keyword
    ) {
        Map<String, Object> result = adminService.getUserSimpleReviewStatistics(keyword);
        
        String message = (String) result.get("message");
        if ("not_found".equals(message)) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not_found", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            // statistics와 memberId를 포함한 Map 생성
            Map<String, Object> data = new HashMap<>();
            data.put("statistics", result.get("statistics"));
            data.put("memberId", result.get("memberId"));
            
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", data);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/simple-review/list/{reqPage}")
    @Operation(summary = "전체 심플 리뷰 목록 조회", description = "전체 유저의 심플 리뷰 목록 조회")
    public ResponseEntity<ResponseDTO> getAllSimpleReviewList(@PathVariable int reqPage) {
        Map<String, Object> map = adminService.getAllSimpleReviewList(reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/simple-review/search")
    @Operation(summary = "심플 리뷰 검색", description = "검색 타입과 키워드로 심플 리뷰 검색")
    public ResponseEntity<ResponseDTO> searchAllSimpleReviewList(
        @RequestParam String searchType,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String genreId,
        @RequestParam int reqPage
    ) {
        Map<String, Object> map = adminService.searchAllSimpleReviewList(searchType, keyword, genreId, reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/simple-review/{simpleReviewNo}")
    @Operation(summary = "심플 리뷰 삭제", description = "심플 리뷰 삭제")
    public ResponseEntity<ResponseDTO> deleteSimpleReview(@PathVariable int simpleReviewNo) {
        int result = adminService.deleteSimpleReview(simpleReviewNo);
        
        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/board-review/statistics/all")
    @Operation(summary = "전체 게시글 리뷰 통계 조회", description = "전체 유저의 게시글 리뷰 통계 조회")
    public ResponseEntity<ResponseDTO> getAllBoardReviewStatistics() {
        Map<String, Object> statistics = adminService.getAllBoardReviewStatistics();
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", statistics);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/board-review/list/{reqPage}")
    @Operation(summary = "전체 게시글 리뷰 목록 조회", description = "전체 게시글 리뷰 목록 조회 (페이지네이션)")
    public ResponseEntity<ResponseDTO> getAllBoardReviewList(@PathVariable int reqPage) {
        Map<String, Object> map = adminService.getAllBoardReviewList(reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/board-review/search")
    @Operation(summary = "전체 게시글 리뷰 검색", description = "검색 타입과 키워드로 전체 게시글 리뷰 검색")
    public ResponseEntity<ResponseDTO> searchAllBoardReviewList(
        @RequestParam String searchType,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String genreId,
        @RequestParam int reqPage
    ) {
        Map<String, Object> map = adminService.searchAllBoardReviewList(searchType, keyword, genreId, reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/board-review/statistics/user")
    @Operation(summary = "특정 유저 게시글 리뷰 통계 조회", description = "유저 아이디 또는 닉네임으로 게시글 리뷰 통계 조회")
    public ResponseEntity<ResponseDTO> getUserBoardReviewStatistics(@RequestParam String keyword) {
        Map<String, Object> result = adminService.getUserBoardReviewStatistics(keyword);
        
        if ("not_found".equals(result.get("message"))) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not_found", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        
        // statistics와 memberId를 포함한 Map 생성
        Map<String, Object> data = new HashMap<>();
        data.put("statistics", result.get("statistics"));
        data.put("memberId", result.get("memberId"));
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", data);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/board-review/{boardReviewNo}")
    @Operation(summary = "게시글 리뷰 삭제", description = "게시글 리뷰 삭제")
    public ResponseEntity<ResponseDTO> deleteBoardReview(@PathVariable int boardReviewNo) {
        int result = adminService.deleteBoardReview(boardReviewNo);
        
        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/user-pick/statistics")
    @Operation(summary = "전체 유저픽 영화 통계 조회", description = "전체 유저픽 영화 통계 조회")
    public ResponseEntity<ResponseDTO> getAllUserPickMovieStatistics() {
        Map<String, Object> statistics = adminService.getAllUserPickMovieStatistics();
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", statistics);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user-pick/list/{reqPage}")
    @Operation(summary = "전체 유저픽 영화 목록 조회", description = "전체 유저픽 영화 목록 조회 (페이지네이션)")
    public ResponseEntity<ResponseDTO> getAllUserPickMovieList(@PathVariable int reqPage) {
        Map<String, Object> map = adminService.getAllUserPickMovieList(reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user-pick/search")
    @Operation(summary = "전체 유저픽 영화 검색", description = "검색 타입과 키워드로 전체 유저픽 영화 검색")
    public ResponseEntity<ResponseDTO> searchAllUserPickMovieList(
        @RequestParam String searchType,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String genreId,
        @RequestParam(required = false) String status,
        @RequestParam int reqPage
    ) {
        Map<String, Object> map = adminService.searchAllUserPickMovieList(searchType, keyword, genreId, status, reqPage);
        
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/user-pick/status")
    @Operation(summary = "유저픽 영화 상태 변경", description = "유저픽 영화의 상태를 변경 (1: 활성, 2: 비활성)")
    public ResponseEntity<ResponseDTO> updateUserPickMovieStatus(@RequestBody Map<String, Object> request) {
        int movieNo = (Integer) request.get("movieNo");
        int status = (Integer) request.get("status");
        
        int result = adminService.updateUserPickMovieStatus(movieNo, status);
        
        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @DeleteMapping("/user-pick/{movieNo}")
    @Operation(summary = "유저픽 영화 삭제", description = "유저픽 영화 삭제")
    public ResponseEntity<ResponseDTO> deleteUserPickMovie(@PathVariable int movieNo) {
        int result = adminService.deleteUserPickMovie(movieNo);
        
        if(result > 0) {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

}
