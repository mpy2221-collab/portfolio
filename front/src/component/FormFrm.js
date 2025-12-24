import "./formFrm.css";
import { useNavigate } from "react-router-dom";

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

const Sidebar = (props) => {
  const navigate = useNavigate();
  const url = props.url;
  const text = props.text;
  const active = props.active || false;

  const handleClick = () => {
    navigate(url);
  };

  const getSidebarClassName = () => {
    const baseClass = "sidebar-menu-link";
    const activeClass = active ? " active" : "";
    return baseClass + activeClass;
  };

  return (
    <button
      className={getSidebarClassName()}
      onClick={handleClick}
      type="button"
    >
      {text}
    </button>
  );
};

const SearchInput = (props) => {
  const data = props.data;
  const setData = props.setData;
  const placeholder = props.placeholder || "검색어를 입력하세요";
  const onKeyPress = props.onKeyPress;
  const onSearch = props.onSearch;

  const changeData = (e) => {
    setData(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    } else if (onKeyPress) {
      onKeyPress(e);
    }
  };

  return (
    <div className="search-input-wrapper">
      <input
        className="search-input"
        type="text"
        value={data || ""}
        onChange={changeData}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
    </div>
  );
};

const SearchSelect = (props) => {
  const data = props.data;
  const setData = props.setData;
  const options = props.options || [];
  const onKeyPress = props.onKeyPress;
  const onSearch = props.onSearch;

  const changeData = (e) => {
    setData(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
    } else if (onKeyPress) {
      onKeyPress(e);
    }
  };

  return (
    <div className="search-select-wrapper">
      <select
        className="search-select"
        value={data || ""}
        onChange={changeData}
        onKeyPress={handleKeyPress}
      >
        <option value="">선택하세요</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const SearchButton = (props) => {
  const text = props.text || "검색";
  const onClick = props.onClick;
  const disabled = props.disabled || false;

  return (
    <button
      className="search-btn"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {text}
    </button>
  );
};

export { Input, Button, Sidebar, SearchInput, SearchSelect, SearchButton };
