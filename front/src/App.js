import Header from "./page/common/Header";
import Main from "./page/common/Main";
import Footer from "./page/common/Footer";
import { Routes, Route } from "react-router-dom";
import Join from "./page/member/Join";
import Login from "./page/member/Login";
import FindId from "./page/member/FindId";
import FindPw from "./page/member/FindPw";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import MemberMain from "./page/member/MemberMain";

function App() {
  //스토리지에 저장된 데이터를 꺼내서 객체형식으로 변환
  const obj = JSON.parse(window.localStorage.getItem("member"));
  //console.log(obj);
  const [isLogin, setIsLogin] = useState(obj ? true : false); //로그인 상태를 체크하는 state
  const [token, setToken] = useState(obj ? obj.accessToken : ""); //토큰값
  const [expiredTime, setExpiredTime] = useState(
    obj ? new Date(obj.expiredTime) : ""
  ); //만료시간

  if (obj) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  const login = (accessToken) => {
    //로그인 성공 시 받은 accessToken을 token state에 저장
    setToken(accessToken);
    //로그인 성공한 순간을 기준으로 1시간 뒤에 만료시간임 -> 그 데이터를 저장
    const tokenExpired = new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpiredTime(tokenExpired);
    //토큰이랑, 만료시간을 객체로 묶은 후 문나열로 변환해서 localStorage에 저장
    const obj = { accessToken, expiredTime: tokenExpired.toISOString() };
    //localStorage에는 문자열만 저장이 가능하므로 묶은 객체도 문자열로 변환
    const member = JSON.stringify(obj); //"{a:100,b:200}"처럼 만드는 함수
    //로컬스토리지에 데이터 저장
    window.localStorage.setItem("member", member);

    //axios헤더에 토큰값 자동설정
    axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
    setIsLogin(true);

    const remainingTime = tokenExpired.getTime() - new Date().getTime();
    setTimeout(logout, remainingTime);
  };

  const logout = () => {
    //로그아웃 시 localStorage에서 토큰값 삭제
    setToken("");
    setExpiredTime("");
    window.localStorage.removeItem("member");
    axios.defaults.headers.common["Authorization"] = null;
    setIsLogin(false);
  };

  //페이지가 로드되면, 새로고침되면
  useEffect(() => {
    //console.log(isLogin);
    if (isLogin) {
      //로그인 되어있으면
      //저장해 둔 만료시간을 꺼내서 현재시간과 비교한 후 종료함수 설정
      const remainingTime = expiredTime.getTime() - new Date().getTime();
      //console.log(remainingTime);
      setTimeout(logout, remainingTime);
    }
  }, []);

  return (
    <div className="wrap">
      <Header isLogin={isLogin} logoutFunction={logout} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login loginFunction={login} />} />
          <Route path="/find-id" element={<FindId />} />
          <Route path="/find-pw" element={<FindPw />} />
          <Route path="/member/*" element={<MemberMain isLogin={isLogin} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
