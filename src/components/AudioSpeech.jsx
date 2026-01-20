// src/components/AudioSpeech.jsx
import { useContext } from "react";
import { VoiceContext } from "./GetVoicesList";
import styles from "./AudioSpeech.module.css";

function AudioSpeech({ text }) {
  const { voices, speech, setSpeech } = useContext(VoiceContext);

  const SpeakOut = () => {
    if (!text) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = speech.voice;
    utter.rate = speech.rate;
    utter.pitch = speech.pitch;
    utter.volume = speech.volume;
    utter.lang = "ja-JP";


    speechSynthesis.speak(utter);
  };

  return (
    <button
      onClick={SpeakOut}
      className={styles.speechButton}
      title="Nghe phát âm (Nhấn để nghe)"
      aria-label="Nghe phát âm tiếng Nhật"
      disabled={!text || !speech.voice} // Vô hiệu hóa nếu không có text hoặc voice
    >
      🎤
    </button>
  );
}

export default AudioSpeech;