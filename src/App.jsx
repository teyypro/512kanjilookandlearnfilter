import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home';
import KanjiPage from './components/KanjiPage';
import { useState, useEffect } from "react";

function App(){
  const [kanji_list, setKanjiList] = useState([]);

  useEffect(() => {
    fetch("/home_kanji_list.json")
      .then((res) => res.json())
      .then((data) => setKanjiList(data))
      .catch((err) => {
        console.log("Error loading JSON: ", err);
      });
  }, []);
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Home kanji_list = {kanji_list}/>}/>
        <Route path="kanji/:id" element = {<KanjiPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;