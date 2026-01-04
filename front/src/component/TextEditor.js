import axios from "axios";
import { useMemo, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/ImageResize", ImageResize);

const TextEditor = (props) => {
  // findDOMNode 경고 억제 (react-quill 내부 문제)
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    const shouldIgnore = (args) => {
      const message = args[0];
      if (typeof message === "string") {
        return (
          message.includes("findDOMNode is deprecated") ||
          message.includes("findDOMNode") ||
          message.includes(
            "quill:toolbar ignoring attaching to disabled format"
          )
        );
      }
      // 배열이나 객체 형태로 전달될 수도 있음
      if (Array.isArray(args)) {
        const str = args.join(" ");
        return str.includes("findDOMNode") || str.includes("quill:toolbar");
      }
      return false;
    };

    console.error = (...args) => {
      if (shouldIgnore(args)) {
        return;
      }
      originalError.call(console, ...args);
    };

    console.warn = (...args) => {
      if (shouldIgnore(args)) {
        return;
      }
      originalWarn.call(console, ...args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);
  const data = props.data;
  const setData = props.setData;
  const url = props.url;

  const imageHanldler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file"); //파일업로드용이므로 파일타입설정
    input.setAttribute("accept", "image/*"); //이미지파일만 올릴수 있도록 파일 제한
    input.click(); //생성한 input을 클릭
    //생성한 input에 change이벤트 적용

    input.onchange = async () => {
      const files = input.files;
      if (files !== null) {
        const form = new FormData();
        form.append("image", files[0]);
        axios
          .post(url, form, {
            headers: {
              contentType: "multipart/form-data",
              processData: false,
            },
          })
          .then((res) => {
            console.log(res.data.data);
            const editor = quillRef.current.getEditor(); // 텍스트에디터 dom을 선택
            const range = editor.getSelection();
            const backServer = process.env.REACT_APP_BACK_SERVER;
            // 에디터의 현재 선택된 위치에 이미지를 삽입
            // 서버에서 반환된 이미지 URL을 사용하여 이미지 삽입
            editor.insertEmbed(
              range.index,
              "image",
              backServer + res.data.data
            );

            // 이미지 삽입 후 커서를 이미지 다음 위치로 이동
            editor.setSelection(range.index + 1);
          })
          .catch((res) => {
            console.log(res);
          });
      }
    };
  };
  //컴포넌트 내부에서 특정 DOM객체를 선택할때 사용하는 Hooks
  const quillRef = useRef();
  //quill에디터 옵션 형식을 지정(배열)
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "image",
    "color",
  ];
  //quill에서 사용할 모듈 설정
  //useMemo : 동일한 값을 반환하는 경우 함수를 반복적으로 호출하는 것이 아니라
  //메모리에 저장해두고 바로 가져오는 hooks
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image", "video"],
        ],
        handlers: {
          image: imageHanldler,
        },
      },
      ImageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, []);

  return (
    <ReactQuill
      ref={quillRef}
      formats={formats}
      theme="snow"
      value={data}
      onChange={setData}
      modules={modules}
    />
  );
};

export default TextEditor;
