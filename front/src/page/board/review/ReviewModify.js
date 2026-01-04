import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReviewFrm from "./ReviewFrm";

const ReviewModify = () => {
  const params = useParams();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  // 영화 정보
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const boardReviewTmdbMovieId = params.boardReviewTmdbMovieId;
  const [boardReviewGenres, setBoardReviewGenres] = useState([]);

  // 서버로 전송할 데이터
  const boardReviewNo = params.boardReviewNo;
  const [boardReviewTitle, setBoardReviewTitle] = useState("");
  const [boardReviewContent, setBoardReviewContent] = useState("");
  const [boardReviewRating, setBoardReviewRating] = useState(null);
  const [boardReviewFile, setBoardReviewFile] = useState([]); // 첨부파일 테이블에 삽입
  const [delFileNo, setDelFileNo] = useState([]); // 삭제할 파일 번호

  // 사용자 출력용
  const [fileList, setFileList] = useState([]); // 첨부파일 미리보기 용

  // 영화 정보 조회
  useEffect(() => {
    if (boardReviewTmdbMovieId) {
      axios
        .get(backServer + "/api/popular/view/" + boardReviewTmdbMovieId)
        .then((res) => {
          //   console.log(res.data);
          if (res.data.message === "success") {
            setMovie(res.data.data.movie);
            setBoardReviewGenres(res.data.data.movie.genres);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("영화 정보 조회 실패:", err);
          Swal.fire({
            title: "오류",
            text: "영화 정보를 불러올 수 없습니다.",
            icon: "error",
            confirmButtonText: "확인",
          }).then(() => {
            navigate("/board/review/list");
          });
          setLoading(false);
        });
    }
  }, [boardReviewTmdbMovieId, backServer, navigate]);

  useEffect(() => {
    axios
      .get(backServer + "/board/review/view/" + boardReviewNo)
      .then((res) => {
        const boardReview = res.data.data;
        // console.log(boardReview);
        setBoardReviewTitle(boardReview.boardReviewTitle);
        setBoardReviewContent(boardReview.boardReviewContent);
        setBoardReviewRating(boardReview.boardReviewRating);

        // boardReviewFiles를 그대로 저장 (파일 번호 포함)
        if (
          boardReview.boardReviewFiles &&
          boardReview.boardReviewFiles.length > 0
        ) {
          setFileList(boardReview.boardReviewFiles);
        } else {
          setFileList([]); // 빈 배열로 초기화
        }
      });
  }, []);

  const modify = () => {
    // 유효성 검사
    if (boardReviewTitle === "") {
      Swal.fire({
        title: "입력 오류",
        text: "제목을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (boardReviewTitle.length > 200) {
      Swal.fire({
        title: "입력 오류",
        text: "제목은 200자 이하로 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (boardReviewRating === null || boardReviewRating === "") {
      Swal.fire({
        title: "입력 오류",
        text: "평점을 선택해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (boardReviewContent === "") {
      Swal.fire({
        title: "입력 오류",
        text: "내용을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const form = new FormData();

    form.append("boardReviewNo", boardReviewNo);
    form.append("boardReviewTitle", boardReviewTitle.trim());
    form.append("boardReviewContent", boardReviewContent);
    form.append("boardReviewRating", boardReviewRating);

    // 첨부파일 추가
    if (boardReviewFile && boardReviewFile.length > 0) {
      for (let i = 0; i < boardReviewFile.length; i++) {
        form.append("boardReviewFile", boardReviewFile[i]);
      }
    }

    // 첨부파일 삭제
    if (delFileNo && delFileNo.length > 0) {
      for (let i = 0; i < delFileNo.length; i++) {
        form.append("delFileNo", delFileNo[i]);
      }
    }

    axios.patch(backServer + "/board/review", form).then((res)=>{
        if(res.data.message === "success"){
            navigate("/board/review/view/" + boardReviewNo);
        }else{
            Swal.fire({
                title: "수정 실패",
                text: res.data.message,
            });
        }
    }).catch((err)=>{
        console.error("수정 실패:", err);
        Swal.fire({
            title: "수정 실패",
            text: "서버 오류가 발생했습니다.",
        });
    });
  };

  // 취소 함수
  const handleCancel = () => {
    Swal.fire({
      title: "수정 취소",
      text: "수정 중인 내용이 삭제됩니다. 계속하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/board/review/view/" + boardReviewNo);
      }
    });
  };

  if (loading) {
    return (
      <div className="review-write-wrap">
        <div className="loading-message">영화 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="review-write-wrap">
        <div className="error-message">영화 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="review-modify-wrap">
      <ReviewFrm
        movie={movie}
        boardReviewTmdbMovieId={boardReviewTmdbMovieId}
        boardReviewTitle={boardReviewTitle}
        setBoardReviewTitle={setBoardReviewTitle}
        boardReviewContent={boardReviewContent}
        setBoardReviewContent={setBoardReviewContent}
        boardReviewRating={boardReviewRating}
        setBoardReviewRating={setBoardReviewRating}
        boardReviewFile={boardReviewFile}
        setBoardReviewFile={setBoardReviewFile}
        boardReviewGenres={boardReviewGenres}
        setBoardReviewGenres={setBoardReviewGenres}
        fileList={fileList}
        setFileList={setFileList}
        delFileNo={delFileNo}
        setDelFileNo={setDelFileNo}
        buttonFunction={modify}
        cancelFunction={handleCancel}
        type="modify"
      />
    </div>
  );
};

export default ReviewModify;
