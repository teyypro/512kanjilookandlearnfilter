// src/pages/SettingsPage.jsx
import React, { useContext, useState } from 'react';
import './SettingsPage.css'; // Import file CSS riêng
import { VoiceContext } from '../GetVoicesList';
import AudioSpeech from '../AudioSpeech';

// Các component con cho từng phần setting (bạn có thể tách ra file riêng)
const GeneralSettings = () => (
  <div>
    <h2>General Settings</h2>
    <p>Thay đổi ngôn ngữ, theme, thông tin tài khoản...</p>
    {/* Thêm input, toggle, v.v. ở đây */}
    <label>
      <input type="checkbox" /> Dark Mode
    </label>
  </div>
);


function VoiceSettings() {
  const { voices, speech, setSpeech } = useContext(VoiceContext);

  return (
    <div id = "voicesetting">
      <h2>Voice & TTS Settings</h2>
      <p>Chọn giọng nói, tốc độ, cao độ, âm lượng...</p>

      {/* Dropdown chọn voice */}
      <label>
        Giọng nói:
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
      </label>

      {/* Rate slider */}
      <label>
        Tốc độ nói:
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
        <span>{speech.rate}</span>
      </label>

      {/* Pitch slider */}
      <label>
        Cao độ:
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
        <span>{speech.pitch}</span>
      </label>

      {/* Volume slider */}
      <label>
        Âm lượng:
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
        <span>{speech.volume}</span>
      </label>

      <h3>Check Voices: 「試験、頑張ってね！」</h3>
      <AudioSpeech text = {"「試験、頑張ってね！」"}/>

    </div>
  );
}






const AppearanceSettings = () => (
  <div>
    <h2>Appearance</h2>
    <p>Theme, font, layout...</p>
    <select defaultValue="dark">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  </div>
);

const AdvancedSettings = () => (
  <div>
    <h2>Advanced</h2>
    <p>Các thiết lập nâng cao, reset, debug...</p>
    <button>Reset All Settings</button>
  </div>
);

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general'); // Tab mặc định

  const menuItems = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'voice', label: 'Voice & TTS', icon: '🎤' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'advanced', label: 'Advanced', icon: '🔧' },
  ];

  // Render nội dung dựa trên tab đang chọn
  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'voice':
        return <VoiceSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'advanced':
        return <AdvancedSettings />;
      default:
        return <GeneralSettings />;
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