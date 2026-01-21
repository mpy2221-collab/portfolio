import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  SearchInput,
  SearchSelect,
  SearchButton,
} from "../../component/FormFrm";
import {
  StatisticsBox,
  GenreDistributionDonutChart,
  GenreDistributionBarChart,
  RatingDistributionBarChart,
} from "../../component/StatisticsCharts";
import "./admin.css";
import Pagination from "../../component/Pagination";

const AdminBoardReview = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const userStatisticsRef = useRef(null); // 통계 영역 2로 스크롤하기 위한 ref

  // TMDB 장르 목록 (한국어)
  const TMDB_GENRES = [
    { id: 28, name: "액션" },
    { id: 12, name: "모험" },
    { id: 16, name: "애니메이션" },
    { id: 35, name: "코미디" },
    { id: 80, name: "범죄" },
    { id: 99, name: "다큐멘터리" },
    { id: 18, name: "드라마" },
    { id: 10751, name: "가족" },
    { id: 14, name: "판타지" },
    { id: 36, name: "역사" },
    { id: 27, name: "공포" },
    { id: 10402, name: "음악" },
    { id: 9648, name: "미스터리" },
    { id: 10749, name: "로맨스" },
    { id: 878, name: "SF" },
    { id: 10770, name: "TV 영화" },
    { id: 53, name: "스릴러" },
    { id: 10752, name: "전쟁" },
    { id: 37, name: "서부" },
  ];

  // 통계 영역 1 (전체 유저 통계) state
  const [allStatistics, setAllStatistics] = useState({
    totalCount: 0,
    averageRating: 0,
    genreDistribution: [],
    ratingDistribution: [],
  });

  // 통계 영역 2 (특정 유저 통계) state
  const [userSearchKeyword, setUserSearchKeyword] = useState("");
  const [userStatistics, setUserStatistics] = useState({
    totalCount: 0,
    averageRating: 0,
    genreDistribution: [],
    ratingDistribution: [],
  });
  const [searchedUserId, setSearchedUserId] = useState("");

  // 게시글 리뷰 리스트 state
  const [reviews, setReviews] = useState([]);

  // 페이지네이션 state
  const [pageInfo, setPageInfo] = useState(null);
  const [reqPage, setReqPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // 검색 관련 state
  const [searchType, setSearchType] = useState("genre"); // "genre", "title", "user"
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  // 통계 영역 1 (전체 유저 통계) 조회
  useEffect(() => {
    axios
      .get(backServer + "/admin/board-review/statistics/all")
      .then((res) => {
        if (res.data.message === "success") {
          setAllStatistics(res.data.data);
        }
      })
      .catch((err) => {
        console.error("전체 통계 조회 실패:", err);
      });
  }, [backServer]);

  // 게시글 리뷰 목록 조회
  useEffect(() => {
    let url = backServer + "/admin/board-review/list/" + reqPage;

    // 검색 모드일 때
    if (searchMode && searchParams) {
      url = backServer + "/admin/board-review/search";
      url += "?searchType=" + searchParams.searchType;
      url += "&reqPage=" + reqPage;

      if (searchParams.searchType === "title") {
        url += "&keyword=" + encodeURIComponent(searchParams.keyword);
      } else if (searchParams.searchType === "genre") {
        url += "&genreId=" + searchParams.genreId;
      } else if (searchParams.searchType === "user") {
        url += "&keyword=" + encodeURIComponent(searchParams.keyword);
      }
    }

    axios
      .get(url)
      .then((res) => {
        if (res.data.message === "success") {
          const reviewList = res.data.data.boardReviewList || [];
          setReviews(reviewList);
          setPageInfo(res.data.data.pi);
        }
      })
      .catch((err) => {
        console.error("게시글 리뷰 목록 조회 실패:", err);
      });
  }, [reqPage, searchMode, searchParams, backServer, refreshKey]);

  // 유저 통계 검색
  const handleUserSearch = () => {
    if (userSearchKeyword.trim() === "") {
      Swal.fire({
        title: "검색어를 입력하세요",
        text: "유저 아이디 또는 닉네임을 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#1a1a1a",
      });
      return;
    }

    axios
      .get(backServer + "/admin/board-review/statistics/user", {
        params: { keyword: userSearchKeyword },
      })
      .then((res) => {
        if (res.data.message === "success") {
          setUserStatistics(res.data.data.statistics);
          setSearchedUserId(res.data.data.memberId);
        } else if (res.data.message === "not_found") {
          Swal.fire({
            title: "유저를 찾을 수 없습니다",
            text: "해당 유저를 찾을 수 없습니다.",
            icon: "error",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
          setUserStatistics({
            totalCount: 0,
            averageRating: 0,
            genreDistribution: [],
            ratingDistribution: [],
          });
          setSearchedUserId("");
        }
      })
      .catch((err) => {
        console.error("유저 통계 조회 실패:", err);
        Swal.fire({
          title: "유저를 찾을 수 없습니다",
          text: "해당 유저를 찾을 수 없습니다.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#1a1a1a",
        });
        setUserStatistics({
          totalCount: 0,
          averageRating: 0,
          genreDistribution: [],
          ratingDistribution: [],
        });
        setSearchedUserId("");
      });
  };

  // 작성자 클릭 시 해당 유저 통계로 스크롤 및 검색
  const handleAuthorClick = (memberId) => {
    setUserSearchKeyword(memberId);
    // 통계 영역 2로 스크롤
    if (userStatisticsRef.current) {
      userStatisticsRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // 통계 조회는 useEffect로 처리하지 않고 직접 호출
    // 검색어가 설정된 후 통계 조회
    setTimeout(() => {
      handleUserSearch();
    }, 100);
  };

  // 검색 타입 변경 시 검색어 초기화
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchKeyword("");
    setSearchGenre("");
  };

  // 검색 실행
  const handleSearch = () => {
    // 검색어가 없으면 검색 모드 해제
    if (searchType === "title" && searchKeyword.trim() === "") {
      setSearchMode(false);
      setSearchParams(null);
      setReqPage(1);
      return;
    }

    if (searchType === "genre" && searchGenre === "") {
      setSearchMode(false);
      setSearchParams(null);
      setReqPage(1);
      return;
    }

    if (searchType === "user" && searchKeyword.trim() === "") {
      setSearchMode(false);
      setSearchParams(null);
      setReqPage(1);
      return;
    }

    // 검색 모드 활성화
    setSearchMode(true);
    setSearchParams({
      searchType,
      keyword: searchType === "title" || searchType === "user" ? searchKeyword : null,
      genreId: searchType === "genre" ? searchGenre : null,
    });
    setReqPage(1);
  };

  // 검색 초기화
  const handleResetSearch = () => {
    setSearchMode(false);
    setSearchParams(null);
    setSearchKeyword("");
    setSearchGenre("");
    setReqPage(1);
  };

  // 게시글 리뷰 삭제
  const handleDeleteReview = (reviewNo, reviewTitle) => {
    Swal.fire({
      title: "게시글 리뷰 삭제",
      text: `정말로 "${reviewTitle}" 리뷰를 삭제하시겠습니까?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(backServer + "/admin/board-review/" + reviewNo)
          .then((res) => {
            if (res.data.message === "success") {
              Swal.fire({
                title: "삭제 완료",
                text: "게시글 리뷰가 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인",
                confirmButtonColor: "#1a1a1a",
              });
              // 리스트 새로고침
              setReqPage(1);
              setRefreshKey((prev) => prev + 1);
            } else {
              Swal.fire({
                title: "삭제 실패",
                text: "게시글 리뷰 삭제에 실패했습니다.",
                icon: "error",
                confirmButtonText: "확인",
                confirmButtonColor: "#1a1a1a",
              });
            }
          })
          .catch((err) => {
            console.error("게시글 리뷰 삭제 실패:", err);
            Swal.fire({
              title: "삭제 실패",
              text: "서버 오류가 발생했습니다.",
              icon: "error",
              confirmButtonText: "확인",
              confirmButtonColor: "#1a1a1a",
            });
          });
      }
    });
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // 영화 포스터 URL
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return "https://via.placeholder.com/300x450?text=No+Image";
    return "https://image.tmdb.org/t/p/w300" + posterPath;
  };

  // 평점 표시 (별점)
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 10 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="rating-stars">
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={i} className="star full">
              ★
            </span>
          ))}
        {hasHalfStar && <span className="star half">★</span>}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <span key={i} className="star empty">
              ☆
            </span>
          ))}
        <span className="rating-number">({rating.toFixed(1)}점)</span>
      </div>
    );
  };

  return (
    <div className="admin-board-review-wrap">
      {/* 헤더 */}
      <div className="admin-board-review-header">
        <h2 className="admin-board-review-title">게시글 리뷰 관리</h2>
        <p className="admin-board-review-subtitle">
          전체 게시글 리뷰를 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 통계 영역 1 (전체 유저 통계) */}
      <div className="admin-board-review-statistics-all">
        <h3 className="statistics-section-title">전체 유저 통계</h3>
        <StatisticsBox
          statistics={[
            {
              label: "전체 게시글 리뷰",
              value: `${allStatistics.totalCount || 0}개`,
            },
            {
              label: "전체 평균 평점",
              value: `${
                allStatistics.averageRating
                  ? allStatistics.averageRating.toFixed(1)
                  : "0.0"
              }점`,
            },
          ]}
        />

        {/* 전체 장르별 분포 차트 */}
        {allStatistics.genreDistribution &&
          allStatistics.genreDistribution.length > 0 && (
            <div className="statistics-charts">
              <GenreDistributionDonutChart
                genreDistribution={allStatistics.genreDistribution}
              />
              <GenreDistributionBarChart
                genreDistribution={allStatistics.genreDistribution}
              />
            </div>
          )}
      </div>

      {/* 통계 영역 2 (특정 유저 통계) */}
      <div className="admin-board-review-statistics-user" ref={userStatisticsRef}>
        <h3 className="statistics-section-title">특정 유저 통계</h3>
        <div className="user-search-area">
          <div className="user-search-input">
            <SearchInput
              data={userSearchKeyword}
              setData={setUserSearchKeyword}
              placeholder="유저 아이디 또는 닉네임을 입력하세요"
              onSearch={handleUserSearch}
            />
          </div>
          <div className="user-search-button">
            <SearchButton text="검색" onClick={handleUserSearch} />
          </div>
        </div>

        {searchedUserId && (
          <>
            <StatisticsBox
              statistics={[
                {
                  label: "작성한 게시글 리뷰",
                  value: `${userStatistics.totalCount || 0}개`,
                },
                {
                  label: "평균 평점",
                  value: `${
                    userStatistics.averageRating
                      ? userStatistics.averageRating.toFixed(1)
                      : "0.0"
                  }점`,
                },
              ]}
            />

            {/* 해당 유저 장르별 분포 차트 */}
            {userStatistics.genreDistribution &&
              userStatistics.genreDistribution.length > 0 && (
                <div className="statistics-charts">
                  <GenreDistributionDonutChart
                    genreDistribution={userStatistics.genreDistribution}
                  />
                  <GenreDistributionBarChart
                    genreDistribution={userStatistics.genreDistribution}
                  />
                </div>
              )}
          </>
        )}
      </div>

      {/* 검색 영역 */}
      <div className="admin-board-review-search">
        <div className="admin-board-review-search-container">
          <div className="search-type-select">
            <select
              className="search-type-select-input"
              value={searchType}
              onChange={handleSearchTypeChange}
            >
              <option value="genre">장르</option>
              <option value="title">영화 제목</option>
              <option value="user">유저 아이디/닉네임</option>
            </select>
          </div>

          <div className="search-input-area">
            {searchType === "title" || searchType === "user" ? (
              <SearchInput
                data={searchKeyword}
                setData={setSearchKeyword}
                placeholder={
                  searchType === "title"
                    ? "영화 제목을 입력하세요"
                    : "유저 아이디 또는 닉네임을 입력하세요"
                }
                onSearch={handleSearch}
              />
            ) : (
              <SearchSelect
                data={searchGenre}
                setData={setSearchGenre}
                options={[
                  { value: "", label: "장르를 선택하세요" },
                  ...TMDB_GENRES.map((genre) => ({
                    value: genre.id.toString(),
                    label: genre.name,
                  })),
                ]}
                onSearch={handleSearch}
              />
            )}
          </div>

          <div className="search-button-area">
            <SearchButton text="검색" onClick={handleSearch} />
            {searchMode && (
              <SearchButton
                text="초기화"
                onClick={handleResetSearch}
                className="search-reset-btn"
              />
            )}
          </div>
        </div>
      </div>

      {/* 게시글 리뷰 리스트 */}
      <div className="admin-board-review-list">
        {reviews.length === 0 ? (
          <div className="no-reviews-message">
            {searchMode
              ? "검색 결과가 없습니다."
              : "게시글 리뷰가 없습니다."}
          </div>
        ) : (
          <div className="review-grid">
            {reviews.map((review, index) => (
              <div
                key={review.boardReviewNo || index}
                className="review-card"
              >
                <div
                  className="review-poster"
                  onClick={() =>
                    navigate(`/board/review/view/${review.boardReviewNo}`)
                  }
                >
                  <img
                    src={getPosterUrl(review.moviePosterPath)}
                    alt={review.movieTitle || "영화 포스터"}
                    className="movie-poster"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x450?text=No+Image";
                    }}
                  />
                </div>
                <div className="review-info">
                  <h3
                    className="review-movie-title"
                    onClick={() =>
                      navigate(`/board/review/view/${review.boardReviewNo}`)
                    }
                  >
                    {review.movieTitle || "제목 없음"}
                  </h3>
                  <p className="review-movie-date">
                    {formatDate(review.movieReleaseDate)}
                  </p>
                  {/* 장르 태그 */}
                  {review.userpickMovieGenres &&
                    review.userpickMovieGenres.length > 0 && (
                      <div className="movie-genres">
                        {review.userpickMovieGenres
                          .map((genre, idx) => (
                            <span key={idx} className="genre-tag">
                              {genre.userpickGenreName}
                            </span>
                          ))}
                      </div>
                    )}
                  {/* 리뷰 제목 */}
                  <h4
                    className="review-title"
                    onClick={() =>
                      navigate(`/board/review/view/${review.boardReviewNo}`)
                    }
                  >
                    {review.boardReviewTitle || "제목 없음"}
                  </h4>
                  {/* 작성자 */}
                  <div className="review-author">
                    작성자:{" "}
                    <span
                      className="author-link"
                      onClick={() =>
                        handleAuthorClick(review.boardReviewMemberId)
                      }
                    >
                      {review.boardReviewMemberId || "-"}
                    </span>
                  </div>
                  {/* 평점 */}
                  <div className="review-rating">
                    {renderRating(review.boardReviewRating || 0)}
                  </div>
                  {/* 리뷰 내용 */}
                  <div className="review-content">
                    {review.boardReviewContent
                      ? review.boardReviewContent
                          .replace(/<[^>]*>/g, "")
                          .length > 100
                        ? review.boardReviewContent
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 100) + "..."
                        : review.boardReviewContent.replace(/<[^>]*>/g, "")
                      : "-"}
                  </div>
                  {/* 조회수 및 좋아요 */}
                  <div className="review-meta">
                    {review.boardReviewViewCount !== undefined && (
                      <span className="review-view-count">
                        조회수: {review.boardReviewViewCount.toLocaleString()}회
                      </span>
                    )}
                    {review.likeCount !== undefined && (
                      <span className="review-like-count">
                        좋아요: {review.likeCount.toLocaleString()}개
                      </span>
                    )}
                  </div>
                  {/* 작성일 */}
                  <div className="review-date">
                    작성일:{" "}
                    {formatDate(
                      review.boardReviewEnrollDate || review.boardReviewDate
                    )}
                  </div>
                  {/* 삭제 버튼 */}
                  <div className="review-delete">
                    <button
                      className="delete-review-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReview(
                          review.boardReviewNo,
                          review.boardReviewTitle
                        );
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {pageInfo && (
        <div className="admin-board-review-pagination">
          <Pagination
            pageInfo={pageInfo}
            reqPage={reqPage}
            setReqPage={setReqPage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminBoardReview;
