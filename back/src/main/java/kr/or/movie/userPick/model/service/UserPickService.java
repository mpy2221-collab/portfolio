package kr.or.movie.userPick.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.userPick.model.dao.UserPickMovieDao;
import kr.or.movie.userPick.model.dao.UserPickMovieGenreDao;

@Service
public class UserPickService {
    @Autowired
    private UserPickMovieDao userPickMovieDao;
    @Autowired
    private UserPickMovieGenreDao userPickMovieGenreDao;

}

