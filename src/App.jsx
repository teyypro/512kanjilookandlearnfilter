import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home';
import KanjiPage from './components/KanjiPage';
import { useState, useEffect } from "react";
import Lesson from './components/Lesson';
import GetVoicesList from './components/GetVoicesList';
import SettingsPage from './components/setting/Setting';
import FullDisplay from './components/fullshowing/FullDisplay';





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
      <GetVoicesList>
      <Routes>
        <Route path="/" element = {<Home kanji_list = {kanji_list}/>}/>
        <Route path="kanji/:id" element = {<KanjiPage kanji_info = {kanji}/>}/>
        <Route path="lesson/:num" element = {<Lesson kanji_info = {kanji}/>}/>
        <Route path="setting" element = {<SettingsPage/>}/>
        <Route path="full_showing" element = {<FullDisplay kanji_info = {kanji} kanji_list = {kanji_list}/>}/>
      </Routes>
      </GetVoicesList>
    </BrowserRouter>
  )
}

export default App;