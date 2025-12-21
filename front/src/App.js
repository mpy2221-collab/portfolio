import Header from './page/common/Header';
import Main from './page/common/Main';
import Footer from './page/common/Footer';
import { Routes, Route } from 'react-router-dom';
import Join from './page/member/Join';
import Login from './page/member/Login';

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
