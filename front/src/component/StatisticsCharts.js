import { useState, useEffect } from "react";
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

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
};

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
  const isMobile = useIsMobile();

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

  const outerRadius = isMobile ? 70 : 100;
  const innerRadius = isMobile ? 35 : 50;
  const chartHeight = isMobile ? 320 : 400;

  return (
    <div className="chart-container">
      <h3 className="chart-title">장르별 분포 (도넛 차트)</h3>
      <div className="chart-responsive-wrap">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              labelLine={!isMobile}
              label={
                isMobile
                  ? false
                  : ({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}개`, name]}
              contentStyle={{
                background: "#2d2d2d",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                color: "#ffffff",
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#ffffff" }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                color: "#ffffff",
                fontSize: isMobile ? 11 : 13,
                paddingTop: 8,
                width: "100%",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 장르별 분포 막대 그래프 컴포넌트
const GenreDistributionBarChart = ({ genreDistribution }) => {
  const isMobile = useIsMobile();

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

  const chartHeight = isMobile ? 300 : 360;

  return (
    <div className="chart-container">
      <h3 className="chart-title">장르별 분포 (막대 그래프)</h3>
      <div className="chart-responsive-wrap">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            margin={{
              top: 8,
              bottom: isMobile ? 48 : 36,
              left: 0,
              right: 8,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-35}
              textAnchor="end"
              height={isMobile ? 70 : 90}
              tick={{ fill: "#ffffff", fontSize: isMobile ? 10 : 12 }}
              tickLine={false}
            />
            <YAxis
              width={isMobile ? 28 : 40}
              tick={{ fill: "#ffffff", fontSize: isMobile ? 10 : 12 }}
            />
            <Tooltip
              formatter={(value) => [`${value}개`, "개수"]}
              contentStyle={{
                background: "#2d2d2d",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                color: "#ffffff",
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#ffffff" }}
            />
            {!isMobile && (
              <Legend
                formatter={(value) => {
                  const index = data.findIndex((item) => item.name === value);
                  return index >= 0 ? data[index].name : value;
                }}
                payload={data.map((entry) => ({
                  value: entry.name,
                  type: "square",
                  id: entry.name,
                  color: entry.fill,
                }))}
                wrapperStyle={{ color: "#ffffff" }}
              />
            )}
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 평점별 분포 막대 그래프 컴포넌트
const RatingDistributionBarChart = ({ ratingDistribution }) => {
  const isMobile = useIsMobile();

  const formatRatingDistribution = () => {
    if (!ratingDistribution || ratingDistribution.length === 0) {
      return [];
    }
    return ratingDistribution.map((item, index) => {
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

  const chartHeight = isMobile ? 240 : 260;

  return (
    <div className="chart-container">
      <h3 className="chart-title">평점별 분포 (막대 그래프)</h3>
      <div className="chart-responsive-wrap">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            margin={{
              top: 8,
              bottom: isMobile ? 16 : 28,
              left: 0,
              right: 8,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="rating"
              interval={0}
              tick={{ fill: "#ffffff", fontSize: isMobile ? 10 : 12 }}
              tickLine={false}
            />
            <YAxis
              width={isMobile ? 28 : 40}
              tick={{ fill: "#ffffff", fontSize: isMobile ? 10 : 12 }}
            />
            <Tooltip
              formatter={(value) => [`${value}개`, "개수"]}
              contentStyle={{
                background: "#2d2d2d",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                color: "#ffffff",
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#ffffff" }}
            />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export {
  StatisticsBox,
  GenreDistributionDonutChart,
  GenreDistributionBarChart,
  RatingDistributionBarChart,
};
