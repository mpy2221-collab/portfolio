import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import "./member.css";
import Pagination from "../../component/Pagination";

const MemberSimpleReview = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const tmdbImageUrl = "https://image.tmdb.org/t/p/w500";

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

  // State
  const [statistics, setStatistics] = useState({
    totalCount: 0,
    averageRating: 0,
    genreDistribution: [],
    ratingDistribution: [],
  });
  const [reviews, setReviews] = useState([]);

  // 페이지네이션 state
  const [pageInfo, setPageInfo] = useState(null);
  const [reqPage, setReqPage] = useState(1);

  // 검색 관련 state
  const [searchType, setSearchType] = useState("title"); // "title" or "genre"
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [searchMode, setSearchMode] = useState(false); // 검색 모드 여부
  const [searchParams, setSearchParams] = useState(null); // 검색 파라미터

  // 통계 데이터 조회
  useEffect(() => {
    axios
      .get(backServer + "/member/simple-review/statistics")
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data.data);
          setStatistics(res.data.data);
        }
      })
      .catch((err) => {
        console.error("통계 조회 실패:", err);
      });
  }, []);

  // 심플 리뷰 목록 조회
  useEffect(() => {
    let url = backServer + "/member/simple-review/list/" + reqPage;

    // 검색 모드일 때
    if (searchMode && searchParams) {
      url = backServer + "/member/simple-review/search";
      url += "?searchType=" + searchParams.searchType;
      url += "&reqPage=" + reqPage;

      if (searchParams.searchType === "title") {
        url += "&keyword=" + encodeURIComponent(searchParams.keyword);
      } else {
        url += "&genreId=" + searchParams.genreId;
      }
    }

    axios
      .get(url)
      .then((res) => {
        if (res.data.message === "success") {
          console.log("심플 리뷰 목록:", res.data.data);
          const reviewList = res.data.data.simpleReviewList || [];
          console.log("첫 번째 리뷰:", reviewList[0]);
          if (reviewList[0]) {
            console.log("moviePosterPath:", reviewList[0].moviePosterPath);
          }
          setReviews(reviewList);
          setPageInfo(res.data.data.pi);
        }
      })
      .catch((err) => {
        console.error("심플 리뷰 목록 조회 실패:", err);
      });
  }, [reqPage, searchMode, searchParams, backServer]);

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

    // 검색 모드 활성화
    setSearchMode(true);
    setSearchParams({
      searchType,
      keyword: searchType === "title" ? searchKeyword : null,
      genreId: searchType === "genre" ? searchGenre : null,
    });
    setReqPage(1); // 검색 시 첫 페이지로
  };

  // 검색 초기화 (일반 모드로 돌아가기)
  const handleResetSearch = () => {
    setSearchMode(false);
    setSearchParams(null);
    setSearchKeyword("");
    setSearchGenre("");
    setReqPage(1);
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
    <div className="member-simple-review-wrap">
      {/* 헤더 */}
      <div className="member-simple-review-header">
        <h2 className="member-simple-review-title">심플 리뷰</h2>
        <p className="member-simple-review-subtitle">
          내가 작성한 심플 리뷰를 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 통계 영역 */}
      <div className="member-simple-review-statistics">
        <StatisticsBox
          statistics={[
            {
              label: "작성한 심플 리뷰",
              value: `${statistics.totalCount || 0}개`,
            },
            {
              label: "평균 평점",
              value: `${
                statistics.averageRating
                  ? statistics.averageRating.toFixed(1)
                  : "0.0"
              }점`,
            },
          ]}
        />

        {/* 장르별 분포 차트 */}
        {statistics.genreDistribution &&
          statistics.genreDistribution.length > 0 && (
            <div className="statistics-charts">
              <GenreDistributionDonutChart
                genreDistribution={statistics.genreDistribution}
              />
              <GenreDistributionBarChart
                genreDistribution={statistics.genreDistribution}
              />
            </div>
          )}

        {/* 평점 분포 막대 그래프 */}
        {statistics.ratingDistribution &&
          statistics.ratingDistribution.length > 0 && (
            <div className="statistics-charts">
              <RatingDistributionBarChart
                ratingDistribution={statistics.ratingDistribution}
              />
            </div>
          )}
      </div>

      {/* 검색 영역 */}
      <div className="member-simple-review-search">
        <div className="member-simple-review-search-container">
          <div className="search-type-select">
            <select
              className="search-type-select-input"
              value={searchType}
              onChange={handleSearchTypeChange}
            >
              <option value="title">영화 제목</option>
              <option value="genre">장르</option>
            </select>
          </div>

          <div className="search-input-area">
            {searchType === "title" ? (
              <SearchInput
                data={searchKeyword}
                setData={setSearchKeyword}
                placeholder="영화 제목을 입력하세요"
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

      {/* 심플 리뷰 리스트 */}
      <div className="member-simple-review-list">
        {reviews.length === 0 ? (
          <div className="no-reviews-message">
            {searchMode
              ? "검색 결과가 없습니다."
              : "작성한 심플 리뷰가 없습니다."}
          </div>
        ) : (
          <div className="review-grid">
            {reviews.map((review, index) => (
              <div
                key={review.simpleReviewNo || index}
                className="review-card"
                onClick={() =>
                  navigate(
                    `/board/user-pick/view/${review.simpleReviewTmdbMovieId}`
                  )
                }
              >
                <div className="review-poster">
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
                  <h3 className="review-movie-title">
                    {review.movieTitle || "제목 없음"}
                  </h3>
                  <p className="review-movie-date">
                    {formatDate(review.movieReleaseDate)}
                  </p>
                  {/* 장르 태그 */}
                  {review.simpleReviewGenres &&
                    review.simpleReviewGenres.length > 0 && (
                      <div className="movie-genres">
                        {review.simpleReviewGenres
                          .slice(0, 3)
                          .map((genre, idx) => (
                            <span key={idx} className="genre-tag">
                              {genre.userpickGenreName}
                            </span>
                          ))}
                      </div>
                    )}
                  {/* 평점 */}
                  <div className="review-rating">
                    {renderRating(review.simpleReviewRating || 0)}
                  </div>
                  {/* 리뷰 내용 */}
                  <div className="review-content">
                    {review.simpleReviewContent
                      ? review.simpleReviewContent.length > 100
                        ? review.simpleReviewContent.substring(0, 100) + "..."
                        : review.simpleReviewContent
                      : "-"}
                  </div>
                  {/* 작성일 */}
                  <div className="review-date">
                    작성일:{" "}
                    {formatDate(
                      review.simpleReviewEnrollDate || review.simpleReviewDate
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {pageInfo && (
        <div className="member-simple-review-pagination">
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

export default MemberSimpleReview;
