package kr.or.movie.api.model.service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import kr.or.movie.boardReview.model.dao.BoardReviewDao;
import kr.or.movie.simepleReview.model.dao.SimpleReviewDao;
import kr.or.movie.util.PageInfo;
import kr.or.movie.util.Pagination;


@Service
public class ApiService {
    @Value("${tmdb.api.key}")
    private String apiKey;

    @Value("${tmdb.api.url}")
    private String baseUrl;

    @Autowired
    private Pagination pagination;

    @Autowired
    private BoardReviewDao boardReviewDao;
    @Autowired
    private SimpleReviewDao simpleReviewDao;

    // RestTemplate으로 API 호출
    // getForObject = GET 요청 보내고 객체로 받기
    @Autowired
    private RestTemplate restTemplate;

    // 인기 영화 목록 조회 (100개 가져와서 페이지별로 12개씩 반환)
    // Map (pageInfo: 페이지 정보, popularList: 인기 영화 리스트)
    // reqPage: 요청 페이지

    /*
    TMDB API 응답 예시:
    {
    "results": [
        {
        "id": 123,
        "title": "영화 제목",
        "poster_path": "/이미지경로.jpg",
        "release_date": "2024-01-01",
        "vote_average": 8.5,
        ...
        }
    ],
    "total_pages": 500,
    "page": 1
    }
    */
    public Map selectPopularList(int reqPage) {
        Map<String, Object> map = new HashMap<>();

        // tmdb api에서 100개 영화 가져오기 (5페이지 * 20 = 100개)
        List<Map<String, Object>> allMovies = new ArrayList<>();

        for(int page = 1;page <=5; page++){
            String url = baseUrl + "/movie/popular?api_key=" + apiKey + "&language=ko-KR&page=" + page;

            // api 호출
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            // results 배열에서 영화 리스트 추출
            List<Map<String, Object>> movies = (List<Map<String, Object>>) response.get("results");
            allMovies.addAll(movies);
        }

        int numPerPage = 12;
        int pageNaviSize = 5;
        int totalCount = allMovies.size();

        PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);

        // PageInfo의 start와 end를 사용해서 해당 페이지의 영화만 추출
        // start는 1부터 시작하므로, List 인덱스는 0부터 시작하므로 start-1부터 end까지
        List<Map<String, Object>> popularList = new ArrayList<>();

        // start-1부터 end까지 (end는 포함)
        // 예: reqPage=1 → start=1, end=12 → 인덱스 0~11 (12개)
        //     reqPage=2 → start=13, end=24 → 인덱스 12~23 (12개)
        for(int i = pageInfo.getStart() - 1; i < pageInfo.getEnd() && i < allMovies.size(); i++) {
            popularList.add(allMovies.get(i));
        }

        // Map에 담아서 반환
        map.put("popularList", popularList);
        map.put("pi", pageInfo);

