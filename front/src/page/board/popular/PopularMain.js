import React from "react";
import "./popular.css";
import { Routes, Route } from "react-router-dom";
import PopularList from "./PopularList";
import PopularView from "./PopularView";

const PopularMain = (props) => {
  const isLogin = props.isLogin;
  return (
    <div className="popular-container">
        <div className="popular-header"></div>

        <div className="popular-content">
            <Routes>
                <Route path="/list" element={<PopularList />} />
                <Route path="/view/:movieId" element={<PopularView isLogin={isLogin} />} />
            </Routes>
        </div>
    </div>
  );
};

export default PopularMain;
