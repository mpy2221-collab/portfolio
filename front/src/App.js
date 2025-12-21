import Header from './page/common/Header';
import Main from './page/common/Main';
import Footer from './page/common/Footer';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