        return map;
    }

    // 검색 기능: 제목 또는 장르로 영화 검색
    public Map searchPopularList(String searchType, String keyword, String genreId, int reqPage) {
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> allMovies = new ArrayList<>();
        int totalResults = 0;
        int totalPages = 0;

        try {
            if ("title".equals(searchType) && keyword != null && !keyword.trim().isEmpty()) {
                // 제목 검색: TMDB 검색 API 사용
                String url = baseUrl + "/search/movie?api_key=" + apiKey 
                           + "&language=ko-KR&query=" + java.net.URLEncoder.encode(keyword, "UTF-8") 
                           + "&page=" + reqPage;
                
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                
                if (response != null) {
                    List<Map<String, Object>> movies = (List<Map<String, Object>>) response.get("results");
                    if (movies != null) {
                        allMovies.addAll(movies);
                    }
                    totalResults = response.get("total_results") != null ? 
                                  ((Number) response.get("total_results")).intValue() : 0;
                    totalPages = response.get("total_pages") != null ? 
                                ((Number) response.get("total_pages")).intValue() : 0;
                }
                
            } else if ("genre".equals(searchType) && genreId != null && !genreId.trim().isEmpty()) {
                // 장르 검색: TMDB Discover API 사용
                String url = baseUrl + "/discover/movie?api_key=" + apiKey 
                           + "&language=ko-KR&with_genres=" + genreId 
                           + "&page=" + reqPage 
                           + "&sort_by=popularity.desc";
                
                Map<String, Object> response = restTemplate.getForObject(url, Map.class);
                
                if (response != null) {
                    List<Map<String, Object>> movies = (List<Map<String, Object>>) response.get("results");
                    if (movies != null) {
                        allMovies.addAll(movies);
                    }
                    totalResults = response.get("total_results") != null ? 
                                  ((Number) response.get("total_results")).intValue() : 0;
                    totalPages = response.get("total_pages") != null ? 
                                ((Number) response.get("total_pages")).intValue() : 0;
                }
            }

            // 페이지네이션 처리
            int numPerPage = 12;
            int pageNaviSize = 5;
            
            // TMDB는 한 페이지에 20개씩 반환하므로, 12개씩 표시하려면 클라이언트 사이드 페이지네이션 필요
            // 하지만 검색 결과가 많을 수 있으므로, TMDB의 페이지네이션을 활용하되
            // 각 페이지에서 12개만 추출하는 방식으로 처리
            
            // 전체 결과를 가져오기 위해 여러 페이지를 호출 (최대 5페이지 = 100개)
            // 또는 현재 페이지의 20개 중에서 12개만 반환
            
            // 간단한 방법: 현재 페이지의 결과에서 12개만 반환
            List<Map<String, Object>> popularList = new ArrayList<>();
            int startIndex = 0;
            int endIndex = Math.min(12, allMovies.size());
            
            for(int i = startIndex; i < endIndex; i++) {
                popularList.add(allMovies.get(i));
            }
            
            // PageInfo 생성 (TMDB의 전체 페이지 수를 기준으로)
            // 하지만 우리는 12개씩 표시하므로, 전체 페이지 수를 재계산
            int totalCount = totalResults;
            int ourTotalPages = (int) Math.ceil((double) totalCount / numPerPage);
            
            PageInfo pageInfo = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
            
            // 실제로는 TMDB의 페이지네이션을 그대로 사용하되, 
            // 각 페이지에서 12개만 표시하는 방식이 더 효율적
            // 하지만 현재 구조를 유지하기 위해 위 방식 사용
            
            map.put("popularList", popularList);
            map.put("pi", pageInfo);
            map.put("totalResults", totalResults);
            map.put("totalPages", totalPages);

        } catch (Exception e) {
            e.printStackTrace();
            // 에러 발생 시 빈 리스트 반환
            PageInfo pageInfo = pagination.getPageInfo(reqPage, 12, 5, 0);
            map.put("popularList", new ArrayList<>());
            map.put("pi", pageInfo);
            map.put("totalResults", 0);
            map.put("totalPages", 0);
        }

        return map;
    }

    // 인기 영화 상세 정보 조회
    public Map selectPopularMovie(int movieId) {
        Map<String, Object> map = new HashMap<>();

        try {
            // TMDB API에서 영화 상세 정보 가져오기
            String url = baseUrl + "/movie/" + movieId + "?api_key=" + apiKey + "&language=ko-KR";
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null) {
                map.put("movie", response);
            } else {
                map.put("movie", null);
            }

        } catch (Exception e) {
            e.printStackTrace();
            map.put("movie", null);
        }

        return map;
    }

    // 영화 검색 (게시글 리뷰 작성용)
    public Map searchMovie(String keyword) {
        Map<String, Object> map = new HashMap<>();
        
        try {
            String url = baseUrl + "/search/movie?api_key=" + apiKey 
                       + "&language=ko-KR&query=" + java.net.URLEncoder.encode(keyword, "UTF-8");
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                
                // 최대 5개만 반환
                List<Map<String, Object>> movieList = new ArrayList<>();
                if (results != null) {
                    int maxResults = Math.min(5, results.size());
                    for(int i = 0; i < maxResults; i++) {
                        movieList.add(results.get(i));
                    }
                }
                
                map.put("movieList", movieList);
            } else {
                map.put("movieList", new ArrayList<>());
            }
        } catch (Exception e) {
            e.printStackTrace();
            map.put("movieList", new ArrayList<>());
        }
        
        return map;
    }
}
