package kr.or.movie.comment.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.comment.model.dao.CommentDao;

@Service
public class CommentService {
    @Autowired
    private CommentDao commentDao;

}

