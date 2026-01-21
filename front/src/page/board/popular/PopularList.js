import { useEffect, useState } from "react";
import Pagination from "../../../component/Pagination";
import {
  SearchInput,
  SearchSelect,
  SearchButton,
} from "../../../component/FormFrm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./popular.css";

const PopularList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState(null);
  const [reqPage, setReqPage] = useState(1);
  const [popularList, setPopularList] = useState([]);

  // 검색 관련 state
  const [searchType, setSearchType] = useState("title"); // "title" 또는 "genre"
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [searchMode, setSearchMode] = useState(false); // 검색 모드 여부
  const [searchParams, setSearchParams] = useState(null); // 검색 파라미터

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

  // 영화 목록 조회
  useEffect(() => {
    let url = backServer + "/api/popular/" + reqPage;

    // 검색 모드일 때
    if (searchMode && searchParams) {
      url = backServer + "/api/popular/search";
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
        console.log(res.data);
        if (res.data.message === "success") {
          setPageInfo(res.data.data.pi);
          setPopularList(res.data.data.popularList || []);
        }
      })
      .catch((err) => {
        console.error("영화 조회 실패:", err);
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

  // 영화 상세 페이지로 이동
  const goToMovieDetail = (movieId) => {
    navigate(`/board/popular/view/${movieId}`);
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

  // 포스터 이미지 URL 생성
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return "https://via.placeholder.com/300x450?text=No+Image";
    return `https://image.tmdb.org/t/p/w300${posterPath}`;
  };

  return (
    <div className="popular-list-wrap">
      {/* 검색 영역 */}
      <div className="popular-search-section">
        <div className="popular-search-container">
          <div className="search-type-select">
            <select
              className="search-type-select-input"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
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
                options={genreOptions}
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

      {/* 영화 리스트 영역 */}
      <div className="popular-movies-section">
        <div className="popular-movies-grid">
          {popularList.length > 0 ? (
            popularList.map((movie, index) => (
              <div
                key={movie.id || index}
                className="movie-card"
                onClick={() => goToMovieDetail(movie.id)}
              >
                <div className="movie-poster-wrapper">
                  <img
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <div className="movie-rating-badge">
                    <span className="rating-icon">⭐</span>
                    <span className="rating-value">
                      {formatRating(movie.vote_average)}
                    </span>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title || "제목 없음"}</h3>
                  <p className="movie-release-date">
                    {formatDate(movie.release_date)}
                  </p>
                  {movie.genre_ids && movie.genre_ids.length > 0 && (
                    <div className="movie-genres">
                      {movie.genre_ids.map((genreId, idx) => {
                        const genre = genreOptions.find(
                          (g) => g.value === String(genreId)
                        );
                        return genre ? (
                          <span key={idx} className="genre-tag">
                            {genre.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-movies">
              <p>영화가 없습니다.</p>
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

export default PopularList;
