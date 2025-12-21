const Input = (props) => {
  const data = props.data; // input 태그와 연결할 state
  const setData = props.setData; // state 값 변경 함수
  const type = props.type;
  const content = props.content;
  const blurEvent = props.blurEvent; // 포커스 벗어났을때 실행할 이벤트
  // blur 뜻 : 포커스 벗어났을때

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
      />
    </>
  );
};

export { Input };
