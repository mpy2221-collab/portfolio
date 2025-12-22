import { useState, useEffect } from "react";
import { Button, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";
import "./member.css";

const MemberInfo = (props) => {
  const member = props.member || {};
  const setMember = props.setMember;
  const backServer = process.env.REACT_APP_BACK_SERVER;

  // 전송용
  const [memberNickname, setMemberNickname] = useState("");
  const [memberImg, setMemberImg] = useState(null); // 프로필 전송용
  const [memberImgChangeCheck, setMemberImgChangeCheck] = useState(false); // 프로필 이미지 변경 여부 체크

  
  // 화면 출력용
  const [memberImgPreview, setMemberImgPreview] = useState(null); // 프로필 미리보기용
  const [checkNicknameMsg, setCheckNicknameMsg] = useState("");

  // member가 변경될 때 초기값 설정
  useEffect(() => {
    // 닉네임 초기값 설정
    if (member.memberNickname) {
      setMemberNickname(member.memberNickname);
    }

    // 프로필 이미지 미리보기
    if (member.memberProfileImg) {
      setMemberImgPreview(
        backServer + "/member/profile/" + member.memberProfileImg
      );
    } else {
      setMemberImgPreview(null);
    }
  }, [member, backServer]);

  // 닉네임 유효성 검사 및 중복 검사 (처리완료)
  const nicknameCheck = () => {
    const nicknameReg = /^[가-힣a-zA-Z0-9]{1,20}$/;

    // 1. 유효성 검사
    if (nicknameReg.test(memberNickname)) {
      setCheckNicknameMsg("");

      // 2. 중복 검사
      // 현재 로그인한 회원의 기존 닉네임과 비교
      if (memberNickname === member.memberNickname) {
        // 같으면: 중복 체크 불필요 (자기 자신)
        setCheckNicknameMsg("");
      } else {
        // 다르면: 서버에 닉네임으로 회원 조회 요청 (현재 로그인한 회원 제외)
        axios
          .get(backServer + "/member/nickname/" + memberNickname)
          .then((res) => {
            if (res.data.message == "success") {
              // null이면 성공 (사용 가능)
              setCheckNicknameMsg("");
            } else {
              // 값이 있으면 실패 (사용 불가능)
              setCheckNicknameMsg("사용 불가능한 닉네임입니다.");
            }
          })
          .catch((err) => {
            setCheckNicknameMsg("서버 오류가 발생했습니다.");
          });
      }
    } else {
      // 조건을 만족하지 못한 경우
      setCheckNicknameMsg("1자 이상 20자 이하, 한글/영문/숫자 조합만 허용");
    }
  };

  // 프로필 이미지 변경
  const changeImg = (e) => {
    const files = e.currentTarget.files;

    if (files.length !== 0 && files[0] != 0) {
      setMemberImgChangeCheck(true);
      setMemberImg(files[0]); // 전송용 state에 파일 객체 세팅
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setMemberImgPreview(reader.result);
      };
    } else {
      setMemberImgChangeCheck(true);
      setMemberImgPreview(null);
      setMemberImg(null);
    }
  };

  // 프로필 이미지 삭제 (기본 이미지로 변경)
  const deleteImg = () => {
    setMemberImgChangeCheck(true);
    setMemberImgPreview(null);
    setMemberImg(null);
  };

  // 날짜 포맷팅 (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 전화번호 포맷팅 (010-1234-5678)
  const formatPhone = (phone) => {
    if (!phone) return "";
    return phone;
  };

  // 수정 완료
  const updateMember = () => {
    // 수정 완료 버튼 활성화 조건 확인
    if (checkNicknameMsg !== "" || memberNickname === "") {
      Swal.fire({
        title: "입력 오류",
        text: "닉네임을 올바르게 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    // FormData 생성
    const formData = new FormData();
    formData.append("memberNickname", memberNickname);
    formData.append("memberImg", memberImg); // 프로필 이미지 전송
    formData.append("memberImgChangeCheck", memberImgChangeCheck); // 프로필 이미지 변경 여부 전송
    

    // 수정 요청
    // put과 patch의 차이점 -> put은 전체 데이터를 수정, patch는 일부 데이터를 수정
    axios
      .patch(backServer + "/member/info", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.message == "success") {
          Swal.fire({
            title: "정보가 수정되었습니다.",
            text: "",
            icon: "success",
            confirmButtonText: "확인",
          }).then(() => {
            axios.get(backServer + "/member")
            .then((res)=>{
                if(res.data.message == "success"){
                    setMember(res.data.data);
                }
            })
          });
        } else {
          Swal.fire({
            title: "수정 실패",
            text: res.data.message || "정보 수정에 실패했습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      })
      .catch((err) => {
        console.error("회원 정보 수정 실패:", err);
        Swal.fire({
          title: "수정 실패",
          text: "서버 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  return (
    <div className="member-info-wrap">
      <div className="member-info-container">
        <div className="member-info-header">
          <h1 className="member-info-title">내 정보</h1>
          <p className="member-info-subtitle">
            회원 정보를 확인하고 수정할 수 있습니다
          </p>
        </div>

        <div className="member-info-content">
          {/* 회원 정보 표시 섹션 */}
          <div className="member-info-section">
            <h2 className="section-title">회원 정보</h2>

            <div className="info-display-wrap">
              <div className="info-item">
                <label className="info-label">아이디</label>
                <div className="info-value">{member.memberId || ""}</div>
                <p className="info-note">기본키이므로 변경할 수 없습니다</p>
              </div>

              <div className="info-item">
                <label className="info-label">전화번호</label>
                <div className="info-value">
                  {formatPhone(member.memberPhone) || ""}
                </div>
              </div>

              <div className="info-item">
                <label className="info-label">이메일</label>
                <div className="info-value">{member.memberEmail || ""}</div>
              </div>

              <div className="info-item">
                <label className="info-label">가입일</label>
                <div className="info-value">
                  {formatDate(member.memberEnrollDate) || ""}
                </div>
              </div>
            </div>
          </div>

          {/* 수정 가능한 정보 섹션 */}
          <div className="member-info-section">
            <h2 className="section-title">수정 가능한 정보</h2>

            {/* 닉네임 수정 */}
            <div className="member-info-input-wrap">
              <div className="label">
                <label htmlFor="memberNickname">닉네임</label>
              </div>
              <div className="input">
                <Input
                  type="text"
                  data={memberNickname}
                  setData={setMemberNickname}
                  content="memberNickname"
                  blurEvent={nicknameCheck}
                  placeholder="닉네임을 입력해주세요."
                />
              </div>
              {checkNicknameMsg ? (
                <div className="check-msg">{checkNicknameMsg}</div>
              ) : (
                ""
              )}
            </div>

            {/* 프로필 이미지 수정 */}
            <div className="profile-image-section">
              <div className="label">
                <label>프로필 이미지</label>
              </div>
              <div className="profile-image-wrapper">
                <div className="profile-preview">
                  {memberImgPreview ? (
                    <img src={memberImgPreview} alt="프로필 미리보기" />
                  ) : (
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
                  )}
                </div>
                <div className="profile-image-buttons">
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
                  {memberImgPreview && (
                    <button
                      type="button"
                      className="file-delete-btn"
                      onClick={deleteImg}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      이미지 삭제
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수정 완료 버튼 */}
        <div className="member-info-btn-section">
          <Button
            text="수정 완료"
            type="primary"
            onClick={updateMember}
            className="btn-full btn-large"
            disabled={checkNicknameMsg !== "" || memberNickname === ""}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberInfo;
