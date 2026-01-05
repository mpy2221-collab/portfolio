import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer as PieResponsiveContainer,
} from "recharts";
import Swal from "sweetalert2";
import Comment from "../../../component/Comment";

const UserPickView = (props) => {
  const isLogin = props.isLogin;
  const memberId = props.memberId;
  const params = useParams();
  const movieId = params.movieId;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [hasReview, setHasReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);

  // 심플 리뷰 작성 폼 state
  const [simpleRating, setSimpleRating] = useState("");
  const [simpleContent, setSimpleContent] = useState("");
  const [showSimpleForm, setShowSimpleForm] = useState(false);

  // 심플 리뷰 수정 폼 state
  const [editingReviewNo, setEditingReviewNo] = useState(null);
  const [editingRating, setEditingRating] = useState("");
  const [editingContent, setEditingContent] = useState("");

  // 리뷰 목록 state
  const [simpleReviews, setSimpleReviews] = useState([]);
  const [boardReviews, setBoardReviews] = useState([]);

  // 차트 색상
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#8dd1e1",
    "#d084d0",
  ];

  useEffect(() => {
    // 영화 정보 조회 (TMDB API)
    axios
      .get(backServer + "/api/popular/view/" + movieId)
      .then((res) => {
        if (res.data.message === "success" && res.data.data.movie) {
          setMovie(res.data.data.movie);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("영화 정보 조회 실패:", err);
        setLoading(false);
      });

    // 조회수 증가 및 통계 정보 조회 (통합 API)
    axios
      .get(backServer + "/board/user-pick/view/" + movieId)
      .then((res) => {
        if (res.data.message === "success") {
          const data = res.data.data;
          console.log(data);
          // 조회수 설정
          if (data.viewCount !== undefined) {
            setViewCount(data.viewCount);
          }
          // 통계 정보 설정
          if (data.statistics) {
            setStatistics(data.statistics);
          } else {
            // 통계 정보가 없을 경우 빈 객체로 설정
            setStatistics({
              simpleReview: {
                count: 0,
                averageRating: 0,
                ratingDistribution: Array(10)
                  .fill(0)
                  .map((_, i) => ({ rating: i + 1, count: 0 })),
              },
              boardReview: {
                count: 0,
                averageRating: 0,
                ratingDistribution: Array(10)
                  .fill(0)
                  .map((_, i) => ({ rating: i + 1, count: 0 })),
              },
              total: {
                count: 0,
                averageRating: 0,
                ratingDistribution: Array(10)
                  .fill(0)
                  .map((_, i) => ({ rating: i + 1, count: 0 })),
              },
            });
          }
        }
      })
      .catch((err) => {
        console.error("조회수 증가 및 통계 정보 조회 실패:", err);
        // 에러 발생 시 빈 통계 객체로 설정
        setStatistics({
          simpleReview: {
            count: 0,
            averageRating: 0,
            ratingDistribution: Array(10)
              .fill(0)
              .map((_, i) => ({ rating: i + 1, count: 0 })),
          },
          boardReview: {
            count: 0,
            averageRating: 0,
            ratingDistribution: Array(10)
              .fill(0)
              .map((_, i) => ({ rating: i + 1, count: 0 })),
          },
          total: {
            count: 0,
            averageRating: 0,
            ratingDistribution: Array(10)
              .fill(0)
              .map((_, i) => ({ rating: i + 1, count: 0 })),
          },
        });
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

    // 심플 리뷰 목록 조회
    axios
      .get(backServer + "/simple/review/list/" + movieId)
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data.data);
          setSimpleReviews(res.data.data);
        }
      })
      .catch((err) => {
        console.error("심플 리뷰 목록 조회 실패:", err);
      });

    // 게시판 리뷰 목록 조회
    axios
      .get(backServer + "/board/review/list/by-movie/" + movieId)
      .then((res) => {
        if (res.data.message === "success") {
          console.log("게시판 리뷰 목록 조회 성공:", res.data.data);
          setBoardReviews(res.data.data);
        }
      })
      .catch((err) => {
        console.error("게시판 리뷰 목록 조회 실패:", err);
      });
  }, [movieId, backServer, isLogin, hasReview]);

  // 포스터 이미지 URL 생성
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return "https://via.placeholder.com/500x750?text=No+Image";
    return "https://image.tmdb.org/t/p/w500" + posterPath;
  };

  // 배경 이미지 URL 생성
  const getBackdropUrl = (backdropPath) => {
    if (!backdropPath) return "";
    return "https://image.tmdb.org/t/p/original" + backdropPath;
  };

  // 프로필 이미지 URL 생성
  const getProfileUrl = (profilePath) => {
    if (!profilePath) return "/image/default.png";
    return backServer + "/member/profile/" + profilePath;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    if (typeof dateString === "string" && dateString.includes("T")) {
      return dateString.split("T")[0];
    }
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

  // 평점 분포 데이터 포맷팅
  const formatRatingDistribution = (distribution) => {
    if (!distribution || !Array.isArray(distribution)) return [];
    return distribution.map((item) => {
      // 대문자 키(RATING, COUNT) 또는 소문자 키(rating, count) 모두 처리
      const rating = item.RATING !== undefined ? item.RATING : item.rating;
      const count = item.COUNT !== undefined ? item.COUNT : item.count;
      return {
        rating: `${rating}점`,
        count: count || 0,
      };
    });
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
      simpleReviewTmdbMovieId: parseInt(movieId),
      simpleReviewRating: parseInt(simpleRating),
      simpleReviewContent: simpleContent.trim(),
      movieTitle: movie.title,
      moviePosterPath: movie.poster_path,
      movieReleaseDate: movie.release_date,
      movieRuntime: movie.runtime,
      simpleReviewGenres: movie.genres || [],
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
            setHasReview(true);
            setShowSimpleForm(false);
            setSimpleRating("");
            setSimpleContent("");

            // 리뷰 목록 다시 조회
            axios
              .get(backServer + "/simple/review/list/" + movieId)
              .then((res) => {
                if (res.data.message === "success") {
                  setSimpleReviews(res.data.data);
                }
              })
              .catch((err) => {
                console.error("심플 리뷰 목록 조회 실패:", err);
              });
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

  // 심플 리뷰 수정 시작
  const handleEditSimpleReview = (review) => {
    setEditingReviewNo(review.simpleReviewNo);
    setEditingRating(review.simpleReviewRating.toString());
    setEditingContent(review.simpleReviewContent);
  };

  // 심플 리뷰 수정 취소
  const handleCancelEdit = () => {
    setEditingReviewNo(null);
    setEditingRating("");
    setEditingContent("");
  };

  // 심플 리뷰 수정 제출
  const handleSubmitEdit = () => {
    if (!editingRating || editingRating === "") {
      Swal.fire({
        title: "입력 오류",
        text: "평점을 선택해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (!editingContent || editingContent.trim() === "") {
      Swal.fire({
        title: "입력 오류",
        text: "소감을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const reviewData = {
      simpleReviewRating: parseInt(editingRating),
      simpleReviewContent: editingContent.trim(),
      simpleReviewNo: editingReviewNo,
    };

    axios
      .put(backServer + "/simple/review", reviewData)
      .then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "리뷰가 수정되었습니다.",
            text: "",
            icon: "success",
            confirmButtonText: "확인",
          }).then(() => {
            setSimpleReviews((prevReviews) => 
              prevReviews.map((review,index) =>
              review.simpleReviewNo === editingReviewNo ? {
                ...review,
                simpleReviewRating: parseInt(editingRating),
                simpleReviewContent: editingContent.trim(),
              } : review
            ))
            setEditingReviewNo(null);
            setEditingRating("");
            setEditingContent("");
            
         
          });
        } else {
          Swal.fire({
            title: "리뷰 수정 실패",
            text: res.data.message || "리뷰 수정에 실패했습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        }
      })
      .catch((err) => {
        console.error("심플 리뷰 수정 실패:", err);
        Swal.fire({
          title: "리뷰 수정 실패",
          text: "서버 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      });
  };

  // 심플 리뷰 삭제
  const handleDeleteSimpleReview = (reviewNo) => {
    Swal.fire({
      title: "리뷰 삭제",
      text: "정말 삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(backServer + "/simple/review/" + reviewNo)
          .then((res) => {
            if (res.data.message === "success") {
              Swal.fire({
                title: "삭제 완료",
                text: "리뷰가 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인",
              }).then(() => {
                setSimpleReviews((prevReviews) => 
                  prevReviews.filter((review) => review.simpleReviewNo !== reviewNo)
                );
                setHasReview(false);

              });
            }
          })
          .catch((err) => {
            console.error("리뷰 삭제 실패:", err);
            Swal.fire({
              title: "오류",
              text: "리뷰 삭제 중 오류가 발생했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          });
      }
    });
  };

  // 게시글 내용 일부만 표시
  const truncateContent = (content, maxLength = 100) => {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="userpick-view-wrap">
        <div className="userpick-view-loading">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="userpick-view-wrap">
        <div className="userpick-view-error">
          <p>영화 정보를 불러올 수 없습니다.</p>
          <button onClick={() => navigate("/board/user-pick/list")}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="userpick-view-wrap">
      {/* 배경 이미지 섹션 */}
      {movie.backdrop_path && (
        <div
          className="userpick-view-backdrop"
          style={{
            backgroundImage: "url(" + getBackdropUrl(movie.backdrop_path) + ")",
          }}
        >
          <div className="backdrop-overlay"></div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="userpick-view-container">
        {/* 영화 기본 정보 섹션 */}
        <div className="userpick-view-main-info">
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
              <div className="meta-item">
                <span className="meta-label">조회수</span>
                <span className="meta-value">
                  {formatVoteCount(viewCount)}회
                </span>
              </div>
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

        {/* 사용자 평가 통계 섹션 */}
        {statistics && (
          <div className="user-review-statistics-section">
            <h2 className="statistics-title">사용자 평가 통계</h2>

            {/* 심플 리뷰 통계 */}
            <div className="statistics-box">
              <h3>심플 리뷰</h3>
              <div className="statistics-info">
                <p>심플 리뷰 수: {statistics.simpleReview?.count || 0}개</p>
                <p>
                  심플 평균 평점:{" "}
                  {formatRating(statistics.simpleReview?.averageRating || 0)}점
                </p>
              </div>

              {/* 심플 리뷰 평점 분포 막대 그래프 */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={formatRatingDistribution(
                    statistics.simpleReview?.ratingDistribution
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 게시판 리뷰 통계 */}
            <div className="statistics-box">
              <h3>게시판 리뷰</h3>
              <div className="statistics-info">
                <p>게시판 리뷰 수: {statistics.boardReview?.count || 0}개</p>
                <p>
                  게시판 평균 평점:{" "}
                  {formatRating(statistics.boardReview?.averageRating || 0)}점
                </p>
              </div>

              {/* 게시판 리뷰 평점 분포 막대 그래프 */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={formatRatingDistribution(
                    statistics.boardReview?.ratingDistribution
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 통합 통계 */}
            <div className="statistics-box">
              <h3>통합 통계</h3>
              <div className="statistics-info">
                <p>전체 리뷰 수: {statistics.total?.count || 0}개</p>
                <p>
                  전체 평균 평점:{" "}
                  {formatRating(statistics.total?.averageRating || 0)}점
                </p>
                <p>심플 리뷰 수: {statistics.simpleReview?.count || 0}개</p>
                <p>게시판 리뷰 수: {statistics.boardReview?.count || 0}개</p>
              </div>

              {/* 통합 평점 분포 원형 그래프 */}
              <PieResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={formatRatingDistribution(
                      statistics.total?.ratingDistribution
                    )}
                    dataKey="count"
                    nameKey="rating"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    innerRadius={60}
                    label={({ rating, count, percent }) => {
                      // count가 0보다 큰 경우만 레이블 표시
                      if (count > 0) {
                        return `${rating} (${(percent * 100).toFixed(1)}%)`;
                      }
                      return null;
                    }}
                    labelLine={false}
                  >
                    {formatRatingDistribution(
                      statistics.total?.ratingDistribution
                    ).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}개`, name]} />
                  <Legend
                    formatter={(value) => value}
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </PieResponsiveContainer>
            </div>
          </div>
        )}

        {/* 리뷰 작성 섹션 (로그인하고 리뷰를 작성하지 않은 경우만) */}
        {isLogin && !hasReview && (
          <div className="userpick-view-review-section">
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
                  <button className="submit-btn" onClick={submitSimpleReview}>
                    작성 완료
                  </button>
                  <button className="cancel-btn" onClick={toggleSimpleForm}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="review-buttons">
                <button className="review-btn" onClick={toggleSimpleForm}>
                  심플 리뷰 작성
                </button>
                <button className="review-btn" onClick={goToBoardReviewWrite}>
                  게시글 리뷰 작성
                </button>
              </div>
            )}

            <p className="review-note">
              * 리뷰는 영화당 한 번만 작성 가능합니다.
            </p>
          </div>
        )}

        {/* 리뷰 작성 완료 메시지 (리뷰를 이미 작성한 경우) */}
        {isLogin && hasReview && (
          <div className="userpick-view-review-section">
            <h2 className="review-section-title">리뷰 작성 완료</h2>
            <p className="review-complete-message">
              이 영화에 대한 리뷰를 이미 작성하셨습니다.
            </p>
            {!hasReview && (
              <button className="review-btn" onClick={goToBoardReviewWrite}>
                게시글 리뷰 작성
              </button>
            )}
          </div>
        )}

        {/* 심플 리뷰 목록 섹션 */}
        {simpleReviews.length > 0 && (
          <div className="simple-review-list-section">
            <h2 className="review-section-title">심플 리뷰</h2>
            <div className="simple-review-list">
              {simpleReviews.map((review, index) => (
                <div key={index} className="simple-review-item">
                  <div className="review-author-info">
                    <img
                      src={getProfileUrl(review.memberProfileImg)}
                      alt={review.memberNickname}
                      className="review-author-img"
                    />
                    <span className="review-author-name">
                      {review.memberNickname}
                    </span>
                  </div>

                  {editingReviewNo === review.simpleReviewNo ? (
                    // 수정 폼
                    <div className="simple-review-edit-form">
                      <div className="form-group">
                        <label className="form-label">평점 (1~10점)</label>
                        <select
                          className="rating-select"
                          value={editingRating}
                          onChange={(e) => setEditingRating(e.target.value)}
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
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          placeholder="영화에 대한 소감을 입력해주세요. (최대 500자)"
                          maxLength={500}
                          rows={5}
                        />
                        <div className="char-count">
                          {editingContent.length} / 500
                        </div>
                      </div>

                      <div className="form-buttons">
                        <button
                          className="submit-btn"
                          onClick={handleSubmitEdit}
                        >
                          수정 완료
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 일반 표시
                    <>
                      <div className="review-rating">
                        {renderRating(review.simpleReviewRating)}
                      </div>
                      <div className="review-content">
                        {review.simpleReviewContent}
                      </div>
                      <div className="review-date">
                        {formatDate(review.simpleReviewDate)}
                      </div>
                      {isLogin && memberId === review.simpleReviewMemberId && (
                        <div className="review-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditSimpleReview(review)}
                          >
                            수정
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteSimpleReview(review.simpleReviewNo)
                            }
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 게시판 리뷰 표시 섹션 */}
        {boardReviews.length > 0 && (
          <div className="board-review-list-section">
            <h2 className="review-section-title">게시판 리뷰</h2>
            <div className="board-review-list">
              {boardReviews.map((review, index) => (
                <div key={index} className="board-review-item">
                  <h3 className="review-title">{review.boardReviewTitle}</h3>
                  <div className="review-author-info">
                    <img
                      src={getProfileUrl(review.memberProfileImg)}
                      alt={review.memberNickname}
                      className="review-author-img"
                    />
                    <span className="review-author-name">
                      {review.memberNickname}
                    </span>
                  </div>
                  <div className="review-rating">
                    {renderRating(review.boardReviewRating)}
                  </div>
                  <div
                    className="review-content-preview board-review-content"
                    style={{
                      color: "#ffffff",
                      backgroundColor: "transparent",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: truncateContent(review.boardReviewContent),
                    }}
                  />
                  <div className="review-meta">
                    <span className="review-date">
                      {formatDate(review.boardReviewDate)}
                    </span>
                    <span className="review-like-count">
                      추천: {review.likeCount || 0}
                    </span>
                  </div>
                  <button
                    className="view-detail-btn"
                    onClick={() =>
                      navigate("/board/review/view/" + review.boardReviewNo)
                    }
                  >
                    자세히 보기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 댓글 영역 */}
        <Comment
          commentType="userpick"
          targetNo={parseInt(movieId)}
          isLogin={isLogin}
          memberId={memberId}
          backServer={backServer}
        />

        {/* 기능 버튼 */}
        <div className="userpick-view-actions">
          <button onClick={() => navigate("/board/user-pick/list")}>
            유저픽 리스트로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPickView;
