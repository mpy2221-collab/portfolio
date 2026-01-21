import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import MemberInfo from "./MemberInfo";
import MemberPw from "./MemberPw";
import MemberSimpleReview from "./MemberSimpleReview";
import MemberBoardReview from "./MemberBoardReview";
import { Routes, Route } from "react-router-dom";
import SideMenu from "../../component/SideMenu";
import "./member.css";

const MemberMain = (props) => {
  const isLogin = props.isLogin;
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const logoutFunction = props.logoutFunction;

  const [member, setMember] = useState({});
  const [menus] = useState([
    { url: "info", text: "내 정보" },
    { url: "pw", text: "비밀번호 변경" },
    { url: "simple-review", text: "심플 리뷰" },
    { url: "board-review", text: "게시글 리뷰" },
  ]);

  // 회원 정보 조회
  useEffect(() => {
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          if (res.data.message == "success") {
            setMember(res.data.data);
            console.log(res.data.data);
          }
        })
        .catch((err) => {
          console.error("회원 정보 조회 실패:", err);
        });
    }
  }, []);

  if (!isLogin) {
    Swal.fire({
      title: "로그인 필요한 서비스입니다.",
      text: "로그인 후 이용해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    }).then(() => {
      navigate("/login");
    });
    return null;
  }

  return (
    <div className="mypage-wrap">
      {/* 사이드 메뉴 */}
      <SideMenu menus={menus} basePath="/member" title="마이페이지"></SideMenu>

      {/* 메인 컨텐츠 영역 */}
      <div className="mypage-container">
        <div className="mypage-header"></div>
        <div className="mypage-content">
          <Routes>
            <Route path="/info" element={<MemberInfo member={member} setMember={setMember} />} />
            <Route path="/pw" element={<MemberPw />} />
            <Route path="/simple-review" element={<MemberSimpleReview />} />
            <Route path="/board-review" element={<MemberBoardReview />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MemberMain;
