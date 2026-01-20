import { createContext, useEffect, useState } from "react"

export const VoiceContext = createContext()

function getVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
    } else {
      const onVoicesChanged = () => {
        const updatedVoices = speechSynthesis.getVoices();
        if (updatedVoices.length) {
          resolve(updatedVoices);
          // Cleanup để tránh leak
          speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        }
      };
      speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    }
  });
}

    //get VoicesList of Web Speech API

function GetVoicesList({children}){
    const [voices, setVoices] = useState()
    const [speech, setSpeech] = useState({
        voice: null,
        rate: 1,
        pitch: 1,
        volume: 2,
    })

    useEffect(()=>{
        getVoices().then((list) => {
            // Lọc chỉ voices tiếng Nhật
            const japaneseVoices = list.filter((v) => v.lang.startsWith("ja"));
            setVoices(japaneseVoices);
            console.log(voices,"--------")
            // Chọn default voice an toàn
            if (japaneseVoices.length > 0) {
              // Ưu tiên chọn voice tốt nhất (Google hoặc Kyoko nếu có)
              let defaultVoice = japaneseVoices.find((v) =>
                v.name.includes("Google")
              );
              if (!defaultVoice) {
                defaultVoice = japaneseVoices.find((v) => v.name === "Kyoko");
              }
              if (!defaultVoice) {
                defaultVoice = japaneseVoices[0]; // fallback
              }
            
              setSpeech((prev) => ({ ...prev, voice: defaultVoice }));
            }
        })
    }, [])

    return (
        <VoiceContext.Provider value = {{voices, speech, setSpeech}}> 
            {children}
        </VoiceContext.Provider>
    )
}

export default GetVoicesList;