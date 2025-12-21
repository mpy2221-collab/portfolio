import "./formFrm.css";

const Input = (props) => {
  const data = props.data; // input 태그와 연결할 state
  const setData = props.setData; // state 값 변경 함수
  const type = props.type;
  const content = props.content;
  const blurEvent = props.blurEvent; // 포커스 벗어났을때 실행할 이벤트
  // blur 뜻 : 포커스 벗어났을때
  const placeholder = props.placeholder;
  const onKeyPress = props.onKeyPress; // Enter 키 이벤트

  const changeData = (e) => {
    setData(e.target.value);
  };

  return (
    <>
      <input
        className="input-form"
        type={type}
        value={data || ""}
        id={content}
        onChange={changeData}
        onBlur={blurEvent}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
      />
    </>
  );
};

const Button = (props) => {
  const text = props.text || "버튼";
  const type = props.type || "primary"; // primary, secondary, danger
  const onClick = props.onClick;
  const disabled = props.disabled || false;
  const className = props.className || "";

  const getButtonClassName = () => {
    const baseClass = "btn";
    const typeClass = "btn-" + type;
    const disabledClass = disabled ? " btn-disabled" : "";
    const customClass = className ? " " + className : "";
    return baseClass + " " + typeClass + disabledClass + customClass;
  };

  return (
    <button
      className={getButtonClassName()}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {text}
    </button>
  );
};

export { Input, Button };
