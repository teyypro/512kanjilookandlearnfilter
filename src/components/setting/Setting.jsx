// src/pages/SettingsPage.jsx
import React, { useContext, useState } from 'react';
import './SettingsPage.css'; // Import file CSS riêng
import { VoiceContext } from '../GetVoicesList';
import AudioSpeech from '../AudioSpeech';

// Component Voice & TTS Settings
function VoiceSettings() {
  const { voices, speech, setSpeech } = useContext(VoiceContext);

  return (
    <div className="settings-section">
      <h2>Voice & TTS Settings</h2>
      <p>Chọn giọng nói, tốc độ, cao độ và âm lượng cho phần phát âm.</p>

      {/* Dropdown chọn voice */}
      <div className="setting-item">
        <label>Giọng nói:</label>
        <select
          value={speech.voice?.name || ""}
          onChange={(e) =>
            setSpeech((s) => ({
              ...s,
              voice: voices.find((v) => v.name === e.target.value),
            }))
          }
        >
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </div>

      {/* Rate slider */}
      <div className="setting-item">
        <label>Tốc độ nói: <span>{speech.rate}x</span></label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speech.rate}
          onChange={(e) =>
            setSpeech((s) => ({ ...s, rate: parseFloat(e.target.value) }))
          }
        />
      </div>

      {/* Pitch slider */}
      <div className="setting-item">
        <label>Cao độ: <span>{speech.pitch}</span></label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={speech.pitch}
          onChange={(e) =>
            setSpeech((s) => ({ ...s, pitch: parseFloat(e.target.value) }))
          }
        />
      </div>

      {/* Volume slider */}
      <div className="setting-item">
        <label>Âm lượng: <span>{speech.volume}</span></label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={speech.volume}
          onChange={(e) =>
            setSpeech((s) => ({ ...s, volume: parseFloat(e.target.value) }))
          }
        />
      </div>

      {/* Test voice */}
      <div className="test-voice">
        <h3>Thử giọng nói: 「試験、頑張ってね！」</h3>
        <AudioSpeech text={"「試験、頑張ってね！」"} />
      </div>
    </div>
  );
}

// Component About
function AboutSettings() {
  return (
    <div className="settings-section">
      <h2>About</h2>
      <p>512 Kanji Look and Learn N4 N5</p>

      <div className="about-info">
        <h3>Phiên bản</h3>
        <p>🔥🎯🫦🫦🎤💐😏🌍</p>

        <h3>Tác giả</h3>
        <p>Phát triển bởi TeyyPro - 20/01/2026</p>

        <h3>Liên hệ</h3>
        <p>Sđt: 0973884347</p>
        <p>GitHub: github.com/bí nặng mật</p>

        <h3>Cảm ơn</h3>
        <p>Hãy trả mìn 40k để loáy đc full data quyển sách 512 Kanji Look And Learn🌸</p>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('voice'); // Tab mặc định là Voice & TTS

  const menuItems = [
    { id: 'voice', label: 'Voice & TTS', icon: '🎤' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  // Render nội dung dựa trên tab đang chọn
  const renderContent = () => {
    switch (activeTab) {
      case 'voice':
        return <VoiceSettings />;
      case 'about':
        return <AboutSettings />;
      default:
        return <VoiceSettings />;
    }
  };

  return (
    <div className="settings-page">
      {/* Sidebar bên trái */}
      <aside className="sidebar">
        <h1>Settings</h1>
        <ul className="menu">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Nội dung bên phải */}
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
}

export default SettingsPage;