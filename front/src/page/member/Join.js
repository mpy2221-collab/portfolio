import { useState, useEffect } from "react";
import { Button, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./member.css";

const Join = () => {
  // 전송용
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberNickname, setMemberNickname] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberImg, setMemberImg] = useState(null); // 프로필 전송용
  const [memberImgPreview, setMemberImgPreview] = useState(null); // 프로필 미리보기용

  // 유효성 검사용
  const [checkIdMsg, setCheckIdMsg] = useState("");
  const [checkPwMsg, setCheckPwMsg] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const [checkNicknameMsg, setCheckNicknameMsg] = useState("");
  const [checkPhoneMsg, setCheckPhoneMsg] = useState("");
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

  const idCheck = (e) => {
    const idReg = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;

    // 1. 유효성 검사
    if (idReg.test(memberId)) {
      setCheckIdMsg("");

      // 2. 중복 검사
      axios.get(backServer + "/member/id/" + memberId).then((res) => {
        if (res.data.message == "success") {
          setCheckIdMsg("");
        } else {
          setCheckIdMsg("현재 사용중인 아이디입니다.");
        }
      });
    } else {
      setCheckIdMsg(
        "4자 이상 20자 이하, 영문자로 시작, 영문자/숫자 조합만 허용"
      );
    }
  };

  const pwCheck1 = () => {
    const pwReg = /^.{4,20}$/;

    if (pwReg.test(memberPw)) {
      setCheckPwMsg("");
    } else {
      setCheckPwMsg("비밀번호는 4자 이상 20자 이하");
    }
  };
  const pwCheck2 = () => {
    if (memberPw == memberPwRe) {
      setCheckPwMsg("");
    } else {
      setCheckPwMsg("비밀번호가 일치하지 않습니다.");
    }
  };

  const nicknameCheck = () => {
    const nicknameReg = /^[가-힣a-zA-Z0-9]{1,20}$/;

    if (nicknameReg.test(memberNickname)) {
      setCheckNicknameMsg("");
      axios
        .get(backServer + "/member/nickname/" + memberNickname)
        .then((res) => {
          if (res.data.message == "success") {
            setCheckNicknameMsg("");
          } else {
            setCheckNicknameMsg("사용 불가능한 닉네임입니다.");
          }
        })
        .catch((err) => {
          setCheckNicknameMsg("서버 오류가 발생했습니다.");
        });
    } else {
      setCheckNicknameMsg("1자 이상 20자 이하, 한글/영문/숫자 조합만 허용");
    }
  };

  const phoneCheck = () => {
    const phoneReg = /^010-[0-9]{4}-[0-9]{4}$/;

    if (phoneReg.test(memberPhone)) {
      setCheckPhoneMsg("");
    } else {
      setCheckPhoneMsg("전화번호는 010-0000-0000 형식으로 입력해주세요.");
    }
  };

  const emailCheck = () => {
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailReg.test(memberEmail)) {
      setCheckEmailMsg("");
      axios.get(backServer + "/member/email/" + memberEmail).then((res) => {
        if (res.data.message == "success") {
          setCheckEmailMsg("");
        } else {
          setCheckEmailMsg("사용 불가능한 이메일입니다.");
        }
      });
    } else {
      setCheckEmailMsg("이메일은 올바른 형식으로 입력해주세요.");
    }
  };

  // 이메일 변경 시 인증 상태 초기화
  useEffect(() => {
    if (memberEmail !== "") {
      setIsEmailAuthSent(false);
      setIsEmailAuthVerified(false);
      setEmailAuthCode("");
      setEmailAuthTimer(0);
      setCheckEmailAuthMsg("");
      setAuthCode(""); // 서버로부터 받은 인증번호도 초기화
    }
  }, [memberEmail]);

  // 이메일 인증번호 발송
  const sendEmailAuth = () => {
    
    if (checkEmailMsg === "" && memberEmail !== "") {
      
      axios
        .post(backServer + "/member/email/auth", {memberEmail: memberEmail})    
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
              text: "인증번호 발송에 실패했습니다.",
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
    
      // 서버로부터 받은 인증번호와 사용자가 입력한 인증번호 비교
      if (authCode === emailAuthCode) {
        setIsEmailAuthVerified(true);
        setCheckEmailAuthMsg("");
        setEmailAuthTimer(0);
      } else {
        setCheckEmailAuthMsg("인증번호가 일치하지 않습니다.");
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

  const changeImg = (e) => {
    const files = e.currentTarget.files;

    if (files.length !== 0 && files[0] != 0) {
      setMemberImg(files[0]); // 전송용 state에 파일 객체 세팅
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setMemberImgPreview(reader.result);
      };
    } else {
      setMemberImgPreview(null);
      setMemberImg(null);
    }
  };

  const join = () => {
    if (
      checkIdMsg == "" &&
      memberId != "" &&
      checkPwMsg == "" &&
      memberPw != "" &&
      checkPwMsg == "" &&
      memberPwRe != "" &&
      checkNicknameMsg == "" &&
      memberNickname != "" &&
      checkPhoneMsg == "" &&
      memberPhone != "" &&
      checkEmailMsg == "" &&
      memberEmail != "" &&
      isEmailAuthVerified &&
      emailAuthCode != ""
    ) {
      const formData = new FormData();
      formData.append("memberId", memberId);
      formData.append("memberPw", memberPw);
      formData.append("memberNickname", memberNickname);
      formData.append("memberPhone", memberPhone);
      formData.append("memberEmail", memberEmail);
      
      if(memberImg !== null) {
        formData.append("memberImg", memberImg);
      }

      axios
        .post(backServer + "/member/join", formData,{
          headers: {
            "Content-Type": "multipart/form-data",
            processData: false
          },
        })
        .then((res) => {
          if (res.data.message == "success") {
            Swal.fire({
              title: "회원가입 성공",
              text: "회원가입이 완료되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            }).then(() => {
              navigate("/login");
            });
          } else {
            Swal.fire({
              title: "회원가입 실패",
              text: "회원가입이 실패했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            }).then(() => {
              navigate("/");
            });
          }
        });
    } else {
      Swal.fire("회원가입을 완료해주세요.", "", "warning");
    }
  };

  return (
    <div className="join-wrap">
      <div className="join-container">
        <div className="join-header">
          <h1 className="join-title">회원가입</h1>
          <p className="join-subtitle">
            영화 추천 사이트에 오신 것을 환영합니다
          </p>
        </div>

        <div className="join-content">
          <div className="join-form-section">
            <h2 className="section-title">기본 정보</h2>

            <JoinInputWrap
              label="아이디"
              content="memberId"
              type="text"
              data={memberId}
              setData={setMemberId}
              blurEvent={idCheck}
              checkMsg={checkIdMsg}
              placeholder="아이디를 입력해주세요."
            />
            <JoinInputWrap
              label="비밀번호"
              content="memberPw"
              type="password"
              data={memberPw}
              setData={setMemberPw}
              blurEvent={pwCheck1}
              checkMsg={checkPwMsg}
              placeholder="비밀번호를 입력해주세요."
            />
            <JoinInputWrap
              label="비밀번호 확인"
              content="memberPwRe"
              type="password"
              data={memberPwRe}
              setData={setMemberPwRe}
              blurEvent={pwCheck2}
              checkMsg={checkPwMsg}
              placeholder="비밀번호 확인을 입력해주세요."
            />
            <JoinInputWrap
              label="닉네임"
              content="memberNickname"
              type="text"
              data={memberNickname}
              setData={setMemberNickname}
              blurEvent={nicknameCheck}
              checkMsg={checkNicknameMsg}
              placeholder="닉네임을 입력해주세요."
            />
          </div>

          <div className="join-form-section">
            <h2 className="section-title">연락처 정보</h2>

            <JoinInputWrap
              label="전화번호"
              content="memberPhone"
              type="text"
              data={memberPhone}
              setData={setMemberPhone}
              blurEvent={phoneCheck}
              checkMsg={checkPhoneMsg}
              placeholder="010-0000-0000"
            />
            <div className="email-input-wrapper">
              <JoinInputWrap
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
                    (isEmailAuthSent && emailAuthTimer > 0)
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
                <JoinInputWrap
                  label="이메일 인증번호"
                  content="emailAuthCode"
                  type="text"
                  data={emailAuthCode}
                  setData={setEmailAuthCode}
                  blurEvent={verifyEmailAuth}
                  checkMsg={checkEmailAuthMsg}
                  placeholder="인증번호를 입력해주세요."
                />
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
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                이메일 인증이 완료되었습니다.
              </div>
            )}
          </div>

          <div className="join-form-section">
            <h2 className="section-title">프로필 이미지</h2>

            <div className="profile-image-section">
              <div className="profile-preview">
                {memberImg === null ? (
                  <div className="profile-placeholder">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <p>프로필 이미지</p>
                  </div>
                ) : (
                  <img src={memberImgPreview} alt="프로필 미리보기" />
                )}
              </div>
              <label htmlFor="memberImg" className="file-upload-btn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                이미지 선택
              </label>
              <input
                type="file"
                onChange={changeImg}
                id="memberImg"
                accept="image/*"
                className="file-input"
              />
            </div>
          </div>
        </div>

        <div className="join-btn-section">
          <Button
            text="회원가입"
            type="primary"
            onClick={join}
            className="btn-full btn-large"
          />
        </div>
      </div>
    </div>
  );
};

const JoinInputWrap = (props) => {
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

export default Join;
