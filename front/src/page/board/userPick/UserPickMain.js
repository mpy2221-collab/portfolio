import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserPickList from './UserPickList';
import { Routes, Route } from 'react-router-dom';

const UserPickMain = (props) => {
    const isLogin = props.isLogin;
    const navigate = useNavigate();

    return (
        <div className="user-pick-container">
            <div className="user-pick-header"></div>
            <div className="user-pick-content">
                <Routes>
                    <Route path="/list" element={<UserPickList isLogin={isLogin} />} />
                </Routes>
            </div>

        </div>
    );
};

export default UserPickMain;

