package kr.or.movie.boardReview.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import kr.or.movie.ResponseDTO;
import kr.or.movie.boardReview.model.dto.BoardReview;
import kr.or.movie.boardReview.model.dto.BoardReviewFile;
import kr.or.movie.boardReview.model.service.BoardReviewService;
import kr.or.movie.util.FileUtils;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/board/review")
@CrossOrigin("*")
@Tag(name = "게시글 리뷰 관리", description = "게시글 리뷰 관리 API")
public class BoardReviewController {

    @Autowired
    private BoardReviewService boardReviewService;

    @Value("${file.root}")
    private String root;

    @Autowired
    private FileUtils fileUtils;

    @PostMapping("/editor")
    @Operation(summary = "게시글 리뷰 에디터", description = "게시글 리뷰 에디터")
    public ResponseEntity<ResponseDTO> editorUpload(@ModelAttribute MultipartFile image){
        String savepath = root + "/board/editor/";
        String filepath = fileUtils.upload(savepath, image);
        String returnPath = "/board/editor/" + filepath;

        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", returnPath);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/write")
    @Operation(summary = "게시글 리뷰 작성", description = "게시글 리뷰 작성")
    public ResponseEntity<ResponseDTO> write
(@ModelAttribute BoardReview boardReview, 
    @ModelAttribute MultipartFile[] boardReviewFile, 
    @RequestParam(required = false) String[] boardReviewGenreIds,
    @RequestParam(required = false) String[] boardReviewGenreNames,
    @RequestAttribute String memberId) {

        boardReview.setBoardReviewMemberId(memberId);

        String savepath = root + "/board/review/";
        
        ArrayList<BoardReviewFile> fileList = new ArrayList<BoardReviewFile>();
        if(boardReviewFile != null) {
            for(MultipartFile file : boardReviewFile) {
                String filename = file.getOriginalFilename();
                String filepath = fileUtils.upload(savepath, file);
                BoardReviewFile bf = new BoardReviewFile();
                bf.setBoardFilename(filename);
                bf.setBoardFilepath(filepath);
                fileList.add(bf);
            }
        }
        
        int result = boardReviewService.insertBoardReview(boardReview, boardReviewGenreIds, boardReviewGenreNames, fileList);
        
        if(result > 0){
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", boardReview.getBoardReviewNo());
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
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
        int result = boardReviewService.checkReview(movieId, memberId);

        
        if(result > 0){ // 실패
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else { // 성공
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/list/{reqPage}")
    @Operation(summary = "게시글 리뷰 리스트 조회", description = "게시글 리뷰 리스트 조회")
    public ResponseEntity<ResponseDTO> list(@PathVariable int reqPage){
        Map map = boardReviewService.selectBoardReviewList(reqPage);
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/search")
    @Operation(summary = "게시글 리뷰 검색", description = "게시글 리뷰 검색 (영화 제목/장르/리뷰 제목)")
    public ResponseEntity<ResponseDTO> search(
        @RequestParam String searchType,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String genreId,
        @RequestParam int reqPage
    ){
        Map map = boardReviewService.searchBoardReviewList(searchType, keyword, genreId, reqPage);
        ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/view/{boardReviewNo}")
    @Operation(summary = "게시글 리뷰 상세 조회", description = "게시글 리뷰 상세 조회")
    public ResponseEntity<ResponseDTO> view(@PathVariable int boardReviewNo){
        BoardReview boardReview = boardReviewService.selectBoardReviewByNo(boardReviewNo);
        
        if(boardReview == null){
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", boardReview);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/file/{boardFileNo}")
    @Operation(summary = "게시글 리뷰 첨부파일 다운로드", description = "게시글 리뷰 첨부파일 다운로드")
    public ResponseEntity<Resource> fileDownload(@PathVariable int boardFileNo) throws FileNotFoundException {
        BoardReviewFile boardReviewFile = boardReviewService.selectBoardReviewFileByNo(boardFileNo);
        String savepath = root + "/board/review/";
        File file = new File(savepath + boardReviewFile.getBoardFilepath());
        Resource resource = new InputStreamResource(new FileInputStream(file));
		
		//파일 다운로드 헤더 설정
		HttpHeaders header = new HttpHeaders();
		header.add("Content-Disposition","attachment; filename=\""+boardReviewFile.getBoardFilename()+"\"");
		header.add("Cache-Control","no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expires", "0");
		
		return ResponseEntity
				.status(HttpStatus.OK)
				.headers(header)
				.contentLength(file.length())
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.body(resource);
    }

    @PostMapping("/like/{boardReviewNo}")
    @Operation(summary = "게시글 리뷰 좋아요 추가", description = "게시글 리뷰 좋아요 추가")
    public ResponseEntity<ResponseDTO> like(@PathVariable int boardReviewNo, @RequestAttribute String memberId){
        int result = boardReviewService.insertBoardReviewLike(boardReviewNo, memberId);
        
        System.out.println("result = " + result);

        if(result > 0){
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @DeleteMapping("/{boardReviewNo}")
    @Operation(summary = "게시글 리뷰 삭제", description = "게시글 리뷰 삭제")
    public ResponseEntity<ResponseDTO> delete(@PathVariable int boardReviewNo){
        List<BoardReviewFile> fileList = boardReviewService.selectBoardReviewFileList(boardReviewNo);

        if(fileList != null){
            String savepath = root + "/board/review/";
            for(BoardReviewFile file : fileList){
                File delFile = new File(savepath + file.getBoardFilepath());
                delFile.delete();
            }
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
       
    }

    @PatchMapping()
    @Operation(summary = "게시글 리뷰 수정", description = "게시글 리뷰 수정")
    public ResponseEntity<ResponseDTO> modify(
        @ModelAttribute BoardReview boardReview, 
        @ModelAttribute MultipartFile[] boardReviewFile){
        String savepath = root + "/board/review/";

        // 1. 추가 첨부파일 작업
        ArrayList<BoardReviewFile> fileList = new ArrayList<BoardReviewFile>();
        if(boardReviewFile != null) {
            for(MultipartFile file : boardReviewFile) {
                String filename = file.getOriginalFilename();
                String filepath = fileUtils.upload(savepath, file);
                BoardReviewFile bf = new BoardReviewFile();
                bf.setBoardFilename(filename);
                bf.setBoardFilepath(filepath);
                bf.setBoardFileReviewNo(boardReview.getBoardReviewNo());
                fileList.add(bf);
            }
        }
        
        // 2. 서비스 메서드를 호출하여 게시글을 업데이트하고 삭제할 파일목록을 가져옴
        List<BoardReviewFile> delFileList = boardReviewService.updateBoardReview(boardReview, fileList);

        // 3. 삭제할 파일 목록이 존재하는 경우
        if(delFileList != null){
            for(BoardReviewFile file : delFileList){
                File delFile = new File(savepath + file.getBoardFilepath());
                delFile.delete();
            }
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/list/by-movie/{movieId}")
    @Operation(summary = "영화에 대한 게시글 리뷰 리스트 조회", description = "영화에 대한 게시글 리뷰 리스트 조회")
    public ResponseEntity<ResponseDTO> listByMovie(@PathVariable int movieId){
        List<BoardReview> boardReviewList = boardReviewService.selectBoardReviewListByMovieId(movieId);

        if(boardReviewList != null){
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", boardReviewList);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
       
    }
}
