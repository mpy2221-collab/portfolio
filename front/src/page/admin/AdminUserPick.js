import { useState, useEffect } from "react";
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
} from "../../component/StatisticsCharts";
import "./admin.css";
import Pagination from "../../component/Pagination";

const AdminUserPick = () => {
  const navigate = useNavigate();
  const backServer = process.env.REACT_APP_BACK_SERVER;

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

  // 통계 영역 (전체 통계) state
  const [statistics, setStatistics] = useState({
    totalCount: 0,
    activeCount: 0,
    inactiveCount: 0,
    averageViewCount: 0,
    reviewedMovieCount: 0,
    averageReviewCount: 0,
    totalReviewCount: 0,
    genreDistribution: [],
    topViewedMovies: [],
    topReviewedMovies: [],
  });

  // 유저픽 영화 리스트 state
  const [movies, setMovies] = useState([]);

  // 페이지네이션 state
  const [pageInfo, setPageInfo] = useState(null);
  const [reqPage, setReqPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // 검색 관련 state
  const [searchType, setSearchType] = useState("genre"); // "genre", "title", "status"
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [searchStatus, setSearchStatus] = useState(""); // "", "1" (활성), "2" (비활성)
  const [searchMode, setSearchMode] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  // 통계 영역 (전체 통계) 조회
  useEffect(() => {
    axios
      .get(backServer + "/admin/user-pick/statistics")
      .then((res) => {
        if (res.data.message === "success") {
          console.log(res.data.data);
          setStatistics(res.data.data);
        }
      })
      .catch((err) => {
        console.error("통계 조회 실패:", err);
      });
  }, [backServer]);

  // 유저픽 영화 목록 조회
  useEffect(() => {
    let url = backServer + "/admin/user-pick/list/" + reqPage;

    // 검색 모드일 때
    if (searchMode && searchParams) {
      url = backServer + "/admin/user-pick/search";
      url += "?searchType=" + searchParams.searchType;
      url += "&reqPage=" + reqPage;

      if (searchParams.searchType === "title") {
        url += "&keyword=" + encodeURIComponent(searchParams.keyword);
      } else if (searchParams.searchType === "genre") {
        url += "&genreId=" + searchParams.genreId;
      } else if (searchParams.searchType === "status") {
        url += "&status=" + searchParams.status;
      }
    }

    axios
      .get(url)
      .then((res) => {
        if (res.data.message === "success") {
          const movieList = res.data.data.userPickMovieList || [];
          console.log(movieList);
          setMovies(movieList);
          setPageInfo(res.data.data.pi);
        }
      })
      .catch((err) => {
        console.error("유저픽 영화 목록 조회 실패:", err);
      });
  }, [reqPage, searchMode, searchParams, backServer, refreshKey]);

  // 검색 타입 변경 시 검색어 초기화
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchKeyword("");
    setSearchGenre("");
    setSearchStatus("");
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

    if (searchType === "status" && searchStatus === "") {
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
      status: searchType === "status" ? searchStatus : null,
    });
    setReqPage(1);
  };

  // 검색 초기화
  const handleResetSearch = () => {
    setSearchMode(false);
    setSearchParams(null);
    setSearchKeyword("");
    setSearchGenre("");
    setSearchStatus("");
    setReqPage(1);
  };

  return (
    <div className="admin-user-pick-wrap">
      {/* 헤더 */}
      <div className="admin-user-pick-header">
        <h2 className="admin-user-pick-title">유저픽 영화 관리</h2>
        <p className="admin-user-pick-subtitle">
          전체 유저픽 영화를 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 통계 영역 (전체 통계) */}
      <div className="admin-user-pick-statistics">
        <h3 className="statistics-section-title">전체 통계</h3>
        <StatisticsBox
          statistics={[
            {
              label: "전체 유저픽 영화",
              value: `${statistics.totalCount || 0}개`,
            },
            {
              label: "활성 영화",
              value: `${statistics.activeCount || 0}개`,
            },
            {
              label: "비활성 영화",
              value: `${statistics.inactiveCount || 0}개`,
            },
            {
              label: "평균 조회수",
              value: `${
                statistics.averageViewCount
                  ? statistics.averageViewCount.toFixed(1)
                  : "0.0"
              }회`,
            },
            {
              label: "리뷰가 작성된 영화",
              value: `${statistics.reviewedMovieCount || 0}개`,
            },
            {
              label: "영화당 평균 리뷰",
              value: `${
                statistics.averageReviewCount
                  ? statistics.averageReviewCount.toFixed(1)
                  : "0.0"
              }개`,
            },
            {
              label: "총 리뷰 수",
              value: `${statistics.totalReviewCount || 0}개`,
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

        {/* 가장 많이 조회된 영화 TOP 5 */}
        {statistics.topViewedMovies &&
          statistics.topViewedMovies.length > 0 && (
            <div className="top-movies-section">
              <h4 className="top-movies-title">가장 많이 조회된 영화 TOP 5</h4>
              <div className="top-movies-list">
                {statistics.topViewedMovies.map((movie, index) => (
                  <div
                    key={movie.movieNo || movie.MOVIENO || index}
                    className="top-movie-item"
                    onClick={() =>
                      navigate(
                        `/board/user-pick/view/${movie.tmdbMovieId || movie.TMDBMOVIEID}`
                      )
                    }
                  >
                    <span className="top-movie-rank">{index + 1}</span>
                    <span className="top-movie-title">
                      {movie.movieTitle || movie.MOVIETITLE || "-"}
                    </span>
                    <span className="top-movie-count">
                      조회수:{" "}
                      {(movie.viewCount || movie.VIEWCOUNT || 0).toLocaleString()}
                      회
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* 가장 많은 리뷰가 작성된 영화 TOP 5 */}
        {statistics.topReviewedMovies &&
          statistics.topReviewedMovies.length > 0 && (
            <div className="top-movies-section">
              <h4 className="top-movies-title">
                가장 많은 리뷰가 작성된 영화 TOP 5
              </h4>
              <div className="top-movies-list">
                {statistics.topReviewedMovies.map((movie, index) => (
                  <div
                    key={movie.movieNo || movie.MOVIENO || index}
                    className="top-movie-item"
                    onClick={() =>
                      navigate(
                        `/board/user-pick/view/${movie.tmdbMovieId || movie.TMDBMOVIEID}`
                      )
                    }
                  >
                    <span className="top-movie-rank">{index + 1}</span>
                    <span className="top-movie-title">
                      {movie.movieTitle || movie.MOVIETITLE || "-"}
                    </span>
                    <span className="top-movie-count">
                      리뷰:{" "}
                      {(movie.reviewCount || movie.REVIEWCOUNT || 0).toLocaleString()}
                      개
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* 검색 영역 */}
      <div className="admin-user-pick-search">
        <div className="admin-user-pick-search-container">
          <div className="search-type-select">
            <select
              className="search-type-select-input"
              value={searchType}
              onChange={handleSearchTypeChange}
            >
              <option value="genre">장르</option>
              <option value="title">영화 제목</option>
              <option value="status">상태</option>
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
            ) : searchType === "genre" ? (
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
            ) : (
              <SearchSelect
                data={searchStatus}
                setData={setSearchStatus}
                options={[
                  { value: "", label: "상태를 선택하세요" },
                  { value: "1", label: "활성" },
                  { value: "2", label: "비활성" },
                  { value: "0", label: "전체" },
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

      {/* 유저픽 영화 리스트 */}
      <div className="admin-user-pick-list">
        {movies.length === 0 ? (
          <div className="no-movies-message">
            {searchMode
              ? "검색 결과가 없습니다."
              : "유저픽 영화가 없습니다."}
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie, index) => (
              <AdminUserPickItem
                key={movie.userpickMovieNo || index}
                movie={movie}
                setMovies={setMovies}
                setReqPage={setReqPage}
                navigate={navigate}
                setRefreshKey={setRefreshKey}
              />
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {pageInfo && (
        <div className="admin-user-pick-pagination">
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

// 유저픽 영화 아이템 컴포넌트
const AdminUserPickItem = ({ movie, setMovies, setReqPage, navigate, setRefreshKey }) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [movieStatus, setMovieStatus] = useState(movie.userpickMovieStatus || 1);

  useEffect(() => {
    setMovieStatus(movie.userpickMovieStatus || 1);
  }, [movie.userpickMovieStatus]);

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
    if (!rating || rating === 0) return null;
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

  // 상태 변경
  const handleStatusChange = (e) => {
    const newStatus = parseInt(e.target.value);
    const statusText = newStatus === 1 ? "활성" : "비활성";

    axios
      .patch(backServer + "/admin/user-pick/status", {
        movieNo: movie.userpickMovieNo,
        status: newStatus,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setMovieStatus(newStatus);
          Swal.fire({
            title: "변경 완료",
            text: "상태가 변경되었습니다.",
            icon: "success",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
        } else {
          Swal.fire({
            title: "변경 실패",
            text: "상태 변경에 실패했습니다.",
            icon: "error",
            confirmButtonText: "확인",
            confirmButtonColor: "#1a1a1a",
          });
          // 실패 시 원래 값으로 되돌리기
          setMovieStatus(movie.userpickMovieStatus || 1);
        }
      })
      .catch((err) => {
        console.error("상태 변경 실패:", err);
        Swal.fire({
          title: "변경 실패",
          text: "서버 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#1a1a1a",
        });
        // 실패 시 원래 값으로 되돌리기
        setMovieStatus(movie.userpickMovieStatus || 1);
      });
  };

  // 유저픽 영화 삭제
  const handleDeleteMovie = () => {
    Swal.fire({
      title: "유저픽 영화 삭제",
      text: `정말로 "${movie.userpickMovieTitle}" 영화를 삭제하시겠습니까?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(backServer + "/admin/user-pick/" + movie.userpickMovieNo)
          .then((res) => {
            if (res.data.message === "success") {
              Swal.fire({
                title: "삭제 완료",
                text: "유저픽 영화가 삭제되었습니다.",
                icon: "success",
                confirmButtonText: "확인",
                confirmButtonColor: "#1a1a1a",
              });
              // 목록에서 제거
              setMovies((prevMovies) =>
                prevMovies.filter((m) => m.userpickMovieNo !== movie.userpickMovieNo)
              );
              // 리스트 새로고침
              setReqPage(1);
              setRefreshKey((prev) => prev + 1);
            } else {
              Swal.fire({
                title: "삭제 실패",
                text: "유저픽 영화 삭제에 실패했습니다.",
                icon: "error",
                confirmButtonText: "확인",
                confirmButtonColor: "#1a1a1a",
              });
            }
          })
          .catch((err) => {
            console.error("유저픽 영화 삭제 실패:", err);
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

  return (
    <div className="movie-card">
      <div
        className="movie-poster"
        onClick={() =>
          navigate(
            `/board/user-pick/view/${movie.userpickMovieTmdbMovieId}`
          )
        }
      >
        <img
          src={getPosterUrl(movie.userpickMoviePosterPath)}
          alt={movie.userpickMovieTitle || "영화 포스터"}
          className="movie-poster-img"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
      </div>
      <div className="movie-info">
        <h3
          className="movie-title"
          onClick={() =>
            navigate(
              `/board/user-pick/view/${movie.userpickMovieTmdbMovieId}`
            )
          }
        >
          {movie.userpickMovieTitle || "제목 없음"}
        </h3>
        <p className="movie-release-date">
          {formatDate(movie.userpickMovieReleaseDate)}
        </p>
        {/* 유저 평점 */}
        {movie.userpickMovieRating !== undefined && movie.userpickMovieRating > 0 && (
          <div className="movie-rating">
            {renderRating(movie.userpickMovieRating)}
          </div>
        )}
        {/* 조회수 */}
        <div className="movie-view-count">
          조회수: {movie.userpickMovieViewCount?.toLocaleString() || 0}
          회
        </div>
        {/* 리뷰 수 */}
        <div className="movie-review-count">
          리뷰 수: {movie.reviewCount?.toLocaleString() || 0}개
        </div>
        {/* 상태 변경 */}
        <div className="movie-status">
          <select
            value={movieStatus}
            onChange={handleStatusChange}
            className="movie-status-select"
          >
            <option value={1}>활성</option>
            <option value={2}>비활성</option>
          </select>
        </div>
        {/* 등록일 */}
        <div className="movie-date">
          등록일: {formatDate(movie.userpickMovieDate)}
        </div>
        {/* 삭제 버튼 */}
        <div className="movie-delete">
          <button
            className="delete-movie-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteMovie();
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPick;
