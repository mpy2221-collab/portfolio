import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReviewFrm from "./ReviewFrm";
import "./review.css";

const ReviewWrite = () => {
  const params = useParams();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  // 영화 정보
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // 서버로 전송할 데이터
  const boardReviewTmdbMovieId = params.tmdbMovieId;
  const [boardReviewTitle, setBoardReviewTitle] = useState("");
  const [boardReviewContent, setBoardReviewContent] = useState("");
  const [boardReviewRating, setBoardReviewRating] = useState(null);
  const [boardReviewFile, setBoardReviewFile] = useState([]); // 첨부파일 테이블에 삽입

  const [boardReviewGenres, setBoardReviewGenres] = useState([]); // 장르 테이블에 삽입

  // 사용자 출력용
  const [fileList, setFileList] = useState([]); // 첨부파일 미리보기 용

  // 영화 정보 조회
  useEffect(() => {
    if (boardReviewTmdbMovieId) {
      axios
        .get(backServer + "/api/popular/view/" + boardReviewTmdbMovieId)
        .then((res) => {
          // console.log(res.data);
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

  // 작성 완료 함수
  const write = () => {
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

    form.append("boardReviewTmdbMovieId", Number(boardReviewTmdbMovieId));
    form.append("boardReviewTitle", boardReviewTitle.trim());
    form.append("boardReviewContent", boardReviewContent);
    form.append("boardReviewRating", boardReviewRating);

    // 영화 정보 추가 (null 체크)
    if (movie) {
      form.append("movieTitle", movie.title || "");
      form.append("moviePosterPath", movie.poster_path || "");
      form.append("movieReleaseDate", movie.release_date || "");
      form.append("movieRuntime", movie.runtime || 0);
    }

    // 첨부파일 추가
    if (boardReviewFile && boardReviewFile.length > 0) {
      for (let i = 0; i < boardReviewFile.length; i++) {
        form.append("boardReviewFile", boardReviewFile[i]);
      }
    }

    // 장르 정보 추가
    if (boardReviewGenres && boardReviewGenres.length > 0) {
      boardReviewGenres.forEach((genre) => {
        form.append("boardReviewGenreIds", genre.id);
        form.append("boardReviewGenreNames", genre.name);
      });
    }

    // FormData 내용 확인 (디버깅용)
    // console.log("=== FormData 내용 ===");
    // for (let [key, value] of form.entries()) {
    //   console.log(key + ":", value);
    // }
    // console.log("===================");

    axios
      .post(backServer + "/board/review/write", form)
      .then((res) => {
        console.log("서버 응답:", res.data);
        if (res.data.message === "success") {
          const boardReviewNo = res.data.data; // data가 직접 boardReviewNo
          Swal.fire({
            title: "작성 완료",
            text: "게시글이 작성되었습니다.",
            icon: "success",
            confirmButtonText: "확인",
          }).then(() => {
            navigate("/board/review/view/" + boardReviewNo);
          });
        } else {
          console.error("작성 실패 응답:", res.data);
          Swal.fire({
            title: "리뷰 작성 실패",
            text: res.data.message || "게시글 작성에 실패했습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      })
      .catch((err) => {
        console.error("게시글 작성 실패:", err);
        console.error("에러 상세:", err.response?.data);
        Swal.fire({
          title: "오류",
          text:
            err.response?.data?.message ||
            "게시글 작성 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  // 취소 함수
  const handleCancel = () => {
    Swal.fire({
      title: "작성 취소",
      text: "작성 중인 내용이 삭제됩니다. 계속하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/board/review/list");
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
    <div className="review-write-wrap">
      <div className="review-write-title">게시글 작성</div>
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
        buttonFunction={write}
        cancelFunction={handleCancel}
        type="write"
      />
    </div>
  );
};

export default ReviewWrite;
