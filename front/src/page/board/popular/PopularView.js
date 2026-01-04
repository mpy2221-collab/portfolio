import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Input } from "../../../component/FormFrm";
import Swal from "sweetalert2";
import "./popular.css";

const PopularView = (props) => {
  const isLogin = props.isLogin;
  const params = useParams();
  const movieId = params.movieId;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasReview, setHasReview] = useState(false);

  // 심플 리뷰 작성 폼 state
  const [simpleRating, setSimpleRating] = useState("");
  const [simpleContent, setSimpleContent] = useState("");
  const [showSimpleForm, setShowSimpleForm] = useState(false);

  useEffect(() => {
    // 영화 정보 조회 (공개 API)
    axios
      .get(backServer + "/api/popular/view/" + movieId)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success" && res.data.data.movie) {
          setMovie(res.data.data.movie);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("인기 영화 상세페이지 조회 실패:", err);
        setLoading(false);
      });

    // 로그인한 경우에만 리뷰 작성 여부 확인
    if (isLogin) {
      axios
        .get(backServer + "/simple/review/check/" + movieId)
        .then((res) => {
          if (res.data.message === "success") {
            setHasReview(res.data.data.hasReview);
          }
        })
        .catch((err) => {
          console.error("리뷰 작성 여부 확인 실패:", err);
        });
    }
  }, [movieId, backServer, isLogin]);

  // 포스터 이미지 URL 생성
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return "https://via.placeholder.com/500x750?text=No+Image";
    return "https://image.tmdb.org/t/p/w500" + posterPath;
  };

  // 배경 이미지 URL 생성
  const getBackdropUrl = (backdropPath) => {
    if (!backdropPath) return "";
    return "https://image.tmdb.org/t/p/w1280" + backdropPath;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dateString;
  };

  // 평점 포맷팅
  const formatRating = (rating) => {
    if (!rating) return "0.0";
    return rating.toFixed(1);
  };

  // 평가 수 포맷팅 (천 단위 콤마)
  const formatVoteCount = (count) => {
    if (!count) return "0";
    return count.toLocaleString();
  };

  // 상영시간 포맷팅
  const formatRuntime = (runtime) => {
    if (!runtime) return "-";
    return runtime + "분";
  };

  // 심플 리뷰 작성 폼 표시/숨김
  const toggleSimpleForm = () => {
    setShowSimpleForm(!showSimpleForm);
  };

  // 심플 리뷰 작성
  const submitSimpleReview = () => {
    if (!simpleRating || simpleRating === "") {
      Swal.fire({
        title: "입력 오류",
        text: "평점을 선택해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (!simpleContent || simpleContent.trim() === "") {
      Swal.fire({
        title: "입력 오류",
        text: "소감을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const reviewData = {
      // 심플 리뷰 정보
      simpleReviewTmdbMovieId: parseInt(movieId),
      simpleReviewRating: parseInt(simpleRating),
      simpleReviewContent: simpleContent.trim(),

      // 영화 정보 (userpick_movie에 저장용)
      movieTitle: movie.title,
      moviePosterPath: movie.poster_path,
      movieReleaseDate: movie.release_date,
      movieRuntime: movie.runtime,

      // 장르 정보 (userpick_genre에 저장용)
      simpleReviewGenres: movie.genres || [], // [{id: 28, name: "액션"}, ...]
    };

    axios
      .post(backServer + "/simple/review", reviewData)
      .then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "리뷰가 작성되었습니다.",
            text: "",
            icon: "success",
            confirmButtonText: "확인",
          }).then(() => {
            // 리뷰 작성 후 상태 업데이트
            setHasReview(true);
            setShowSimpleForm(false);
            setSimpleRating("");
            setSimpleContent("");
            // 페이지 새로고침하여 hasReview 상태 업데이트
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: "리뷰 작성 실패",
            text: res.data.message || "리뷰 작성에 실패했습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      })
      .catch((err) => {
        console.error("심플 리뷰 작성 실패:", err);
        Swal.fire({
          title: "리뷰 작성 실패",
          text: "서버 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  // 게시글 리뷰 작성 페이지로 이동
  const goToBoardReviewWrite = () => {
    navigate("/board/review/write/" + movieId);
  };

  

  if (loading) {
    return (
      <div className="popular-view-wrap">
        <div className="popular-view-loading">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="popular-view-wrap">
        <div className="popular-view-error">
          <p>영화 정보를 불러올 수 없습니다.</p>
          <Button
            text="목록으로 돌아가기"
            type="secondary"
            onClick={() => navigate("/board/popular/list")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="popular-view-wrap">
      {/* 배경 이미지 섹션 */}
      {movie.backdrop_path && (
        <div
          className="popular-view-backdrop"
          style={{
            backgroundImage: "url(" + getBackdropUrl(movie.backdrop_path) + ")",
          }}
        >
          <div className="backdrop-overlay"></div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="popular-view-container">
        {/* 영화 기본 정보 섹션 */}
        <div className="popular-view-main-info">
          <div className="movie-poster-section">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="movie-poster-large"
            />
          </div>

          <div className="movie-details-section">
            <h1 className="movie-title-large">{movie.title || "제목 없음"}</h1>
            {movie.original_title && movie.original_title !== movie.title && (
              <p className="movie-original-title">{movie.original_title}</p>
            )}

            <div className="movie-meta-info">
              <div className="meta-item">
                <span className="meta-label">개봉일</span>
                <span className="meta-value">
                  {formatDate(movie.release_date)}
                </span>
              </div>
              {movie.runtime && (
                <div className="meta-item">
                  <span className="meta-label">상영시간</span>
                  <span className="meta-value">
                    {formatRuntime(movie.runtime)}
                  </span>
                </div>
              )}
              {movie.genres && movie.genres.length > 0 && (
                <div className="meta-item genres">
                  <span className="meta-label">장르</span>
                  <div className="genre-tags">
                    {movie.genres.map((genre, index) => (
                      <span key={index} className="genre-tag-large">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="movie-rating-section">
              <div className="rating-item">
                <span className="rating-label">TMDB 평점</span>
                <div className="rating-value-large">
                  <span className="rating-icon-large">⭐</span>
                  <span className="rating-number">
                    {formatRating(movie.vote_average)} / 10
                  </span>
                </div>
                <span className="rating-count">
                  ({formatVoteCount(movie.vote_count)}명 평가)
                </span>
              </div>
            </div>

            {movie.overview && (
              <div className="movie-overview-section">
                <h3 className="overview-title">줄거리</h3>
                <p className="overview-text">{movie.overview}</p>
              </div>
            )}

            {/* 제작 정보 */}
            {(movie.production_companies?.length > 0 ||
              movie.production_countries?.length > 0) && (
              <div className="movie-production-section">
                {movie.production_companies?.length > 0 && (
                  <div className="production-item">
                    <span className="production-label">제작사</span>
                    <div className="production-list">
                      {movie.production_companies.map((company, index) => (
                        <span key={index} className="production-tag">
                          {company.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {movie.production_countries?.length > 0 && (
                  <div className="production-item">
                    <span className="production-label">제작 국가</span>
                    <div className="production-list">
                      {movie.production_countries.map((country, index) => (
                        <span key={index} className="production-tag">
                          {country.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 리뷰 작성 섹션 (로그인하고 리뷰를 작성하지 않은 경우만) */}
        {isLogin && !hasReview && (
          <div className="popular-view-review-section">
            <h2 className="review-section-title">리뷰 작성</h2>

            {/* 심플 리뷰 작성 폼 */}
            {showSimpleForm ? (
              <div className="simple-review-form">
                <div className="form-group">
                  <label className="form-label">평점 (1~10점)</label>
                  <select
                    className="rating-select"
                    value={simpleRating}
                    onChange={(e) => setSimpleRating(e.target.value)}
                  >
                    <option value="">평점 선택</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}점
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">소감</label>
                  <textarea
                    className="review-content-textarea"
                    value={simpleContent}
                    onChange={(e) => setSimpleContent(e.target.value)}
                    placeholder="영화에 대한 소감을 입력해주세요. (최대 500자)"
                    maxLength={500}
                    rows={5}
                  />
                  <div className="char-count">{simpleContent.length} / 500</div>
                </div>

                <div className="form-buttons">
                  <Button
                    text="작성 완료"
                    type="primary"
                    onClick={submitSimpleReview}
                    className="submit-btn"
                  />
                  <Button
                    text="취소"
                    type="secondary"
                    onClick={toggleSimpleForm}
                    className="cancel-btn"
                  />
                </div>
              </div>
            ) : (
              <div className="review-buttons">
                <Button
                  text="심플 리뷰 작성"
                  type="primary"
                  onClick={toggleSimpleForm}
                  className="review-btn"
                />
                <Button
                  text="게시글 리뷰 작성"
                  type="primary"
                  onClick={goToBoardReviewWrite}
                  className="review-btn"
                />
              </div>
            )}

            <p className="review-note">
              * 리뷰는 영화당 한 번만 작성 가능합니다.
            </p>
          </div>
        )}

        {/* 리뷰 작성 완료 메시지 (리뷰를 이미 작성한 경우) */}
        {isLogin && hasReview && (
          <div className="popular-view-review-section">
            <h2 className="review-section-title">리뷰 작성 완료</h2>
            <p className="review-complete-message">
              이 영화에 대한 리뷰를 이미 작성하셨습니다.
            </p>
          </div>
        )}

        {/* 목록으로 돌아가기 버튼 */}
        <div className="popular-view-actions">
          <Button
            text="목록으로 돌아가기"
            type="secondary"
            onClick={() => navigate("/board/popular/list")}
          />
        </div>
      </div>
    </div>
  );
};

export default PopularView;
