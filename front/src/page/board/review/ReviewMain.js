import React from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ReviewList from "./ReviewList";
import ReviewWrite from "./ReviewWrite";
import ReviewView from "./ReviewView";
import ReviewModify from "./ReviewModify";

const ReviewMain = (props) => {
  const isLogin = props.isLogin;
  const memberId = props.memberId;
  const memberType = props.memberType;
  const navigate = useNavigate();

  return (
    <div className="review-container">
      <div className="review-header"></div>
      <div className="review-content">
        <Routes>
          <Route path="/list" element={<ReviewList isLogin={isLogin} />} />
          <Route path="/write/:tmdbMovieId" element={<ReviewWrite />} />
          <Route path="/view/:boardReviewNo" element={<ReviewView isLogin={isLogin} memberId={memberId} memberType={memberType} />} />
          <Route path="/modify/:boardReviewNo" element={<ReviewModify />} />
        </Routes>
      </div>
    </div>
  );
};

export default ReviewMain;
