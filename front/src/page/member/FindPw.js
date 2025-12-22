import { useState, useEffect } from "react";
import { Button, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./member.css";

const FindPw = () => {
  const [memberId, setMemberId] = useState("");
  const [checkIdMsg, setCheckIdMsg] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [checkEmailMsg, setCheckEmailMsg] = useState("");

  // 이메일 인증 관련
  const [emailAuthCode, setEmailAuthCode] = useState(""); // 사용자가 입력한 인증번호
  const [isEmailAuthSent, setIsEmailAuthSent] = useState(false); // 인증번호 발송 여부 (true: 발송됨, false: 미발송)
  const [isEmailAuthVerified, setIsEmailAuthVerified] = useState(false); // 이메일 인증 완료 여부 (true: 인증완료, false: 미인증)
  const [emailAuthTimer, setEmailAuthTimer] = useState(0); // 인증번호 유효 시간 타이머 (초 단위, 180초 = 3분)
  const [checkEmailAuthMsg, setCheckEmailAuthMsg] = useState(""); // 인증번호 검증 결과 메시지 (에러 메시지 표시용)
  const [authCode, setAuthCode] = useState(""); // 서버로부터 받은 인증번호 저장용

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  // 아이디 유효성 검사
  const idCheck = () => {
    const idReg = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;

    if (idReg.test(memberId)) {
      setCheckIdMsg("");
    } else {
      setCheckIdMsg(
        "4자 이상 20자 이하, 영문자로 시작, 영문자/숫자 조합만 허용"
      );
    }
  };

  // 이메일 유효성 검사
  const emailCheck = () => {
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailReg.test(memberEmail)) {
      setCheckEmailMsg("");
    } else {
      setCheckEmailMsg("이메일은 올바른 형식으로 입력해주세요.");
    }
  };

  // 아이디 또는 이메일 변경 시 인증 상태 초기화
  useEffect(() => {
    if (memberId !== "" || memberEmail !== "") {
      setIsEmailAuthSent(false);
      setIsEmailAuthVerified(false);
      setEmailAuthCode("");
      setEmailAuthTimer(0);
      setCheckEmailAuthMsg("");
      setAuthCode("");
    }
  }, [memberId, memberEmail]);

  // 이메일 인증번호 발송
  const sendEmailAuth = () => {
    if (checkEmailMsg === "" && memberEmail !== "" && memberId !== "") {
      axios
        .post(backServer + "/member/pw/auth", { memberEmail: memberEmail, memberId: memberId })
        .then((res) => {
          if (res.data.message === "success") {
            setIsEmailAuthSent(true);
            setEmailAuthTimer(180);
            setCheckEmailAuthMsg("");
            console.log(res.data.data);
            setAuthCode(res.data.data); // 서버로부터 받은 인증번호 저장
          } else {
            Swal.fire({
              title: "발송 실패",
              text: "회원정보가 일치하지 않습니다",
              icon: "error",
              confirmButtonText: "확인",
              confirmButtonColor: "#1a1a1a",
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "발송 실패",
            text: "서버 오류가 발생했습니다.",
            icon: "error",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
        });
    } else {
      Swal.fire({
        title: "이메일 확인",
        text: "올바른 이메일을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1a1a1a",
      });
    }
  };

  // 이메일 인증번호 확인 (클라이언트에서 직접 비교)
  const verifyEmailAuth = () => {
    if (emailAuthCode.length >= 4) {
      if (authCode === emailAuthCode) {
        setIsEmailAuthVerified(true);
        setCheckEmailAuthMsg("");
        setEmailAuthTimer(0);
      } else {
        setCheckEmailAuthMsg("인증번호가 일치하지 않습니다.");
      }
    } else {
      setCheckEmailAuthMsg("인증번호를 입력해주세요.");
    }
  };

  // 타이머
  useEffect(() => {
    let interval = null;
    if (isEmailAuthSent && emailAuthTimer > 0 && !isEmailAuthVerified) {
      interval = setInterval(() => {
        setEmailAuthTimer((prev) => {
          if (prev <= 1) {
            setIsEmailAuthSent(false);
            setCheckEmailAuthMsg(
              "인증 시간이 만료되었습니다. 다시 발송해주세요."
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [emailAuthTimer, isEmailAuthSent, isEmailAuthVerified]);

  // 비밀번호 찾기 요청
  const findPw = () => {
    if (
      checkIdMsg === "" &&
      memberId !== "" &&
      checkEmailMsg === "" &&
      memberEmail !== "" &&
      isEmailAuthVerified
    ) {

      axios
        .post(backServer + "/member/find-pw", {
          memberId: memberId,
          memberEmail: memberEmail,
        })
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              title: "임시 비밀번호 발송 완료",
              text: "등록된 이메일로 임시 비밀번호를 전송했습니다.",
              icon: "success",
              confirmButtonText: "확인",
              confirmButtonColor: "#1a1a1a",
            }).then(() => {
              navigate("/login");
            });
          } else {
            Swal.fire({
              title: "조회 실패",
              text: "이메일 정보가 존재하지 않습니다.",
              icon: "error",
              confirmButtonText: "확인",
              confirmButtonColor: "#1a1a1a",
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            title: "조회 실패",
            text: "서버 오류가 발생했습니다.",
            icon: "error",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
        });
    } else {
      Swal.fire({
        title: "입력 확인",
        text: "아이디, 이메일을 입력하고 이메일 인증을 완료해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1a1a1a",
      });
    }
  };

  return (
    <div className="find-pw-wrap">
      <div className="find-pw-container">
        <div className="find-pw-header">
          <h1 className="find-pw-title">비밀번호 찾기</h1>
          <p className="find-pw-subtitle">
            아이디와 등록된 이메일로 비밀번호를 찾을 수 있습니다
          </p>
        </div>

        <div className="find-pw-content">
          <div className="find-pw-form-section">
            <h2 className="section-title">아이디 및 이메일 입력</h2>

            <FindPwInputWrap
              label="아이디"
              content="memberId"
              type="text"
              data={memberId}
              setData={setMemberId}
              blurEvent={idCheck}
              checkMsg={checkIdMsg}
              placeholder="아이디를 입력해주세요."
            />

            <div className="email-input-wrapper">
              <FindPwInputWrap
                label="이메일"
                content="memberEmail"
                type="email"
                data={memberEmail}
                setData={setMemberEmail}
                blurEvent={emailCheck}
                checkMsg={checkEmailMsg}
                placeholder="example@email.com"
              />
              <div className="email-auth-send-section">
                <button
                  type="button"
                  className="auth-send-btn"
                  onClick={sendEmailAuth}
                  disabled={
                    checkEmailMsg !== "" ||
                    memberEmail === "" ||
                    (isEmailAuthSent && emailAuthTimer > 0) ||
                    isEmailAuthVerified
                  }
                >
                  {isEmailAuthSent && emailAuthTimer > 0
                    ? "재발송 (" +
                      Math.floor(emailAuthTimer / 60) +
                      ":" +
                      String(emailAuthTimer % 60).padStart(2, "0") +
                      ")"
                    : "인증번호 발송"}
                </button>
              </div>
            </div>

            {isEmailAuthSent && !isEmailAuthVerified && (
              <div className="email-auth-code-wrapper">
                <div className="email-auth-code-input-wrapper">
                  <FindPwInputWrap
                    label="이메일 인증번호"
                    content="emailAuthCode"
                    type="text"
                    data={emailAuthCode}
                    setData={setEmailAuthCode}
                    blurEvent={verifyEmailAuth}
                    checkMsg={checkEmailAuthMsg}
                    placeholder="인증번호를 입력해주세요."
                  />
                  <button
                    type="button"
                    className="auth-verify-btn"
                    onClick={verifyEmailAuth}
                    disabled={emailAuthCode.length < 4}
                  >
                    확인
                  </button>
                </div>
                {emailAuthTimer > 0 && (
                  <div className="auth-timer">
                    남은 시간: {Math.floor(emailAuthTimer / 60)}:
                    {String(emailAuthTimer % 60).padStart(2, "0")}
                  </div>
                )}
                {emailAuthTimer === 0 && isEmailAuthSent && (
                  <div className="auth-timer expired">
                    인증 시간이 만료되었습니다.
                  </div>
                )}
              </div>
            )}

            {isEmailAuthVerified && (
              <div className="email-auth-success">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>이메일 인증이 완료되었습니다.</span>
              </div>
            )}
          </div>
        </div>

        <div className="find-pw-btn-section">
          <Button
            text="비밀번호 찾기"
            type="primary"
            onClick={findPw}
            className="btn-full btn-large"
            disabled={
              checkIdMsg !== "" || memberId === "" || !isEmailAuthVerified
            }
          />
        </div>
      </div>
    </div>
  );
};

const FindPwInputWrap = (props) => {
  const label = props.label;
  const content = props.content;
  const type = props.type;
  const data = props.data;
  const setData = props.setData;
  const blurEvent = props.blurEvent;
  const checkMsg = props.checkMsg;
  const placeholder = props.placeholder;

  return (
    <div className="join-input-wrap">
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
            blurEvent={blurEvent}
            placeholder={placeholder}
          />
        </div>
      </div>
      {checkMsg ? <div className="check-msg">{checkMsg}</div> : ""}
    </div>
  );
};

export default FindPw;
