import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextEditor from "../../../component/TextEditor";
import { Input, Button } from "../../../component/FormFrm";
import "./review.css";

const ReviewFrm = (props) => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;

  // 영화 정보
  const movie = props.movie;

  // 서버로 전송할 데이터
  const boardReviewTmdbMovieId = props.boardReviewTmdbMovieId;
  const boardReviewTitle = props.boardReviewTitle;
  const setBoardReviewTitle = props.setBoardReviewTitle;
  const boardReviewContent = props.boardReviewContent;
  const setBoardReviewContent = props.setBoardReviewContent;
  const boardReviewRating = props.boardReviewRating;
  const setBoardReviewRating = props.setBoardReviewRating;
  const boardReviewFile = props.boardReviewFile;
  const setBoardReviewFile = props.setBoardReviewFile;
  const boardReviewGenres = props.boardReviewGenres;
  const setBoardReviewGenres = props.setBoardReviewGenres;

  // 사용자 출력용
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;

  // 버튼 함수
  const buttonFunction = props.buttonFunction;
  const cancelFunction = props.cancelFunction;
  // 폼 타입
  const type = props.type;

  // 첨부파일 추가하면 화면에 보여줄 state
  const [newFileList, setNewFileList] = useState([]);

  // 제목 유효성 검사
  const [titleError, setTitleError] = useState("");

  // 포스터 이미지 URL 생성
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return "";
    return "https://image.tmdb.org/t/p/w300" + posterPath;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dateString;
  };

  // 상영시간 포맷팅
  const formatRuntime = (runtime) => {
    if (!runtime) return "-";
    return runtime + "분";
  };

  // 제목 입력 핸들러
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setBoardReviewTitle(value);

    // 유효성 검사
    if (value.length > 200) {
      setTitleError("제목은 200자 이하로 입력해주세요.");
    } else if (value.trim() === "") {
      setTitleError("제목을 입력해주세요.");
    } else {
      setTitleError("");
    }
  };

  // 평점 선택 핸들러
  const handleRatingChange = (e) => {
    setBoardReviewRating(parseInt(e.target.value));
  };

  // 첨부파일 추가시 동작할 함수
  const handleFileChange = (e) => {
    const files = e.currentTarget.files;
    setBoardReviewFile(files);
    const arr = new Array();
    for (let i = 0; i < files.length; i++) {
      arr.push(files[i].name);
    }
    // setFileList(arr);
    setNewFileList(arr);
  };

  // 작성 버튼 활성화 조건
  const isSubmitEnabled =
    boardReviewTitle.trim() !== "" &&
    boardReviewTitle.length <= 200 &&
    boardReviewRating !== null &&
    boardReviewContent.trim() !== "";

  return (
    <div className="review-frm-wrap">
      {/* 영화 정보 표시 섹션 (읽기 전용) */}
      {movie && (
        <div className="review-movie-info-section">
          <div className="movie-info-poster">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="movie-poster-readonly"
            />
          </div>
          <div className="movie-info-details">
            <h3 className="movie-info-title">{movie.title || "제목 없음"}</h3>
            <div className="movie-info-meta">
              <div className="movie-info-item">
                <span className="movie-info-label">개봉일:</span>
                <span className="movie-info-value">
                  {formatDate(movie.release_date)}
                </span>
              </div>
              <div className="movie-info-item">
                <span className="movie-info-label">상영시간:</span>
                <span className="movie-info-value">
                  {formatRuntime(movie.runtime)}
                </span>
              </div>
              {movie.genres && movie.genres.length > 0 && (
                <div className="movie-info-item">
                  <span className="movie-info-label">장르:</span>
                  <div className="movie-info-genres">
                    {movie.genres.map((genre, index) => (
                      <span key={index} className="movie-genre-tag">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 리뷰 작성 폼 */}
      <div className="review-form-section">
        {/* 제목 입력 */}
        <div className="review-form-item">
          <label className="review-form-label">
            제목 <span className="required">*</span>
          </label>
          <Input
            data={boardReviewTitle}
            setData={setBoardReviewTitle}
            type="text"
            placeholder="리뷰 제목을 입력하세요 (1~200자)"
            className="review-title-input"
            onChange={handleTitleChange}
          />
          {titleError && <div className="review-form-error">{titleError}</div>}
          <div className="review-form-help">
            {boardReviewTitle.length} / 200자
          </div>
        </div>

        {/* 평점 입력 */}
        <div className="review-form-item">
          <label className="review-form-label">
            평점 <span className="required">*</span>
          </label>
          <select
            className="review-rating-select"
            value={boardReviewRating || ""}
            onChange={handleRatingChange}
          >
            <option value="">평점을 선택하세요</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <option key={rating} value={rating}>
                {rating}점
              </option>
            ))}
          </select>
          {boardReviewRating && (
            <div className="review-rating-display">
              선택한 평점: {boardReviewRating}점
            </div>
          )}
        </div>

        {/* 내용 입력 */}
        <div className="review-form-item">
          <label className="review-form-label">
            내용 <span className="required">*</span>
          </label>
          <TextEditor
            data={boardReviewContent}
            setData={setBoardReviewContent}
            url={backServer + "/board/review/editor"}
          />
        </div>

        {/* 첨부파일 */}
        <div className="review-form-item">
          <label className="review-form-label">첨부파일</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="review-file-input"
          />

          {/* 기존 파일 목록 (수정 시에만 표시) */}
          {type === "modify" && (
            <div className="review-file-list">
              <div className="review-file-list-title">기존 첨부파일</div>
              {fileList.map((file, index) => {
                const fileName =
                  typeof file === "string" ? file : file.boardFilename;
                const fileNo =
                  typeof file === "string" ? null : file.boardFileNo;

                return (
                  <div
                    key={"existing-" + index}
                    className="review-file-item existing-file"
                  >
                    <span>{fileName}</span>
                    {fileNo && (
                      <button
                        type="button"
                        onClick={() => {
                          // delFileNo 배열에 현재 파일번호 추가
                          setDelFileNo([...delFileNo, fileNo]);
                          // 화면에서 파일 삭제 -> fileList에서 해당 file을 제거
                          const newFileList = fileList.filter((item) => {
                            return item !== file;
                          });
                          setFileList(newFileList);
                        }}
                        className="file-delete-btn"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 새로 추가한 파일 목록 */}
          <div className="review-file-list">
            {type === "modify" && (
              <div className="review-file-list-title">새로 추가한 파일</div>
            )}
            {newFileList.map((fileName, index) => (
              <div key={"new-" + index} className="review-file-item new-file">
                {fileName}
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="review-form-buttons">
          <Button
            text={type === "write" ? "작성 완료" : "수정 완료"}
            type="primary"
            onClick={buttonFunction}
            disabled={!isSubmitEnabled}
          />
          <Button text="취소" type="secondary" onClick={cancelFunction} />
        </div>
      </div>
    </div>
  );
};

export default ReviewFrm;
