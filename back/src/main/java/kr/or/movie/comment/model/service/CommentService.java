package kr.or.movie.comment.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.comment.model.dao.CommentDao;
import kr.or.movie.comment.model.dto.CommentTbl;

@Service
public class CommentService {
    @Autowired
    private CommentDao commentDao;

    public Map<String, Object> selectCommentList(String commentType, int targetNo) {

        Map<String, Object> map = new HashMap<>();
        // 1. 댓글 목록 조회
        List commentList = commentDao.selectCommentList(commentType, targetNo);
        // 2. 대댓글 목록 조회
        List reCommentList = commentDao.selectReCommentList(commentType, targetNo);
        
        map.put("commentList", commentList);
        map.put("reCommentList", reCommentList);
        return map;
    }

    @Transactional
    public int insertComment(CommentTbl commentTbl) {
        return commentDao.insertComment(commentTbl);
    }

    @Transactional
    public int updateComment(CommentTbl commentTbl) {
        return commentDao.updateComment(commentTbl);
    }

    @Transactional
    public int deleteComment(CommentTbl commentTbl) {
         return commentDao.deleteComment(commentTbl);
   }

}

