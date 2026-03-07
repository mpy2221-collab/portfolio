import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import "./default.css";

const Main = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const tmdbImageUrl = "https://image.tmdb.org/t/p/w500";

  // State
  const [popularMovies, setPopularMovies] = useState([]);
  const [userPickMovies, setUserPickMovies] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  // 드래그 감지를 위한 ref
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // React Slick 설정 (인기 영화)
  const popularSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    centerMode: false,
    centerPadding: '0px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      }
    ]
  };

  // React Slick 설정 (유저픽 영화)
  const userPickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    centerMode: false,
    centerPadding: '0px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        }
      }
    ]
  };

  // 인기 영화 TOP 5 조회 (TMDB의 인기도 순위 기준)
  useEffect(() => {
    axios
      .get(backServer + "/main/popular/top5")
      .then((res) => {
        if (res.data.message === "success") {
          setPopularMovies(res.data.data);
        } else {
          console.error("인기 영화 조회 실패:", res.data.message);
          setPopularMovies([]);
        }
      })
      .catch((err) => {
        console.error("인기 영화 조회 실패:", err);
        setPopularMovies([]);
      });
  }, [backServer]);

  // 인기 유저픽 영화 TOP 5 조회
  useEffect(() => {
    axios
      .get(backServer + "/main/user-pick/top5")
      .then((res) => {
        if (res.data.message === "success") {
          setUserPickMovies(res.data.data);
        } else {
          console.error("유저픽 영화 조회 실패:", res.data.message);
          setUserPickMovies([]);
        }
      })
      .catch((err) => {
        console.error("유저픽 영화 조회 실패:", err);
        setUserPickMovies([]);
      });
  }, [backServer]);

  // 최근 리뷰 게시글 조회
  useEffect(() => {
    axios
      .get(backServer + "/main/recent-reviews")
      .then((res) => {
        if (res.data.message === "success") {
          setRecentReviews(res.data.data);
        } else {
          console.error("최근 리뷰 조회 실패:", res.data.message);
          setRecentReviews([]);
        }
      })
      .catch((err) => {
        console.error("최근 리뷰 조회 실패:", err);
        setRecentReviews([]);
      });
  }, [backServer]);

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // 영화 포스터 URL
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return "https://via.placeholder.com/500x750?text=No+Image";
    return tmdbImageUrl + posterPath;
  };

  // 드래그 시작 감지
  const handleMouseDown = (e) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
  };

  // 드래그 중 감지
  const handleMouseMove = (e) => {
    if (dragStartRef.current.x !== 0 || dragStartRef.current.y !== 0) {
      const deltaX = Math.abs(e.clientX - dragStartRef.current.x);
      const deltaY = Math.abs(e.clientY - dragStartRef.current.y);
      if (deltaX > 5 || deltaY > 5) {
        isDraggingRef.current = true;
      }
    }
  };

  // 클릭 처리 (드래그가 아닐 때만)
  const handleCardClick = (e, navigatePath) => {
    if (!isDraggingRef.current) {
      navigate(navigatePath);
    }
    // 리셋
    dragStartRef.current = { x: 0, y: 0 };
    isDraggingRef.current = false;
  };

  // 평점 표시 (별점) - 10점 스케일을 5개 별로 변환, 안전하게 클램핑
  const renderRating = (rating) => {
    const safeRating = Number.isFinite(rating)
      ? Math.min(Math.max(rating, 0), 10)
      : 0;
    if (safeRating === 0) return "평점 없음";

    const fiveStarBase = safeRating / 2;
    const fullStars = Math.floor(fiveStarBase);
    const hasHalfStar = fiveStarBase % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
      <div className="main-rating-stars">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={i} className="main-star main-star-full">
              ★
            </span>
          ))}
        {hasHalfStar && (
          <span className="main-star main-star-half">★</span>
        )}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <span key={i} className="main-star main-star-empty">
              ☆
            </span>
          ))}
        <span className="main-rating-number">
          ({safeRating.toFixed(1)} / 10)
        </span>
      </div>
    );
  };

  return (
    <div className="main-wrap">
      {/* 히어로 섹션 */}
      <section className="main-hero">
        <div className="main-hero-content">
          <h1 className="main-hero-title">영화를 추천하고 리뷰를 공유하세요</h1>
          <p className="main-hero-subtitle">
            유저들의 리뷰로 추천받는 영화 커뮤니티입니다. 나만의 영화를 발견하고,
            <br />
            다른 사용자들과 리뷰를 공유해보세요.
          </p>
          <div
            className="main-hero-test-info"
            style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.95 }}
          >
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>※ 포트폴리오 프로젝트</strong> · 테스트 계정으로 로그인해
              이용해 보실 수 있습니다.
            </p>
            <p style={{ marginBottom: "0.25rem" }}>
              <strong>일반 회원</strong> user01 / 1234, user02 / 1234 → 인기
              영화·유저픽 조회, 심플/게시글 리뷰 작성·댓글 등
            </p>
            <p style={{ marginBottom: "0.25rem" }}>
              <strong>관리자</strong> admin / 1234 → 일반 회원 기능에 더해
              유저픽·리뷰 관리·리뷰 통계 확인·회원 관리 등 관리자 페이지 이용
              가능
            </p>
          </div>
          <button
            className="main-hero-button"
            style={{ marginTop: "1.5rem" }}
            onClick={() => navigate("/board/popular/list")}
          >
            인기 영화 보기
          </button>
        </div>
      </section>

      {/* 인기 영화 TOP 5 */}
      <section className="main-section">
        <div className="main-section-header">
          <h2 className="main-section-title">인기 영화 TOP 5</h2>
          <button
            className="main-section-more-btn"
            onClick={() => navigate("/board/popular/list")}
          >
            더보기
          </button>
        </div>
        {popularMovies.length > 0 ? (
          <div className="main-carousel-container">
            <Slider {...popularSettings}>
              {popularMovies.map((movie, index) => (
                <div key={movie.id} className="main-carousel-slide">
                  <div
                    className="main-movie-card"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={(e) => handleCardClick(e, `/board/popular/view/${movie.id}`)}
                  >
                    <div className="main-movie-poster">
                      <div className="main-movie-rank-badge">
                        {index + 1}
                      </div>
                      <img
                        src={getPosterUrl(movie.poster_path)}
                        alt={movie.title || "영화 포스터"}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/500x750?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="main-movie-info">
                      <h3 className="main-movie-title">
                        {movie.title || "제목 없음"}
                      </h3>
                      <p className="main-movie-date">
                        {formatDate(movie.release_date)}
                      </p>
                      <div className="main-movie-rating">
                        {renderRating(movie.vote_average)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="main-empty-message">
            인기 영화 데이터를 불러오는 중...
          </div>
        )}
      </section>

      {/* 인기 유저픽 영화 TOP 5 */}
      <section className="main-section">
        <div className="main-section-header">
          <h2 className="main-section-title">인기 유저픽 영화 TOP 5</h2>
          <button
            className="main-section-more-btn"
            onClick={() => navigate("/board/user-pick/list")}
          >
            더보기
          </button>
        </div>
        {userPickMovies.length > 0 ? (
          <div className="main-carousel-container">
            <Slider {...userPickSettings}>
              {userPickMovies.map((movie, index) => (
                <div key={movie.userpickMovieNo || movie.tmdbMovieId} className="main-carousel-slide">
                  <div
                    className="main-movie-card"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={(e) =>
                      handleCardClick(
                        e,
                        `/board/user-pick/view/${movie.userpickMovieTmdbMovieId || movie.tmdbMovieId}`
                      )
                    }
                  >
                    <div className="main-movie-poster">
                      <div className="main-movie-rank-badge">
                        {index + 1}
                      </div>
                      <img
                        src={getPosterUrl(movie.userpickMoviePosterPath || movie.poster_path)}
                        alt={movie.userpickMovieTitle || movie.title || "영화 포스터"}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/500x750?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="main-movie-info">
                      <h3 className="main-movie-title">
                        {movie.userpickMovieTitle || movie.title || "제목 없음"}
                      </h3>
                      <p className="main-movie-date">
                        {formatDate(
                          movie.userpickMovieReleaseDate || movie.release_date
                        )}
                      </p>
                      <div className="main-movie-rating">
                        {movie.userpickMovieRating
                          ? renderRating(movie.userpickMovieRating)
                          : movie.vote_average
                          ? renderRating(movie.vote_average)
                          : "평점 없음"}
                      </div>
                      {movie.userpickMovieReviewCount !== undefined && (
                        <p className="main-movie-review-count">
                          리뷰 {movie.userpickMovieReviewCount.toLocaleString()}개
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="main-empty-message">
            유저픽 영화 데이터를 불러오는 중...
          </div>
        )}
      </section>

      {/* 최근 리뷰 게시글 */}
      <section className="main-section">
        <div className="main-section-header">
          <h2 className="main-section-title">최근 리뷰 게시글</h2>
          <button
            className="main-section-more-btn"
            onClick={() => navigate("/board/review/list")}
          >
            더보기
          </button>
        </div>
        {recentReviews.length > 0 ? (
          <div className="main-review-list">
            {recentReviews.map((review) => (
              <div
                key={review.boardReviewNo}
                className="main-review-item"
                onClick={() => navigate(`/board/review/view/${review.boardReviewNo}`)}
              >
                <h3 className="main-review-title">
                  {review.boardReviewTitle || "제목 없음"}
                </h3>
                {review.movieTitle && (
                  <p className="main-review-movie-title">
                    영화: {review.movieTitle}
                  </p>
                )}
                <div className="main-review-meta">
                  <span className="main-review-author">
                    {review.memberNickname || review.boardReviewMemberId || "작성자"}
                  </span>
                  <span className="main-review-date">
                    {formatDate(review.boardReviewEnrollDate || review.boardReviewDate)}
                  </span>
                  {review.boardReviewViewCount !== undefined && (
                    <span className="main-review-view-count">
                      조회수: {review.boardReviewViewCount.toLocaleString()}회
                    </span>
                  )}
                  {review.likeCount !== undefined && (
                    <span className="main-review-like-count">
                      좋아요: {review.likeCount.toLocaleString()}개
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="main-empty-message">
            최근 리뷰 게시글이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
};

export default Main;
