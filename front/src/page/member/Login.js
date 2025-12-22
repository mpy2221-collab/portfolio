import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./member.css";
import { Input, Button } from "../../component/FormFrm";

const Login = (props) => {
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const loginFunction = props.loginFunction;

  const login = () => {
    if (memberId !== "" && memberPw !== "") {
      const obj = {
        memberId: memberId,
        memberPw: memberPw,
      };
      axios
        .post(backServer + "/member/login", obj)
        .then((res) => {
          if (res.data.message === "success") {
            // window.localStorage.setItem("token", res.data.data);
            // setIsLogin(true);
            loginFunction(res.data.data);
            navigate("/");
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "로그인 실패",
            text: "서버 오류가 발생했습니다.",
            icon: "error",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
        });
    }
  };

  // Enter 키로 로그인
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">로그인</h1>
          <p className="login-subtitle">
            영화 추천 사이트에 오신 것을 환영합니다
          </p>
        </div>
        <div className="login-content">
          <div className="login-section">
            <div>
              <LoginInputWrap
                label="아이디"
                content="memberId"
                type="text"
                data={memberId}
                setData={setMemberId}
                placeholder="아이디를 입력해주세요."
                onKeyPress={handleKeyPress}
              />
              <LoginInputWrap
                label="비밀번호"
                content="memberPw"
                type="password"
                data={memberPw}
                setData={setMemberPw}
                placeholder="비밀번호를 입력해주세요."
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <div className="login-btn-wrap">
            <Button
              text="로그인"
              type="primary"
              onClick={login}
              className="btn-full btn-large"
              disabled={memberId === "" || memberPw === ""}
            />
          </div>

          <div className="login-link-wrap">
            <button
              type="button"
              className="find-link"
              onClick={() => navigate("/find-id")}
            >
              아이디 찾기
            </button>
            <span className="link-divider">|</span>
            <button
              type="button"
              className="find-link"
              onClick={() => navigate("/find-pw")}
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const LoginInputWrap = (props) => {
  const label = props.label;
  const content = props.content;
  const type = props.type;
  const data = props.data;
  const setData = props.setData;
  const placeholder = props.placeholder;
  const onKeyPress = props.onKeyPress;

  return (
    <div className="login-input-wrap">
      <div>
        <div className="label">
          <label htmlFor={content}>{label}</label>
        </div>
        <div className="input">
          <Input
            type={type}
            data={data}
            setData={setData}
            content={content}
            placeholder={placeholder}
            onKeyPress={onKeyPress}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
