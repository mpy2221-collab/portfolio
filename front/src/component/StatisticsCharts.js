import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./statisticsCharts.css";

// 차트 색상 팔레트
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
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#f9ca24",
  "#f0932b",
  "#eb4d4b",
  "#6c5ce7",
  "#a29bfe",
  "#fd79a8",
];

// 통계 정보 박스 컴포넌트
const StatisticsBox = ({ statistics }) => {
  return (
    <div className="statistics-box">
      {statistics.map((stat, index) => (
        <div key={index} className="statistics-item">
          <div className="statistics-label">{stat.label}</div>
          <div className="statistics-value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

// 장르별 분포 도넛 차트 컴포넌트
const GenreDistributionDonutChart = ({ genreDistribution }) => {
  const formatGenreDistribution = () => {
    if (!genreDistribution || genreDistribution.length === 0) {
      return [];
    }
    return genreDistribution.map((item, index) => ({
      name: item.genreName || item.name || "기타",
      value: item.count || 0,
      fill: COLORS[index % COLORS.length],
    }));
  };

  const data = formatGenreDistribution();

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">장르별 분포 (도넛 차트)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// 장르별 분포 막대 그래프 컴포넌트
const GenreDistributionBarChart = ({ genreDistribution }) => {
  const formatGenreDistribution = () => {
    if (!genreDistribution || genreDistribution.length === 0) {
      return [];
    }
    return genreDistribution.map((item, index) => ({
      name: item.genreName || item.name || "기타",
      value: item.count || 0,
      fill: COLORS[index % COLORS.length],
    }));
  };

  const data = formatGenreDistribution();

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">장르별 분포 (막대 그래프)</h3>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} margin={{ bottom: 36, left: 0, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={90}
            tick={{ fill: "#ffffff", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis />
          <Tooltip />
          <Legend
            formatter={(value, entry) => {
              const index = data.findIndex((item) => item.name === value);
              return index >= 0 ? data[index].name : value;
            }}
            payload={data.map((entry, index) => ({
              value: entry.name,
              type: "square",
              id: entry.name,
              color: entry.fill,
            }))}
            wrapperStyle={{ color: "#ffffff" }}
          />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 평점별 분포 막대 그래프 컴포넌트
const RatingDistributionBarChart = ({ ratingDistribution }) => {
  const formatRatingDistribution = () => {
    if (!ratingDistribution || ratingDistribution.length === 0) {
      return [];
    }
    return ratingDistribution.map((item, index) => {
      // 대문자 키(RATING, COUNT) 또는 소문자 키(rating, count) 모두 처리
      const rating = item.RATING !== undefined ? item.RATING : item.rating;
      const count = item.COUNT !== undefined ? item.COUNT : item.count;
      return {
        rating: `${rating}점`,
        count: count || 0,
        fill: COLORS[index % COLORS.length],
      };
    });
  };

  const data = formatRatingDistribution();

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">평점별 분포 (막대 그래프)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ bottom: 28, left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="rating"
            interval={0}
            tick={{ fill: "#ffffff", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis />
          <Tooltip />
          <Legend
            formatter={(value, entry) => {
              const index = data.findIndex((item) => item.rating === value);
              return index >= 0 ? data[index].rating : value;
            }}
            payload={data.map((entry, index) => ({
              value: entry.rating,
              type: "square",
              id: entry.rating,
              color: entry.fill,
            }))}
            wrapperStyle={{ color: "#ffffff" }}
          />
          <Bar dataKey="count">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export {
  StatisticsBox,
  GenreDistributionDonutChart,
  GenreDistributionBarChart,
  RatingDistributionBarChart,
};
