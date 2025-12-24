package kr.or.movie.boardReview.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.boardReview.model.dao.BoardReviewDao;

@Service
public class BoardReviewService {
    @Autowired
    private BoardReviewDao boardReviewDao;

}
