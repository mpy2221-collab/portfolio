import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Comment from "../../../component/Comment";
import "./review.css";

const ReviewView = (props) => {
  const isLogin = props.isLogin;
  const memberId = props.memberId;
  const memberType = props.memberType;
  const params = useParams();
  const boardReviewNo = params.boardReviewNo;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  const [boardReviewContent, setBoardReviewContent] = useState("");
  const [boardReviewDate, setBoardReviewDate] = useState("");
  const [boardReviewFiles, setBoardReviewFiles] = useState([]);
  const [boardReviewMemberId, setBoardReviewMemberId] = useState("");
  const [boardReviewMemberNickname, setBoardReviewMemberNickname] =
    useState("");
  const [boardReviewRating, setBoardReviewRating] = useState(0);
  const [boardReviewStatus, setBoardReviewStatus] = useState(1);
  const [boardReviewTitle, setBoardReviewTitle] = useState("");
  const [boardReviewTmdbMovieId, setBoardReviewTmdbMovieId] = useState(0);
  const [boardReviewViewCount, setBoardReviewViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [moviePosterPath, setMoviePosterPath] = useState("");
  const [movieReleaseDate, setMovieReleaseDate] = useState("");
  const [movieRuntime, setMovieRuntime] = useState(0);
  const [movieTitle, setMovieTitle] = useState("");
  const [profilePath, setProfilePath] = useState(null);
  const [userpickMovieGenres, setUserpickMovieGenres] = useState(null);
  const [userpickMovieNo, setUserpickMovieNo] = useState(0);
  const [userpickMovieReviewCount, setUserpickMovieReviewCount] = useState(0);
  const [boardComments, setBoardComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);
  const [movieDetail, setMovieDetail] = useState(null); // TMDB 상세 정보

  useEffect(() => {
    if (boardReviewNo) {
      // 게시글 정보 조회
      axios
        .get(backServer + "/board/review/view/" + boardReviewNo)
        .then((res) => {
          console.log("게시글 정보:", res.data);
          if (res.data.message === "success") {
            const data = res.data.data;

            // 게시글 정보 설정
            setBoardReviewContent(data.boardReviewContent || "");
            setBoardReviewDate(data.boardReviewDate || "");
            setBoardReviewFiles(data.boardReviewFiles || []);
            setBoardReviewMemberId(data.boardReviewMemberId || "");
            setBoardReviewRating(data.boardReviewRating || 0);
            setBoardReviewStatus(data.boardReviewStatus || 1);
            setBoardReviewTitle(data.boardReviewTitle || "");
            setBoardReviewTmdbMovieId(data.boardReviewTmdbMovieId || 0);
            setBoardReviewViewCount(data.boardReviewViewCount || 0);
            setBoardReviewMemberNickname(data.boardReviewMemberNickname || "");

            // 좋아요 정보
            setLikeCount(data.likeCount || 0);
            setLiked(data.liked || false);

            // 영화 정보
            setMoviePosterPath(data.moviePosterPath || "");
            setMovieReleaseDate(data.movieReleaseDate || "");
            setMovieRuntime(data.movieRuntime || 0);
            setMovieTitle(data.movieTitle || "");

            // 추가 정보
            setProfilePath(data.profilePath || null);
            setUserpickMovieGenres(data.userpickMovieGenres || null);
            setUserpickMovieNo(data.userpickMovieNo || 0);
            setUserpickMovieReviewCount(data.userpickMovieReviewCount || 0);
            setBoardComments(data.boardComments || []);

            // 작성자 확인
            if (isLogin && memberId === data.boardReviewMemberId) {
              console.log("작성자 확인 성공");
              setIsAuthor(true);
            }

            // TMDB 영화 상세 정보 조회
            if (data.boardReviewTmdbMovieId) {
              axios
                .get(
                  backServer +
                    "/api/popular/view/" +
                    data.boardReviewTmdbMovieId
                )
                .then((movieRes) => {
                  if (
                    movieRes.data.message === "success" &&
                    movieRes.data.data.movie
                  ) {
                    setMovieDetail(movieRes.data.data.movie);
                  }
                })
                .catch((err) => {
                  console.error("영화 상세 정보 조회 실패:", err);
                });
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("게시글 조회 실패:", err);
          Swal.fire({
            title: "오류",
            text: "게시글을 불러올 수 없습니다.",
            icon: "error",
            confirmButtonText: "확인",
          }).then(() => {
            navigate("/board/review/list");
          });
        });
    }
  }, [boardReviewNo, backServer, navigate, isLogin, memberId]);

  // 포스터 이미지 URL 생성
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return "https://via.placeholder.com/500x750?text=No+Image";
    // posterPath가 이미 전체 URL인 경우
    if (posterPath.startsWith("http")) {
      return posterPath;
    }
    // 상대 경로인 경우 TMDB URL 추가
    return "https://image.tmdb.org/t/p/w500" + posterPath;
  };

  // 프로필 이미지 URL 생성
  const getProfileUrl = (profilePath) => {
    if (!profilePath) return "/image/default.png";
    return backServer + "/member/profile/" + profilePath;
  };

  // 배경 이미지 URL 생성
  const getBackdropUrl = (backdropPath) => {
    if (!backdropPath) return "";
    return "https://image.tmdb.org/t/p/w1280" + backdropPath;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    if (typeof dateString === "string" && dateString.includes("T")) {
      return dateString.split("T")[0];
    }
    return dateString;
  };

  // 평점 표시 (별점)
  const renderRating = (rating) => {
    if (!rating) return "0점";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = "";
    for (let i = 0; i < fullStars; i++) {
      stars += "★";
    }
    if (hasHalfStar) {
      stars += "☆";
    }
    return stars + " " + rating + "점";
  };

  // 파일 다운로드
  const handleFileDownload = (boardFileNo, boardFilename) => {
    axios
      .get(backServer + "/board/review/file/" + boardFileNo, {
        responseType: "blob",
      })
      .then((res) => {
        const blob = new Blob([res.data]);
        const fileObjectURL = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = fileObjectURL;
        link.style.display = "none";

        link.download = boardFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(fileObjectURL);
      })
      .catch((err) => {
        console.error("파일 다운로드 실패:", err);
        Swal.fire({
          title: "오류",
          text: "파일 다운로드 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  // 추천 토글
  const toggleLike = () => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인 필요",
        text: "추천 기능은 로그인 후 사용할 수 있습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    axios
      .post(backServer + "/board/review/like/" + boardReviewNo)
      .then((res) => {
        if (res.data.message === "success") {
          console.log("추천 처리 성공");
          setLiked(!liked);
          setLikeCount(liked ? likeCount - 1 : likeCount + 1);
        } else {
          console.log("추천 처리 실패");
          Swal.fire({
            title: "오류",
            text: "추천 처리 중 오류가 발생했습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      })
      .catch((err) => {
        console.error("추천 처리 실패:", err);
        Swal.fire({
          title: "오류",
          text: "추천 처리 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  // 수정 페이지로 이동
  const handleModify = () => {
    navigate(
      "/board/review/modify/" + boardReviewNo + "/" + boardReviewTmdbMovieId
    );
  };

  // 삭제 처리
  const handleDelete = () => {
    Swal.fire({
      title: "게시글 삭제",
      text: "정말 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(backServer + "/board/review/" + boardReviewNo)
          .then((res) => {
            if (res.data.message === "success") {
              Swal.fire({
                title: "삭제 완료",
                text: "게시글이 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인",
              }).then(() => {
                navigate("/board/review/list");
              });
            } else {
              Swal.fire({
                title: "삭제 실패",
                text: res.data.message || "게시글 삭제에 실패했습니다.",
                icon: "error",
                confirmButtonText: "확인",
              });
            }
          })
          .catch((err) => {
            console.error("게시글 삭제 실패:", err);
            Swal.fire({
              title: "오류",
              text: "게시글 삭제 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          });
      }
    });
  };

  // 영화 상세 페이지로 이동
  const goToMovieDetail = () => {
    if (boardReviewTmdbMovieId) {
      navigate("/board/user-pick/view/" + boardReviewTmdbMovieId);
    }
  };

  if (loading) {
    return (
      <div className="review-view-wrap">
        <div className="loading-container">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!boardReviewTitle) {
    return (
      <div className="review-view-wrap">
        <div className="error-container">
          <p>게시글을 찾을 수 없습니다.</p>
          <button onClick={() => navigate("/board/review/list")}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-view-wrap">
      {/* 배경 이미지 섹션 */}
      {movieDetail && movieDetail.backdrop_path && (
        <div
          className="review-view-backdrop"
          style={{
            backgroundImage:
              "url(" + getBackdropUrl(movieDetail.backdrop_path) + ")",
          }}
        >
          <div className="backdrop-overlay"></div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="review-view-container">
        {/* 게시글 정보 섹션 */}
        <div className="review-info-section">
          <div className="review-header">
            <h1 className="review-title">{boardReviewTitle}</h1>
            <div className="review-meta">
              <div className="review-author">
                <img
                  src={getProfileUrl(profilePath)}
                  alt={boardReviewMemberNickname}
                  className="author-profile-img"
                />
                <span className="author-label">작성자:</span>
                <span className="author-name">{boardReviewMemberNickname}</span>
              </div>
              <div className="review-date">
                <span className="date-label">작성일:</span>
                <span className="date-value">
                  {formatDate(boardReviewDate)}
                </span>
              </div>
              <div className="review-view-count">
                <span className="view-label">조회수:</span>
                <span className="view-value">{boardReviewViewCount}</span>
              </div>
              <div className="review-rating">
                <span className="rating-label">평점:</span>
                <span className="rating-value">
                  {renderRating(boardReviewRating)}
                </span>
              </div>
            </div>
          </div>

          {/* 수정/삭제 버튼 (작성자 본인 또는 관리자만) */}
          {(isAuthor || memberType === 1) && (
            <div className="review-actions">
              <button className="modify-btn" onClick={handleModify}>
                수정
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 영화 정보 섹션 */}
        {movieTitle && (
          <div className="movie-info-section">
            <img
              src={getPosterUrl(moviePosterPath)}
              alt={movieTitle}
              className="movie-poster-img"
              onClick={goToMovieDetail}
            />
            <div className="movie-details">
              <h2 className="movie-title" onClick={goToMovieDetail}>
                {movieTitle}
              </h2>
              {movieDetail &&
                movieDetail.original_title &&
                movieDetail.original_title !== movieTitle && (
                  <p className="movie-original-title">
                    {movieDetail.original_title}
                  </p>
                )}
              <div className="movie-meta">
                <span className="movie-release-date">
                  개봉일: {formatDate(movieReleaseDate)}
                </span>
                {movieRuntime > 0 && (
                  <span className="movie-runtime">
                    상영시간: {movieRuntime}분
                  </span>
                )}
                {movieDetail &&
                  movieDetail.genres &&
                  movieDetail.genres.length > 0 && (
                    <div className="movie-genres">
                      <span className="genres-label">장르:</span>
                      <div className="genre-tags">
                        {movieDetail.genres.map((genre, index) => (
                          <span key={index} className="genre-tag">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
              {movieDetail && movieDetail.vote_average && (
                <div className="movie-rating-info">
                  <span className="rating-label">TMDB 평점:</span>
                  <span className="rating-value">
                    ⭐ {movieDetail.vote_average.toFixed(1)} / 10
                  </span>
                  {movieDetail.vote_count && (
                    <span className="rating-count">
                      ({movieDetail.vote_count.toLocaleString()}명 평가)
                    </span>
                  )}
                </div>
              )}
              {movieDetail && movieDetail.overview && (
                <div className="movie-overview">
                  <h3 className="overview-title">줄거리</h3>
                  <p className="overview-text">{movieDetail.overview}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 게시글 내용 섹션 */}
        <div className="review-content-section">
          <div
            className="review-content"
            dangerouslySetInnerHTML={{ __html: boardReviewContent }}
          />

          {/* 첨부파일 */}
          {boardReviewFiles && boardReviewFiles.length > 0 && (
            <div className="review-files">
              <h3>첨부파일</h3>
              <ul className="file-list">
                {boardReviewFiles.map((file, index) => (
                  <li key={index} className="file-item">
                    <span className="file-name">{file.boardFilename}</span>
                    <button
                      className="download-btn"
                      onClick={() =>
                        handleFileDownload(file.boardFileNo, file.boardFilename)
                      }
                    >
                      다운로드
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 추천 기능 */}
        <div className="review-like-section">
          <button
            className={"like-btn " + (liked ? "liked" : "")}
            onClick={toggleLike}
            disabled={!isLogin}
          >
            <span className="like-icon">{liked ? "❤️" : "🤍"}</span>
            <span className="like-text">{liked ? "추천 취소" : "추천"}</span>
            <span className="like-count">({likeCount})</span>
          </button>
        </div>

        {/* 댓글 영역 */}
        <Comment
          commentType="board"
          targetNo={boardReviewNo}
          isLogin={isLogin}
          memberId={memberId}
          backServer={backServer}
        />
      </div>
    </div>
  );
};

export default ReviewView;
