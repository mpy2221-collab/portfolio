import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import SideMenu from "../../component/SideMenu";
import AdminMember from "./AdminMember";
import AdminSimpleReview from "./AdminSimpleReview";
import AdminBoardReview from "./AdminBoardReview";
import AdminUserPick from "./AdminUserPick";
import "./admin.css";

const AdminMain = (props) => {
  const isLogin = props.isLogin;
  const navigate = useNavigate();
  const location = useLocation();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  const [member, setMember] = useState({});
  const [menus] = useState([
    { url: "member", text: "회원 관리" },
    { url: "simple-review", text: "심플 리뷰 관리" },
    { url: "board-review", text: "게시글 리뷰 관리" },
    { url: "user-pick", text: "유저픽 영화 관리" },
  ]);

  // 회원 정보 조회 및 관리자 권한 확인
  useEffect(() => {
    if (isLogin) {
      axios
        .get(backServer + "/member")
        .then((res) => {
          if (res.data.message === "success") {
            const memberData = res.data.data;
            setMember(memberData);
            
            // 관리자 권한 확인 (member_type == 1)
            if (memberData.memberType !== 1) {
              Swal.fire({
                title: "접근 권한이 없습니다.",
                text: "관리자만 접근할 수 있습니다.",
                icon: "warning",
                confirmButtonText: "확인",
              }).then(() => {
                navigate("/");
              });
            }
          }
        })
        .catch((err) => {
          console.error("회원 정보 조회 실패:", err);
        });
    }
  }, [isLogin, navigate, backServer]);

  // 관리자페이지에 처음 접근 시 /admin/member로 리다이렉트
  useEffect(() => {
    if (isLogin && member.memberType === 1) {
      if (location.pathname === "/admin" || location.pathname === "/admin/") {
        navigate("/admin/member", { replace: true });
      }
    }
  }, [isLogin, member.memberType, location.pathname, navigate]);

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

  // 관리자 권한이 아닌 경우 (아직 권한 확인 중이거나 권한이 없음)
  if (member.memberType !== 1) {
    return null;
  }

  return (
    <div className="admin-wrap">
      {/* 사이드 메뉴 */}
      <SideMenu menus={menus} basePath="/admin" title="관리자페이지"></SideMenu>

      {/* 메인 컨텐츠 영역 */}
      <div className="admin-container">
        <div className="admin-header"></div>
        <div className="admin-content">
          <Routes>
            <Route path="/member" element={<AdminMember />} />
            <Route path="/simple-review" element={<AdminSimpleReview />} />
            <Route path="/board-review" element={<AdminBoardReview />} />
            <Route path="/user-pick" element={<AdminUserPick />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;

