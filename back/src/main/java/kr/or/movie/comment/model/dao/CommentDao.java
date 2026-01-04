package kr.or.movie.comment.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import kr.or.movie.comment.model.dto.CommentTbl;

@Mapper
public interface CommentDao {
    public List<CommentTbl> selectCommentList(String commentType, int targetNo);
    public List<CommentTbl> selectReCommentList(String commentType, int targetNo);
    public int insertComment(CommentTbl commentTbl);
    public int updateComment(CommentTbl commentTbl);
    public int deleteComment(CommentTbl commentTbl);
}
