import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Eye, Award } from 'lucide-react';

interface Scenario {
  id: number;
  image: string;
  context: string;
  redFlags: string[];
  safePoints: string[];
  isScam: boolean;
  explanation: string;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    image: "poster1",
    context: "You see this poster at a coffee shop offering free WiFi",
    redFlags: ["No official branding", "Too good to be true offer", "No contact information"],
    safePoints: [],
    isScam: true,
    explanation: "This is a scam! Legitimate businesses display official branding and contact info. Free WiFi QR codes in public are often used to steal credentials or install malware."
  },
  {
    id: 2,
    image: "poster2",
    context: "At your university campus, you find this research survey poster",
    redFlags: ["Generic design", "Vague 'research institution' name", "Amazon voucher as bait"],
    safePoints: [],
    isScam: true,
    explanation: "Red flags everywhere! The research paper showed that 83% of victims fell for professionally designed posters with vouchers. Real university studies include department names and ethics approval numbers."
  },
  {
    id: 3,
    image: "menu",
    context: "Your favorite restaurant has QR codes on tables for their menu",
    redFlags: [],
    safePoints: ["Official restaurant branding", "Staff confirms it's theirs", "HTTPS secure website"],
    isScam: false,
    explanation: "This is legitimate! The QR code is part of the official table setup, staff can verify it, and it leads to the restaurant's secure website. 63% of people regularly use QR codes at restaurants."
  },
  {
    id: 4,
    image: "parking",
    context: "You find this QR code sticker on a parking meter saying 'Pay Here'",
    redFlags: ["Sticker placed over original", "No official logo", "Unusual payment request"],
    safePoints: [],
    isScam: true,
    explanation: "Major scam alert! Criminals often place fake QR stickers over legitimate payment systems. Always use the official parking meter interface or app, not random stickers."
  }
];

