import { Route, Routes } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/Home';
import Playlist from './components/Playlist';
import Allsong from './components/Allsong';

function App() {
  return (
   
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/allshow" element={<Playlist/>} />
        <Route path="/playlist/:id" element={<Allsong/>} />
      </Routes>

  );
}

export default App;
