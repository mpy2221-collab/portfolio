import { useState } from "react";
import { Input } from "../../component/FormFrm";
import axios from "axios";

const Join = () => {
  // 전송용
  const [memberId, setMemberId] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberNickname, setMemberNickname] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberImg, setMemberImg] = useState(""); // 자바 객체명과 같으면 안된다.

  // 유효성 검사용
  const [checkIdMsg, setCheckIdMsg] = useState("");
  const [checkPwMsg, setCheckPwMsg] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");

  const backServer = process.env.REACT_APP_BACK_SERVER;

  const idCheck = (e) => {
    const idReg = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;

    // 1. 유효성 검사
    if(idReg.test(memberId)) {
        setCheckIdMsg("");

        // 2. 중복 검사
        axios.get(backServer + "/member/id/" + memberId)
        .then((res)=>{
            if(res.data.message == "success") {
                setCheckIdMsg("");
            }else{
                setCheckIdMsg("현재 사용중인 아이디입니다.");
            }
        })
    } else {
        setCheckIdMsg("4자 이상 20자 이하, 영문자로 시작, 영문자/숫자 조합만 허용");
    }
  };

  return (
    <div className="join-wrap">
      <div className="join-content">
        <JoinInputWrap
          label="아이디"
          content="memberId"
          type="text"
          data={memberId}
          setData={setMemberId}
          blurEvent={idCheck}
          checkMsg={checkIdMsg}
        />
      </div>

      <div className="join-btn"></div>
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
          />
        </div>
      </div>
      {checkMsg ? <div className="check-msg">{checkMsg}</div> : ""}
    </div>
  );
};

export default Join;