const styles = `
  .game-container {
    max-width: 42rem;
    margin: 0 auto;
    padding: 1.5rem;
    background: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .game-container-white {
    max-width: 42rem;
    margin: 0 auto;
    padding: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .text-center {
    text-align: center;
  }

  .mb-6 {
    margin-bottom: 1.5rem;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }

  .mb-3 {
    margin-bottom: 0.75rem;
  }

  .mb-2 {
    margin-bottom: 0.5rem;
  }

  .mb-1 {
    margin-bottom: 0.25rem;
  }

  .mt-1 {
    margin-top: 0.25rem;
  }

  .mt-2 {
    margin-top: 0.5rem;
  }

  .mr-2 {
    margin-right: 0.5rem;
  }

  .mr-3 {
    margin-right: 0.75rem;
  }

  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }

  .icon-large {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
    color: #4f46e5;
  }

  .icon-xlarge {
    width: 5rem;
    height: 5rem;
    margin: 0 auto 1rem;
    color: #4f46e5;
  }

  .icon-medium {
    width: 1.25rem;
    height: 1.25rem;
    color: #10b981;
    flex-shrink: 0;
  }

  .icon-medium-indigo {
    width: 1.25rem;
    height: 1.25rem;
    color: #4f46e5;
    flex-shrink: 0;
  }

  .icon-small {
    width: 1rem;
    height: 1rem;
  }

  .icon-small-white {
    width: 1rem;
    height: 1rem;
    color: white;
  }

  .icon-alert {
    width: 1.25rem;
    height: 1.25rem;
    color: #f59e0b;
    flex-shrink: 0;
  }

  .icon-result {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
  }

  .icon-result-green {
    width: 1.5rem;
    height: 1.5rem;
    color: #059669;
    flex-shrink: 0;
  }

  .icon-result-red {
    width: 1.5rem;
    height: 1.5rem;
    color: #dc2626;
    flex-shrink: 0;
  }

  .title-large {
    font-size: 1.875rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .title-xl {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
  }

  .text-gray {
    color: #4b5563;
  }

  .text-gray-dark {
    color: #374151;
  }

  .text-gray-medium {
    color: #6b7280;
  }

  .card-white {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .list-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .list-text {
    color: #374151;
  }

  .alert-box {
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .alert-content {
    display: flex;
    align-items: flex-start;
  }

  .alert-text {
    font-size: 0.875rem;
    color: #92400e;
  }

  .btn-primary {
    width: 100%;
    background: #4f46e5;
    color: white;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .btn-primary:hover {
    background: #4338ca;
  }

  .header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .header-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
  }

  .score-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4f46e5;
  }

  .poster-container {
    width: 100%;
    height: 12rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }

  .poster1 {
    background: linear-gradient(to bottom right, #ef4444, #f97316);
    color: white;
    position: relative;
    overflow: hidden;
  }

  .poster1-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.1;
  }

  .poster1-border-tl {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 4rem;
    height: 4rem;
    border: 4px solid white;
  }

  .poster1-border-br {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 4rem;
    height: 4rem;
    border: 4px solid white;
  }

  .poster1-content {
    text-align: center;
    position: relative;
    z-index: 10;
    padding: 1.5rem;
  }

  .poster1-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .poster1-subtitle {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .poster-qr {
    width: 6rem;
    height: 6rem;
    background: white;
    margin: 0 auto 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .poster-qr-inner {
    width: 5rem;
    height: 5rem;
    background: black;
  }

  .poster1-footer {
    font-size: 0.75rem;
  }

  .poster2 {
    background: linear-gradient(to bottom right, #60a5fa, #2563eb);
    color: white;
  }

  .poster2-content {
    text-align: center;
    padding: 1.5rem;
  }

  .poster2-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .poster2-subtitle {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .poster2-qr {
    width: 6rem;
    height: 6rem;
    background: white;
    margin: 0 auto 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .poster2-voucher {
    background: #fbbf24;
    color: #1e3a8a;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: bold;
    display: inline-block;
  }

  .poster2-footer {
    font-size: 0.75rem;
    margin-top: 0.5rem;
    opacity: 0.8;
  }

  .poster-menu {
    background: linear-gradient(to bottom right, #fef3c7, #fde68a);
    color: #78350f;
    border: 4px solid #92400e;
  }

  .poster-menu-content {
    text-align: center;
    padding: 1.5rem;
  }

  .poster-menu-title {
    font-size: 1.5rem;
    font-family: serif;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  .poster-menu-est {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .poster-menu-subtitle {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .poster-menu-qr {
    width: 6rem;
    height: 6rem;
    background: white;
    margin: 0 auto 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #92400e;
  }

  .poster-menu-footer {
    font-size: 0.75rem;
  }

  .poster-menu-url {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    opacity: 0.7;
  }

  .poster-parking {
    background: #e5e7eb;
    border: 2px solid #9ca3af;
    position: relative;
  }

  .poster-parking-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom right, #d1d5db, #9ca3af);
    opacity: 0.5;
  }

  .poster-parking-content {
    text-align: center;
    position: relative;
    z-index: 10;
    padding: 1rem;
  }

  .poster-parking-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .poster-parking-subtitle {
    font-size: 0.875rem;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .poster-parking-qr {
    width: 7rem;
    height: 7rem;
    background: white;
    margin: 0 auto 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: rotate(2deg);
  }

  .poster-parking-footer {
    font-size: 0.75rem;
    color: #dc2626;
    font-weight: 600;
  }

  .context-box {
    background: #f9fafb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .context-text {
    color: #1f2937;
    font-weight: 500;
  }

  .inspect-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .inspect-title {
    font-weight: 600;
    color: #1f2937;
  }

  .flags-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .flag-button {
    width: 100%;
    text-align: left;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }

  .flag-button-inactive {
    border-color: #e5e7eb;
    color: #374151;
  }

  .flag-button-inactive:hover {
    border-color: #d1d5db;
  }

  .flag-button-active {
    border-color: #4f46e5;
    background: #eef2ff;
    color: #3730a3;
  }

  .flag-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .checkbox {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 0.25rem;
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkbox-inactive {
    border-color: #d1d5db;
  }

  .checkbox-active {
    border-color: #4f46e5;
    background: #4f46e5;
  }

  .flag-text {
    font-size: 0.875rem;
  }

  .divider {
    border-top: 1px solid #e5e7eb;
    padding-top: 1.5rem;
  }

  .question-text {
    text-align: center;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .button-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .btn-safe {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: #10b981;
    color: white;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-safe:hover {
    background: #059669;
  }

  .btn-scam {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: #ef4444;
    color: white;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-scam:hover {
    background: #dc2626;
  }

  .result-box-correct {
    border-radius: 0.5rem;
    padding: 1rem;
    background: #f0fdf4;
    border: 2px solid #10b981;
  }

  .result-box-incorrect {
    border-radius: 0.5rem;
    padding: 1rem;
    background: #fef2f2;
    border: 2px solid #ef4444;
  }

  .result-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .result-title-correct {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #065f46;
  }

  .result-title-incorrect {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #991b1b;
  }

  .result-text-correct {
    font-size: 0.875rem;
    color: #047857;
  }

  .result-text-incorrect {
    font-size: 0.875rem;
    color: #b91c1c;
  }

  .space-y-4 > * + * {
    margin-top: 1rem;
  }

  .percentage-display {
    font-size: 3rem;
    font-weight: bold;
    color: #4f46e5;
    margin-bottom: 0.5rem;
  }

  .space-y-3 > * + * {
    margin-top: 0.75rem;
  }

  .takeaway-item {
    display: flex;
    align-items: flex-start;
  }

  .takeaway-text {
    color: #374151;
  }
`;

