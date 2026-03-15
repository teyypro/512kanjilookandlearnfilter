// src/pages/SettingsPage.jsx
import React, { useContext, useState } from 'react';
import './SettingsPage.css';
import { VoiceContext } from '../GetVoicesList';
import AudioSpeech from '../AudioSpeech';

function VoiceSettings() {
  const { voices, speech, setSpeech } = useContext(VoiceContext);

  return (
    <div className="settings-section">
      <h2>Voice & TTS Settings</h2>
      <p>Chọn giọng nói, tốc độ, cao độ và âm lượng cho phần phát âm.</p>

      <div className="setting-item">
        <label>Giọng nói</label>
        <select
          value={speech.voice?.name || ''}
          onChange={(e) =>
            setSpeech((s) => ({
              ...s,
              voice: voices.find((v) => v.name === e.target.value) || null,
            }))
          }
        >
          <option value="" disabled>Chọn giọng nói</option>
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </div>

      <div className="setting-item">
        <label>Tốc độ nói: {speech.rate.toFixed(1)}×</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speech.rate}
          onChange={(e) => setSpeech((s) => ({ ...s, rate: Number(e.target.value) }))}
        />
      </div>

      <div className="setting-item">
        <label>Cao độ: {speech.pitch.toFixed(1)}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={speech.pitch}
          onChange={(e) => setSpeech((s) => ({ ...s, pitch: Number(e.target.value) }))}
        />
      </div>

      <div className="setting-item">
        <label>Âm lượng: {speech.volume.toFixed(1)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={speech.volume}
          onChange={(e) => setSpeech((s) => ({ ...s, volume: Number(e.target.value) }))}
        />
      </div>

      <div className="test-voice">
        <h3>Thử giọng nói</h3>
        <p>「試験、頑張ってね！」</p>
        <AudioSpeech text="「試験、頑張ってね！」" />
      </div>
    </div>
  );
}

function AboutSettings() {
  return (
    <div className="settings-section">
      <h2>About</h2>

      <div className="about-info">
        <div className="info-row">
          <h3>Ứng dụng</h3>
          <p>512 Kanji Look and Learn N4 N5</p>
        </div>

        <div className="info-row">
          <h3>Phiên bản</h3>
          <p>1.0.0 (2026)</p>
        </div>

        <div className="info-row">
          <h3>Tác giả</h3>
          <p>Phát triển bởi TeyyPro</p>
          <p>Ngày bắt đầu: 20/01/2026</p>
        </div>

        <div className="info-row">
          <h3>Liên hệ</h3>
          <p>SĐT: 0973 884 347</p>
          <p>GitHub: github.com/[tên-repo]</p>
        </div>

        <div className="info-row">
          <h3>Hỗ trợ tác giả</h3>
          <p>ủng hộ 40k để mở full data 512 Kanji Look and Learn</p>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('voice');

  const menuItems = [
    { id: 'voice', label: 'Voice & TTS', icon: '🎤' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <div className="settings-page">
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

      <main className="content">
        {activeTab === 'voice' && <VoiceSettings />}
        {activeTab === 'about' && <AboutSettings />}
      </main>
    </div>
  );
}