import './board.css';
import { Routes, Route } from 'react-router-dom';   
import PopularMain from './popular/PopularMain';
import UserPickMain from './userPick/UserPickMain';
import ReviewMain from './review/ReviewMain';


const BoardMain = (props) => {
    const isLogin = props.isLogin;

    return(
        <>
            <Routes>
                <Route path="/popular/*" element={<PopularMain isLogin={isLogin} />} />
                <Route path="/user-pick/*" element={<UserPickMain />} />
                <Route path="/review/*" element={<ReviewMain />} />
            </Routes>
        </>
    )
}

export default BoardMain;