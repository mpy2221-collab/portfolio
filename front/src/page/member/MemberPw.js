import { useState } from "react";
import { Button, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
import "./member.css";

const MemberPw = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;

  // 인증 상태
  const [isAuth, setIsAuth] = useState(false);

  // 현재 비밀번호 인증
  const [currentPw, setCurrentPw] = useState("");

  // 새 비밀번호 변경
  const [newPw, setNewPw] = useState("");
  const [newPwConfirm, setNewPwConfirm] = useState("");
  const [checkPwMsg, setCheckPwMsg] = useState("");

  // 현재 비밀번호 인증
  const authCurrentPw = () => {
    if (currentPw === "") {
      Swal.fire({
        title: "입력 오류",
        text: "현재 비밀번호를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1a1a1a",
      });
      return;
    }

    axios
      .post(backServer + "/member/pw/check", { memberPw: currentPw })
      .then((res) => {
        if (res.data.message === "success") {
          setIsAuth(true);
          Swal.fire({
            title: "인증 성공",
            text: "비밀번호 변경을 진행할 수 있습니다.",
            icon: "success",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
        } else {
          Swal.fire({
            title: "인증 실패",
            text: "현재 비밀번호가 일치하지 않습니다.",
            icon: "error",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "인증 실패",
          text: "현재 비밀번호가 일치하지 않습니다.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#1a1a1a",
        });
      });
  };

  // 새 비밀번호 확인 검사 (blur 이벤트)
  const checkNewPwConfirm = () => {
    // 1. 새 비밀번호와 새 비밀번호 확인이 같은지 검사
    if (newPw !== newPwConfirm) {
      setCheckPwMsg("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 2. 새 비밀번호 유효성 검사
    const pwReg = /^.{4,20}$/;
    if (!pwReg.test(newPw)) {
      setCheckPwMsg("4자 이상 20자 이하로 입력해주세요.");
      return;
    }

    // 통과한 경우
    setCheckPwMsg("");
  };

  // 비밀번호 변경
  const changePw = () => {
    // 유효성 검사
    if (checkPwMsg !== "" || newPw === "" || newPwConfirm === "") {
      Swal.fire({
        title: "입력 오류",
        text: "새 비밀번호를 올바르게 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1a1a1a",
      });
      return;
    }

    // 비밀번호 일치 확인
    if (newPw !== newPwConfirm) {
      Swal.fire({
        title: "입력 오류",
        text: "비밀번호가 일치하지 않습니다.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1a1a1a",
      });
      return;
    }

    // 비밀번호 변경 요청
    axios
      .patch(backServer + "/member/pw", { memberPw: newPw })
      .then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "비밀번호가 변경되었습니다.",
            text: "",
            icon: "success",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          }).then(() => {
            // 모든 state 초기화
            setIsAuth(false);
            setCurrentPw("");
            setNewPw("");
            setNewPwConfirm("");
            setCheckPwMsg("");
          });
        } else {
          Swal.fire({
            title: "변경 실패",
            text: res.data.message || "비밀번호 변경에 실패했습니다.",
            icon: "error",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
        }
      })
      .catch((err) => {
        console.error("비밀번호 변경 실패:", err);
        Swal.fire({
          title: "변경 실패",
          text: "서버 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#1a1a1a",
        });
      });
  };

  return (
    <div className="member-info-wrap">
      <div className="member-info-container">
        <div className="member-info-header">
          <h1 className="member-info-title">비밀번호 변경</h1>
          <p className="member-info-subtitle">
            비밀번호를 안전하게 변경할 수 있습니다
          </p>
        </div>

        <div className="member-info-content">
          {/* 현재 비밀번호 인증 섹션 */}
          {!isAuth && (
            <div className="member-info-section">
              <h2 className="section-title">현재 비밀번호 인증</h2>
              <div className="member-info-input-wrap">
                <div className="label">
                  <label htmlFor="currentPw">현재 비밀번호</label>
                </div>
                <div className="input">
                  <Input
                    type="password"
                    data={currentPw}
                    setData={setCurrentPw}
                    content="currentPw"
                    placeholder="현재 비밀번호를 입력해주세요."
                  />
                </div>
              </div>
              <div className="member-info-btn-section">
                <Button
                  text="인증하기"
                  type="primary"
                  onClick={authCurrentPw}
                  className="btn-full btn-large"
                  disabled={currentPw === ""}
                />
              </div>
            </div>
          )}

          {/* 새 비밀번호 변경 섹션 */}
          {isAuth && (
            <div className="member-info-section">
              <h2 className="section-title">새 비밀번호 변경</h2>
              <div className="member-info-input-wrap">
                <div className="label">
                  <label htmlFor="newPw">새 비밀번호</label>
                </div>
                <div className="input">
                  <Input
                    type="password"
                    data={newPw}
                    setData={setNewPw}
                    content="newPw"
                    placeholder="새 비밀번호를 입력해주세요. (4자 이상 20자 이하)"
                  />
                </div>
              </div>
              <div className="member-info-input-wrap">
                <div className="label">
                  <label htmlFor="newPwConfirm">새 비밀번호 확인</label>
                </div>
                <div className="input">
                  <Input
                    type="password"
                    data={newPwConfirm}
                    setData={setNewPwConfirm}
                    content="newPwConfirm"
                    blurEvent={checkNewPwConfirm}
                    placeholder="새 비밀번호를 다시 입력해주세요."
                  />
                </div>
                {checkPwMsg ? (
                  <div className="check-msg">{checkPwMsg}</div>
                ) : (
                  ""
                )}
              </div>
              <div className="member-info-btn-section">
                <Button
                  text="변경하기"
                  type="primary"
                  onClick={changePw}
                  className="btn-full btn-large"
                  disabled={
                    checkPwMsg !== "" ||
                    newPw === "" ||
                    newPwConfirm === "" ||
                    newPw !== newPwConfirm
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberPw;
