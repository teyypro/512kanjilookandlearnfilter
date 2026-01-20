import { useContext } from "react";
import { VoiceContext } from "./GetVoicesList";



function AudioSpeech({text}){
    const {voices, speech, setSpeech} = useContext(VoiceContext)
    

    const SpeakOut = ()=>{
        const utter = new SpeechSynthesisUtterance(text)
        utter.voice = speech.voice
        utter.rate = speech.rate
        utter.pitch = speech.pitch
        utter.volume = speech.volume
        utter.lang = 'ja-JP';
        speechSynthesis.speak(utter)
    }
    return (
        <button onClick = {SpeakOut}>🎤</button>
    )
}

export default AudioSpeech;