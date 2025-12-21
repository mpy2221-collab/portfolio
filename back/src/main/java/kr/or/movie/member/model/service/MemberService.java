package kr.or.movie.member.model.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import kr.or.movie.member.model.dao.MemberDao;

@Service
public class MemberService {
    @Autowired
    private MemberDao memberDao;
}
