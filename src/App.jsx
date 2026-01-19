import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home';
import KanjiPage from './components/KanjiPage';
import { useState, useEffect } from "react";

function App(){
  const [kanji_list, setKanjiList] = useState([]);
  const [kanji, setKanji] = useState(null)

  useEffect(() => {
    
    //fetch data for HomePage
    fetch("/home_kanji_list.json")
      .then((res) => res.json())
      .then((data) => setKanjiList(data))
      .catch((err) => {
        console.log("Error loading JSON: ", err);
      });

    //fetch data for eachPage
    fetch("/full_kanji_data.json")
      .then((res) => res.json())
      .then((data) => {
        setKanji(data);
      })
      .catch((err) => {
        console.log("Error loading JSON: ", err);
      });

  }, []);
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element = {<Home kanji_list = {kanji_list}/>}/>
        <Route path="kanji/:id" element = {<KanjiPage kanji_info = {kanji}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;