const QRScamGame: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result' | 'summary'>('intro');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [foundFlags, setFoundFlags] = useState<Set<number>>(new Set());

  const startGame = () => {
    setGameState('playing');
    setCurrentScenario(0);
    setScore(0);
    setChoices([]);
    setShowExplanation(false);
    setFoundFlags(new Set());
  };

  const makeChoice = (userThinks: 'scam' | 'safe') => {
    const scenario = scenarios[currentScenario];
    const correct = (userThinks === 'scam' && scenario.isScam) || (userThinks === 'safe' && !scenario.isScam);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setChoices([...choices, correct]);
    setShowExplanation(true);
  };

  const nextScenario = () => {
    setShowExplanation(false);
    setFoundFlags(new Set());
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      setGameState('summary');
    }
  };

  const toggleFlag = (index: number) => {
    const newFlags = new Set(foundFlags);
    if (newFlags.has(index)) {
      newFlags.delete(index);
    } else {
      newFlags.add(index);
    }
    setFoundFlags(newFlags);
  };

  const renderPosterVisual = (type: string) => {
    switch(type) {
      case "poster1":
        return (
          <div className="poster-container poster1">
            <div className="poster1-pattern">
              <div className="poster1-border-tl"></div>
              <div className="poster1-border-br"></div>
            </div>
            <div className="poster1-content">
              <div className="poster1-title">FREE WIFI!</div>
              <div className="poster1-subtitle">Scan for instant access</div>
              <div className="poster-qr">
                <div className="poster-qr-inner"></div>
              </div>
              <div className="poster1-footer">Connect now • No password</div>
            </div>
          </div>
        );
      
      case "poster2":
        return (
          <div className="poster-container poster2">
            <div className="poster2-content">
              <div className="poster2-title">University Research Survey</div>
              <div className="poster2-subtitle">Impact of Inflation Study</div>
              <div className="poster2-qr">
                <div className="poster-qr-inner"></div>
              </div>
              <div className="poster2-voucher">
                WIN €50 AMAZON VOUCHER!
              </div>
              <div className="poster2-footer">Study-Research Institute</div>
            </div>
          </div>
        );
      
      case "menu":
        return (
          <div className="poster-container poster-menu">
            <div className="poster-menu-content">
              <div className="poster-menu-title">Bella Cucina</div>
              <div className="poster-menu-est">Est. 1985</div>
              <div className="poster-menu-subtitle">View Our Menu</div>
              <div className="poster-menu-qr">
                <div className="poster-qr-inner"></div>
              </div>
              <div className="poster-menu-footer">Scan to browse our dishes</div>
              <div className="poster-menu-url">www.bellacucina-restaurant.com</div>
            </div>
          </div>
        );
      
      case "parking":
        return (
          <div className="poster-container poster-parking">
            <div className="poster-parking-bg"></div>
            <div className="poster-parking-content">
              <div className="poster-parking-title">PARKING PAYMENT</div>
              <div className="poster-parking-subtitle">Quick Pay - Scan Here</div>
              <div className="poster-parking-qr">
                <div className="poster-qr-inner"></div>
              </div>
              <div className="poster-parking-footer">PAY NOW TO AVOID FINE</div>
            </div>
          </div>
        );
      
      default:
        return <div className="poster-container">QR Code Poster</div>;
    }
  };

  if (gameState === 'intro') {
    return (
      <>
        <style>{styles}</style>
        <div className="game-container">
          <div className="text-center mb-6">
            <Shield className="icon-large" />
            <h1 className="title-large">QR Code Scam Detective</h1>
            <p className="text-gray">Learn to spot malicious QR codes before they fool you</p>
          </div>
          
          <div className="card-white">
            <h2 className="title-xl">What You'll Learn:</h2>
            <div className="list-item">
              <CheckCircle className="icon-medium mr-2" style={{ marginTop: '0.125rem' }} />
              <span className="list-text">Identify red flags in QR code posters and stickers</span>
            </div>
            <div className="list-item">
              <CheckCircle className="icon-medium mr-2" style={{ marginTop: '0.125rem' }} />
              <span className="list-text">Understand common scam tactics (vouchers, urgency, fake branding)</span>
            </div>
            <div className="list-item">
              <CheckCircle className="icon-medium mr-2" style={{ marginTop: '0.125rem' }} />
              <span className="list-text">Practice safe QR code scanning habits</span>
            </div>
          </div>

          <div className="alert-box">
            <div className="alert-content">
              <AlertTriangle className="icon-alert mr-2" style={{ marginTop: '0.125rem' }} />
              <div className="alert-text">
                <strong>Did you know?</strong> Research shows that 83% of phishing victims fell for professionally designed QR codes offering vouchers or prizes.
              </div>
            </div>
          </div>

          <button onClick={startGame} className="btn-primary">
            Start Training
          </button>
        </div>
      </>
    );
  }

  if (gameState === 'playing') {
    const scenario = scenarios[currentScenario];
    const allFlags = scenario.isScam ? scenario.redFlags : scenario.safePoints;
    
    return (
      <>
        <style>{styles}</style>
        <div className="game-container-white">
          <div className="header-row">
            <div className="header-text">
              Scenario {currentScenario + 1} of {scenarios.length}
            </div>
            <div className="score-badge">
              <Award className="icon-small" />
              Score: {score}/{scenarios.length}
            </div>
          </div>

          <div className="mb-6">
            {renderPosterVisual(scenario.image)}
          </div>

          <div className="context-box">
            <p className="context-text">{scenario.context}</p>
          </div>

          {!showExplanation && (
            <>
              <div className="mb-6">
                <div className="inspect-header">
                  <Eye className="icon-medium-indigo" />
                  <h3 className="inspect-title">Inspect for clues:</h3>
                </div>
                <div className="flags-container">
                  {allFlags.map((flag, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleFlag(idx)}
                      className={`flag-button ${foundFlags.has(idx) ? 'flag-button-active' : 'flag-button-inactive'}`}
                    >
                      <div className="flag-content">
                        <div className={`checkbox ${foundFlags.has(idx) ? 'checkbox-active' : 'checkbox-inactive'}`}>
                          {foundFlags.has(idx) && <CheckCircle className="icon-small-white" />}
                        </div>
                        <span className="flag-text">{flag}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider">
                <p className="question-text">
                  Would you scan this QR code?
                </p>
                <div className="button-grid">
                  <button onClick={() => makeChoice('safe')} className="btn-safe">
                    <CheckCircle className="icon-medium" />
                    Safe to Scan
                  </button>
                  <button onClick={() => makeChoice('scam')} className="btn-scam">
                    <XCircle className="icon-medium" />
                    It's a Scam!
                  </button>
                </div>
              </div>
            </>
          )}

          {showExplanation && (
            <div className="space-y-4">
              <div className={choices[choices.length - 1] ? 'result-box-correct' : 'result-box-incorrect'}>
                <div className="result-content">
                  {choices[choices.length - 1] ? (
                    <CheckCircle className="icon-result-green" />
                  ) : (
                    <XCircle className="icon-result-red" />
                  )}
                  <div>
                    <h3 className={choices[choices.length - 1] ? 'result-title-correct' : 'result-title-incorrect'}>
                      {choices[choices.length - 1] ? 'Correct!' : 'Not quite!'}
                    </h3>
                    <p className={choices[choices.length - 1] ? 'result-text-correct' : 'result-text-incorrect'}>
                      {scenario.explanation}
                    </p>
                  </div>
                </div>
              </div>

              <button onClick={nextScenario} className="btn-primary">
                {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  if (gameState === 'summary') {
    const percentage = Math.round((score / scenarios.length) * 100);
    
    return (
      <>
        <style>{styles}</style>
        <div className="game-container">
          <div className="text-center mb-6">
            <Award className="icon-xlarge" />
            <h2 className="title-large">Training Complete!</h2>
            <div className="percentage-display">{percentage}%</div>
            <p className="text-gray">You got {score} out of {scenarios.length} correct</p>
          </div>

          <div className="card-white">
            <h3 className="title-xl">Key Takeaways:</h3>
            <div className="space-y-3">
              <div className="takeaway-item">
                <Shield className="icon-medium-indigo mr-3" style={{ marginTop: '0.125rem' }} />
                <span className="takeaway-text"><strong>Check for official branding:</strong> Legitimate QR codes have clear company logos and contact information</span>
              </div>
              <div className="takeaway-item">
                <Shield className="icon-medium-indigo mr-3" style={{ marginTop: '0.125rem' }} />
                <span className="takeaway-text"><strong>Be wary of prizes/vouchers:</strong> Scammers use "too good to be true" offers as bait</span>
              </div>
              <div className="takeaway-item">
                <Shield className="icon-medium-indigo mr-3" style={{ marginTop: '0.125rem' }} />
                <span className="takeaway-text"><strong>Look for stickers:</strong> Fake QR stickers placed over legitimate ones are a major red flag</span>
              </div>
              <div className="takeaway-item">
                <Shield className="icon-medium-indigo mr-3" style={{ marginTop: '0.125rem' }} />
                <span className="takeaway-text"><strong>Preview URLs:</strong> Most phone cameras show you the URL before opening it - check it!</span>
              </div>
              <div className="takeaway-item">
                <Shield className="icon-medium-indigo mr-3" style={{ marginTop: '0.125rem' }} />
                <span className="takeaway-text"><strong>Trust your instincts:</strong> If something feels off, don't scan it</span>
              </div>
            </div>
          </div>

          <div className="alert-box">
            <p className="alert-text">
              <strong>Remember:</strong> Only 25% of people would refuse to scan suspicious QR codes. Now you're part of the informed minority who can spot the dangers!
            </p>
          </div>

          <button onClick={startGame} className="btn-primary">
            Try Again
          </button>
        </div>
      </>
    );
  }

  return null;
};

export default QRScamGame;