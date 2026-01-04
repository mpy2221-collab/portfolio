import './board.css';
import { Routes, Route } from 'react-router-dom';   
import PopularMain from './popular/PopularMain';
import UserPickMain from './userPick/UserPickMain';
import ReviewMain from './review/ReviewMain';
import ReviewModify from './review/ReviewModify';
import { useState } from 'react';
import axios from 'axios';


const BoardMain = (props) => {
    const isLogin = props.isLogin;
    const backServer = process.env.REACT_APP_BACK_SERVER;
    const [memberId, setMemberId] = useState("");

    if(isLogin){
        // 로그인이 된 경우 아이디 얻어오기
        axios.get(backServer + "/member/id")
        .then((res)=>{
            if(res.data.message === "success"){
                setMemberId(res.data.data);
                // console.log(res.data.data);
            }
        })
        .catch((err)=>{
            console.error("아이디 얻어오기 실패:", err);
        });
    }

    return(
        <>
            <Routes>
                <Route path="/popular/*" element={<PopularMain isLogin={isLogin} />} />
                <Route path="/user-pick/*" element={<UserPickMain />} />
                <Route path="/review/*" element={<ReviewMain isLogin={isLogin} memberId={memberId} />} />
                <Route path="/review/modify/:boardReviewNo/:boardReviewTmdbMovieId" element={<ReviewModify />} />
            </Routes>
        </>
    )
}

export default BoardMain;