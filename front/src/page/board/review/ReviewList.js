import { useEffect, useState } from "react";
import Pagination from "../../../component/Pagination";
import {
  SearchInput,
  SearchSelect,
  SearchButton,
} from "../../../component/FormFrm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./review.css";
import Swal from "sweetalert2";

const ReviewList = (props) => {
  const isLogin = props.isLogin;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState(null);
  const [reqPage, setReqPage] = useState(1);
  const [reviewList, setReviewList] = useState([]);

  // 검색 관련 state
  const [searchType, setSearchType] = useState("title"); // "title", "genre", "reviewTitle"
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [searchReviewTitle, setSearchReviewTitle] = useState("");
  const [searchMode, setSearchMode] = useState(false); // 검색 모드 여부
  const [searchParams, setSearchParams] = useState(null); // 검색 파라미터

  // 게시글 리뷰 작성 관련 state
  const [writeMovieKeyword, setWriteMovieKeyword] = useState(""); // 영화 검색 키워드
  const [movieSearchResults, setMovieSearchResults] = useState([]); // TMDB 영화 검색 결과
  const [showMovieDropdown, setShowMovieDropdown] = useState(false); // 드롭다운 표시 여부
  const [selectedMovie, setSelectedMovie] = useState(null); // 선택된 영화
  const [searchDebounceTimer, setSearchDebounceTimer] = useState(null); // debounce 타이머

  // TMDB 장르 목록 (주요 장르만)
  const genreOptions = [
    { value: "28", label: "액션" },
    { value: "12", label: "모험" },
    { value: "16", label: "애니메이션" },
    { value: "35", label: "코미디" },
    { value: "80", label: "범죄" },
    { value: "99", label: "다큐멘터리" },
    { value: "18", label: "드라마" },
    { value: "10751", label: "가족" },
    { value: "14", label: "판타지" },
    { value: "36", label: "역사" },
    { value: "27", label: "공포" },
    { value: "10402", label: "음악" },
    { value: "9648", label: "미스터리" },
    { value: "10749", label: "로맨스" },
    { value: "878", label: "SF" },
    { value: "10770", label: "TV 영화" },
    { value: "53", label: "스릴러" },
    { value: "10752", label: "전쟁" },
    { value: "37", label: "서부" },
  ];

  // 게시글 리뷰 작성 여부
  const [hasReview, setHasReview] = useState(false);

  // debounce 타이머 cleanup
  useEffect(() => {
    return () => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, [searchDebounceTimer]);

  // 게시글 리뷰 목록 조회
  useEffect(() => {
    let url = backServer + "/board/review/list/" + reqPage;

    // 검색 모드일 때
    if (searchMode && searchParams) {
      url = backServer + "/board/review/search";
      url += "?searchType=" + searchParams.searchType;
      url += "&reqPage=" + reqPage;

      if (searchParams.searchType === "title") {
        url += "&keyword=" + encodeURIComponent(searchParams.keyword);
      } else if (searchParams.searchType === "genre") {
        url += "&genreId=" + searchParams.genreId;
      } else if (searchParams.searchType === "reviewTitle") {
        url += "&keyword=" + encodeURIComponent(searchParams.keyword);
      }
    }

    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          console.log(res.data.data);
          setPageInfo(res.data.data.pi);
          setReviewList(res.data.data.boardReviewList || []);
        }
      })
      .catch((err) => {
        console.error("게시글 리뷰 조회 실패:", err);
      });
  }, [reqPage, searchMode, searchParams, backServer]);

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

    if (searchType === "reviewTitle" && searchReviewTitle.trim() === "") {
      setSearchMode(false);
      setSearchParams(null);
      setReqPage(1);
      return;
    }

    // 검색 모드 활성화
    setSearchMode(true);
    setSearchParams({
      searchType,
      keyword:
        searchType === "title"
          ? searchKeyword
          : searchType === "reviewTitle"
          ? searchReviewTitle
          : null,
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
    setSearchReviewTitle("");
    setReqPage(1);
  };

  // 게시글 리뷰 상세 페이지로 이동
  const goToReviewDetail = (boardReviewNo) => {
    navigate("/board/review/view/" + boardReviewNo);
  };


  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    // Date 객체인 경우
    if (dateString instanceof Date) {
      return dateString.toISOString().split("T")[0];
    }

    // 문자열인 경우
    if (typeof dateString === "string") {
      // ISO 8601 형식 (2025-12-17T00:00:00.000+00:00)을 YYYY-MM-DD로 변환
      if (dateString.includes("T")) {
        return dateString.split("T")[0];
      }
      // Date 객체의 toString() 형식 (Fri Jul 03 00:00:00 KS) 처리
      if (dateString.includes(" ")) {
        try {
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split("T")[0];
          }
        } catch (e) {
          // 파싱 실패 시 원본 반환
        }
      }
    }

    return dateString;
  };

  // 평점 포맷팅
  const formatRating = (rating) => {
    if (!rating) return "0.0";
    return rating.toFixed(1);
  };

  // 포스터 이미지 URL 생성
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return "";
    return "https://image.tmdb.org/t/p/w300" + posterPath;
  };

  // 프로필 이미지 URL 생성
  const getProfileUrl = (profilePath) => {
    if (!profilePath) return "/image/default.png";
    return backServer + "/member/profile/" + profilePath;
  };

  // TMDB 영화 검색 (debounce 적용)
  const handleMovieSearch = (keyword) => {
    // 기존 타이머 취소
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    // debounce: 0.5초 대기 후 API 호출
    const timer = setTimeout(() => {
      if (keyword.trim() === "") {
        setMovieSearchResults([]);
        setShowMovieDropdown(false);
        return;
      }

      // 백엔드 API 호출로 변경
      axios
        .get(
          backServer +
            "/api/movie/search?keyword=" +
            encodeURIComponent(keyword)
        )
        .then((res) => {
          if (res.data.message === "success" && res.data.data.movieList) {
            setMovieSearchResults(res.data.data.movieList);
            setShowMovieDropdown(true);
          } else {
            setMovieSearchResults([]);
            setShowMovieDropdown(false);
          }
        })
        .catch((err) => {
          console.error("영화 검색 실패:", err);
          setMovieSearchResults([]);
          setShowMovieDropdown(false);
        });
    }, 500);

    setSearchDebounceTimer(timer);
  };

  // 영화 검색 키워드 변경 핸들러
  const handleWriteMovieKeywordChange = (e) => {
    const keyword = e.target.value;
    setWriteMovieKeyword(keyword);
    handleMovieSearch(keyword);
  };

  // 영화 선택 핸들러
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setWriteMovieKeyword(movie.title);
    setShowMovieDropdown(false);
    setMovieSearchResults([]);
  };

  // 게시글 리뷰 작성 페이지로 이동
  const goToReviewWrite = () => {
    // selectedMovie가 없으면 먼저 체크
    if (!selectedMovie) {
      // 검색 결과가 있으면 첫 번째 항목 사용
      if (movieSearchResults.length > 0) {
        navigate("/board/review/write/" + movieSearchResults[0].id);
        return;
      }

      // 입력한 키워드가 있지만 검색 결과가 없으면 경고
      if (writeMovieKeyword.trim() !== "") {
        alert("검색 결과가 없습니다. 다른 영화 제목을 입력해주세요.");
        return;
      }

      // 아무것도 없으면 경고
      alert("영화를 선택해주세요.");
      return;
    }

    // selectedMovie를 유저가 심플리뷰, 게시글리뷰 중에서 작성한 적이 있는지 검사
    // 작성한적이 있으면 경고 후 실행 x
    axios
      .get(backServer + "/board/review/check/" + selectedMovie.id)
      .then((res) => {
        if (res.data.message === "fail") {
          Swal.fire({
            title: "이미 리뷰를 작성한 영화입니다.",
            text: "다른 영화를 선택해주세요.",
            icon: "warning",
            confirmButtonText: "확인",
          });
          return; // 여기서 return하면 axios.then 내부에서만 return됨
        } else {
          // 리뷰가 없으면 작성 페이지로 이동
          navigate("/board/review/write/" + selectedMovie.id);
        }
      })
      .catch((err) => {
        console.error("리뷰 확인 실패:", err);
        alert("리뷰 확인 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="review-list-wrap">
      {/* 검색 영역 */}
      <div className="review-search-section">
        <div className="review-search-container">
          <div className="search-type-select">
            <select
              className="search-type-select-input"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="title">영화 제목</option>
              <option value="genre">장르</option>
              <option value="reviewTitle">리뷰 제목</option>
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
                options={genreOptions}
                onSearch={handleSearch}
              />
            ) : (
              <SearchInput
                data={searchReviewTitle}
                setData={setSearchReviewTitle}
                placeholder="리뷰 제목을 입력하세요"
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

      {/* 게시글 리뷰 작성 섹션 */}
      {isLogin && (
        <div className="review-write-section">
          <div className="review-write-container">
            <div className="write-movie-search-wrapper">
              <input
                type="text"
                className="write-movie-search-input"
                placeholder="리뷰를 작성할 영화 제목을 입력하세요"
                value={writeMovieKeyword}
                onChange={handleWriteMovieKeywordChange}
                onFocus={() => {
                  if (movieSearchResults.length > 0) {
                    setShowMovieDropdown(true);
                  }
                }}
                onBlur={() => {
                  // 드롭다운 클릭을 위해 약간의 지연
                  setTimeout(() => {
                    setShowMovieDropdown(false);
                  }, 200);
                }}
              />
              {showMovieDropdown && movieSearchResults.length > 0 && (
                <div className="movie-search-dropdown">
                  {movieSearchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="movie-search-item"
                      onClick={() => handleSelectMovie(movie)}
                    >
                      {movie.poster_path && (
                        <img
                          src={
                            "https://image.tmdb.org/t/p/w92" + movie.poster_path
                          }
                          alt={movie.title}
                          className="movie-search-poster"
                        />
                      )}
                      <div className="movie-search-info">
                        <div className="movie-search-title">{movie.title}</div>
                        {movie.release_date && (
                          <div className="movie-search-date">
                            {movie.release_date.split("-")[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              className="review-write-btn"
              onClick={goToReviewWrite}
              disabled={!selectedMovie && movieSearchResults.length === 0}
            >
              글 작성
            </button>
          </div>
        </div>
      )}

      {/* 게시글 리뷰 리스트 영역 */}
      <div className="review-list-section">
        <div className="review-list-grid">
          {reviewList.length > 0 ? (
            reviewList.map((review, index) => (
              <div key={review.boardReviewNo || index} className="review-card">
                <div className="review-movie-section">
                  <div
                    className="movie-poster-wrapper"
                    onClick={() => goToReviewDetail(review.boardReviewNo)}
                  >
                    <img
                      src={getPosterUrl(review.moviePosterPath)}
                      alt={review.movieTitle}
                      className="movie-poster"
                    />
                    {/* TMDB 평점 배지 */}
                    {review.tmdbRating && (
                      <div className="movie-rating-badge">
                        <span className="rating-icon">⭐</span>
                        <span className="rating-value">
                          {formatRating(review.tmdbRating)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="movie-info">
                    <h3
                      className="movie-title"
                      onClick={() => goToReviewDetail(review.boardReviewNo)}
                    >
                      {review.movieTitle || "제목 없음"}
                    </h3>
                    <p className="movie-release-date">
                      {formatDate(review.movieReleaseDate)}
                    </p>
                    {/* 장르 태그 */}
                    {review.movieGenres && review.movieGenres.length > 0 && (
                      <div className="movie-genres">
                        {review.movieGenres.map((genre, idx) => (
                          <span key={idx} className="genre-tag">
                            {genre.name || genre}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* 작성자 평가 */}
                    {review.boardReviewRating && (
                      <div className="reviewer-rating">
                        <span className="rating-label">작성자 평가:</span>
                        <span className="rating-value">
                          {formatRating(review.boardReviewRating)} / 10
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="review-content-section">
                  <h4
                    className="review-title"
                    onClick={() => goToReviewDetail(review.boardReviewNo)}
                  >
                    {review.boardReviewTitle || "제목 없음"}
                  </h4>
                  <div className="review-meta">
                    <div className="review-author">
                      <img
                        src={getProfileUrl(review.profilePath)}
                        alt={
                          review.memberNickname || review.boardReviewMemberNickname
                        }
                        className="author-profile-img"
                      />
                      <span className="author-name">
                        {review.memberNickname || review.boardReviewMemberNickname}
                      </span>
                    </div>
                    <div className="review-stats">
                      <span className="review-date">
                        {formatDate(review.boardReviewDate)}
                      </span>
                      <span className="review-view-count">
                        조회수: {review.boardReviewViewCount || 0}
                      </span>
                      <span className="review-like-count">
                        추천: {review.likeCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-reviews">
              <p>게시글 리뷰가 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 페이지네이션 영역 */}
      {pageInfo && (
        <div className="popular-pagination-section">
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

export default ReviewList;
