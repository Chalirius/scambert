import React, { useState } from "react"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Award,
  RotateCcw,
  GraduationCap,
} from "lucide-react"
import { motion } from "motion/react"
import ScambertIcon from "./ScambertIcon"
import QRCode from "react-qr-code"

interface Scenario {
  id: number
  image: string
  context: string
  redFlags: string[]
  safePoints: string[]
  isScam: boolean
  explanation: string
  link?: { text: string; url: string }
}

const scenarios: Scenario[] = [
  {
    id: 1,
    image: "poster1",
    context:
      "You receive a text message with this image, claiming you missed a package delivery",
    redFlags: [
      "Unsolicited message from unknown number",
      "Creates false urgency",
      "Legitimate carriers use tracking numbers, not random QR codes",
    ],
    safePoints: [],
    isScam: true,
    explanation:
      "Major scam! The HP Wolf Security report noted phishing campaigns masquerading as parcel delivery companies.",
    link: {
      text: "See more",
      url: "https://threatresearch.ext.hp.com/hp-wolf-security-threat-insights-report-q4-2022/",
    },
  },
  {
    id: 2,
    image: "poster2",
    context: "At your university campus, you find this research survey poster",
    redFlags: [
      "Generic design",
      "Vague 'research institution' name",
      "Amazon voucher as bait",
    ],
    safePoints: [],
    isScam: true,
    explanation:
      "Red flags everywhere! Research shows professional design with vouchers attracts 5x more victims than plain posters. Real university studies include specific departments that you can contact, not vague 'research institutes'.",
  },
  {
    id: 3,
    image: "menu",
    context: "Your favorite restaurant has QR codes on tables for their menu",
    redFlags: [],
    safePoints: [
      "Official restaurant branding",
      "Staff confirms it's theirs",
      "HTTPS secure website",
    ],
    isScam: false,
    explanation:
      "This is safe! Restaurant menu QR codes became widespread during COVID-19 and remain a trusted, convenient option when verified by staff.",
  },
  {
    id: 4,
    image: "parking",
    context:
      "You find this QR code sticker on a parking meter saying 'Pay Here'",
    redFlags: [
      "Sticker placed over original",
      "No official logo",
      "Unusual payment request",
    ],
    safePoints: [],
    isScam: true,
    explanation:
      "Major scam alert! Criminals often place fake QR stickers over legitimate payment systems. Always use the official parking meter interface or app, not random stickers.",
  },
]

const styles = `
  .qr-game-container {
    opacity: 1;
    transform: none;
    position: absolute;
    top: 69em;
    right: 1em;
    z-index: 100;
    width: 100%;
    max-width: 42rem;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }

  .qr-card {
    background: #020617;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .qr-card-header {
    border-bottom: 1px solid rgba(251, 146, 60, 0.3);
    padding: 1rem;
    background: linear-gradient(to right, rgba(15, 23, 42, 0.5), rgba(23, 37, 84, 0.3), rgba(69, 26, 3, 0.2));
  }

  .qr-card-header-intro {
    padding: 1rem;
  }

  .qr-card-header-flex {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .qr-card-header-flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .qr-blob-container {
    position: relative;
  }

  .qr-blob-glow {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    filter: blur(1rem);
    background: rgba(251, 191, 36, 0.2);
  }

  .qr-blob-glow-blue {
    background: rgba(59, 130, 246, 0.2);
  }

  .qr-title {
    color: #f1f5f9;
    font-size: 1.25rem;
    line-height: 1.75rem;
    margin: 0;
  }

  .qr-title-large {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .qr-subtitle {
    color: #94a3b8;
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin: 0;
  }

  .qr-card-content {
    padding: 1rem;
    background: linear-gradient(to bottom, #020617, #0f172a);
    overflow-y: auto;
  }

  .qr-space-y {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .qr-info-box {
    background: linear-gradient(to bottom right, rgba(69, 26, 3, 0.5), rgba(124, 45, 18, 0.3));
    border: 1px solid rgba(217, 119, 6, 0.5);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .qr-info-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .qr-info-title {
    color: #fef3c7;
    font-size: 1rem;
    margin: 0;
  }

  .qr-info-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .qr-info-item {
    display: flex;
    align-items: start;
    gap: 0.5rem;
    color: #e2e8f0;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .qr-icon-green {
    color: #4ade80;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .qr-icon-blue {
    color: #60a5fa;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .qr-icon-orange {
    color: #fb923c;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .qr-icon-amber {
    color: #fbbf24;
  }

  .qr-alert-box {
    background: rgba(124, 45, 18, 0.3);
    border-left: 4px solid #f97316;
    padding: 0.75rem;
    border-radius: 0.25rem;
  }

  .qr-alert-content {
    display: flex;
    align-items: start;
    gap: 0.5rem;
  }

  .qr-alert-text {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #fed7aa;
  }

  .qr-button {
    width: 100%;
    padding: 0.5rem 1rem;
    background: linear-gradient(to right, #2563eb, #1d4ed8);
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .qr-button:hover {
    background: linear-gradient(to right, #1d4ed8, #1e40af);
  }

  .qr-button-green {
    background: linear-gradient(to right, #16a34a, #15803d);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .qr-button-green:hover {
    background: linear-gradient(to right, #15803d, #166534);
  }

  .qr-button-red {
    background: linear-gradient(to right, #dc2626, #b91c1c);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .qr-button-red:hover {
    background: linear-gradient(to right, #b91c1c, #991b1b);
  }

  .qr-button-icon {
    background: transparent;
    border: 1px solid rgba(194, 65, 12, 0.5);
    color: #f97316;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qr-button-icon:hover {
    background: rgba(124, 45, 18, 0.3);
    border-color: #ea580c;
  }

  .qr-poster-container {
    width: 100%;
    min-height: 14rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    border: 2px solid;
    position: relative;
    overflow: visible;
    padding: 0.5rem 0;
  }

  .qr-poster-wifi {
    background: linear-gradient(to bottom right, #dc2626, #ea580c);
    border-color: rgba(185, 28, 28, 0.5);
  }

  .qr-poster-survey {
    background: linear-gradient(to bottom right, #3b82f6, #1d4ed8);
    border-color: rgba(30, 64, 175, 0.5);
  }

  .qr-poster-menu {
    background: linear-gradient(to bottom right, #fef3c7, #fde047);
    border-color: #78350f;
  }

  .qr-poster-parking {
    background: linear-gradient(to bottom right, #d1d5db, #9ca3af);
    border-color: #6b7280;
  }

  .qr-poster-content {
    text-align: center;
    position: relative;
    z-index: 10;
    padding: 1rem;
  }

  .qr-poster-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.1;
  }

  .qr-poster-pattern-box {
    position: absolute;
    width: 3rem;
    height: 3rem;
    border: 4px solid white;
  }

  .qr-poster-pattern-box-tl {
    top: 0.5rem;
    left: 0.5rem;
  }

  .qr-poster-pattern-box-br {
    bottom: 0.5rem;
    right: 0.5rem;
  }

  .qr-poster-pattern-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom right, #9ca3af, #6b7280);
    opacity: 0.5;
  }

  .qr-poster-title {
    font-size: 1.125rem;
    line-height: 1.75rem;
    margin-bottom: 0.25rem;
    color: white;
  }

  .qr-poster-title-menu {
    font-family: Georgia, serif;
    color: #451a03;
  }

  .qr-poster-title-parking {
    color: #111827;
  }

  .qr-poster-subtitle {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin-bottom: 0.5rem;
    color: white;
  }

  .qr-poster-subtitle-menu {
    font-size: 0.75rem;
    line-height: 1rem;
    color: #451a03;
  }

  .qr-poster-subtitle-parking {
    font-size: 0.75rem;
    line-height: 1rem;
    color: #111827;
  }

  .qr-poster-qr {
    width: 4rem;
    height: 4rem;
    background: white;
    margin: 0 auto 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qr-poster-qr-menu {
    border: 2px solid #78350f;
  }

  .qr-poster-qr-parking {
    width: 5rem;
    height: 5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: rotate(2deg);
  }

  .qr-poster-qr-inner {
    width: 3.5rem;
    height: 3.5rem;
    background: black;
  }

  .qr-poster-qr-inner-parking {
    width: 4rem;
    height: 4rem;
  }

  .qr-poster-badge {
    background: #facc15;
    color: #1e3a8a;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    line-height: 1rem;
    display: inline-block;
  }

  .qr-poster-footer {
    font-size: 0.75rem;
    line-height: 1rem;
    margin-top: 0.25rem;
    color: white;
  }

  .qr-poster-footer-menu {
    opacity: 0.7;
    color: #451a03;
  }

  .qr-poster-footer-parking {
    color: #dc2626;
  }

  .qr-context-box {
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(51, 65, 85, 0.5);
    border-radius: 0.5rem;
    padding: 0.75rem;
  }

  .qr-context-text {
    color: #e2e8f0;
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin: 0;
  }

  .qr-clues-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .qr-clues-title {
    color: #f1f5f9;
    font-size: 1rem;
    margin: 0;
  }

  .qr-clues-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .qr-clue-button {
    width: 100%;
    text-align: left;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 2px solid;
    background: rgba(30, 41, 59, 0.3);
    color: #cbd5e1;
    cursor: pointer;
    transition: all 0.2s;
  }

  .qr-clue-button:hover {
    border-color: #475569;
  }

  .qr-clue-button-selected {
    border-color: #3b82f6;
    background: rgba(30, 58, 138, 0.3);
    color: #93c5fd;
  }

  .qr-clue-button-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .qr-checkbox {
    width: 1rem;
    height: 1rem;
    border-radius: 0.125rem;
    border: 2px solid;
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: #475569;
  }

  .qr-checkbox-selected {
    border-color: #3b82f6;
    background: #3b82f6;
  }

  .qr-clue-text {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .qr-divider {
    border-top: 1px solid rgba(51, 65, 85, 0.5);
    padding-top: 1rem;
  }

  .qr-question {
    text-align: center;
    color: #e2e8f0;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .qr-button-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .qr-result-box {
    border-radius: 0.5rem;
    padding: 0.75rem;
    border: 2px solid;
  }

  .qr-result-box-correct {
    background: rgba(20, 83, 45, 0.3);
    border-color: rgba(22, 163, 74, 0.5);
  }

  .qr-result-box-incorrect {
    background: rgba(69, 10, 10, 0.3);
    border-color: rgba(220, 38, 38, 0.5);
  }

  .qr-result-content {
    display: flex;
    align-items: start;
    gap: 0.5rem;
  }

  .qr-icon-result-correct {
    color: #4ade80;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .qr-icon-result-incorrect {
    color: #f87171;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .qr-result-title {
    margin-bottom: 0.25rem;
    margin-top: 0;
  }

  .qr-result-title-correct {
    color: #86efac;
  }

  .qr-result-title-incorrect {
    color: #fca5a5;
  }

  .qr-result-text {
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin: 0;
  }

  .qr-result-text-correct {
    color: #bbf7d0;
  }

  .qr-result-text-incorrect {
    color: #fecaca;
  }

  .qr-score-container {
    text-align: center;
  }

  .qr-score-icon {
    color: #fbbf24;
    margin: 0 auto 0.75rem;
  }

  .qr-score-percentage {
    font-size: 3rem;
    line-height: 1;
    color: #60a5fa;
    margin-bottom: 0.5rem;
  }

  .qr-score-text {
    color: #cbd5e1;
    font-size: 0.875rem;
    line-height: 1.25rem;
    margin: 0;
  }

  .qr-score-detail {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #94a3b8;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
`

const QRScamGame: React.FC = () => {
  const [gameState, setGameState] = useState<
    "intro" | "playing" | "result" | "summary"
  >("intro")
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [choices, setChoices] = useState<boolean[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [foundFlags, setFoundFlags] = useState<Set<number>>(new Set())

  const startGame = () => {
    setGameState("playing")
    setCurrentScenario(0)
    setScore(0)
    setChoices([])
    setShowExplanation(false)
    setFoundFlags(new Set())
  }

  const makeChoice = (userThinks: "scam" | "safe") => {
    const scenario = scenarios[currentScenario]
    const correct =
      (userThinks === "scam" && scenario.isScam) ||
      (userThinks === "safe" && !scenario.isScam)

    if (correct) {
      setScore(score + 1)
    }

    setChoices([...choices, correct])
    setShowExplanation(true)
  }

  const nextScenario = () => {
    setShowExplanation(false)
    setFoundFlags(new Set())

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
    } else {
      setGameState("summary")
    }
  }

  const toggleFlag = (index: number) => {
    const newFlags = new Set(foundFlags)
    if (newFlags.has(index)) {
      newFlags.delete(index)
    } else {
      newFlags.add(index)
    }
    setFoundFlags(newFlags)
  }

  const renderPosterVisual = (type: string) => {
    const rickrollUrl =
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1"

    switch (type) {
      case "poster1":
        return (
          <div className="qr-poster-container qr-poster-wifi">
            <div className="qr-poster-content" style={{ color: "white" }}>
              <div className="qr-poster-title">PACKAGE DELIVERY</div>
              <div className="qr-poster-subtitle">
                You missed your delivery!
              </div>
              <div className="qr-poster-qr">
                <div style={{ background: "white", padding: "8px" }}>
                  <QRCode value={rickrollUrl} size={48} />
                </div>
              </div>
              <div className="qr-poster-footer" style={{ fontSize: "0.75rem" }}>
                Scan to reschedule • Act now!
              </div>
            </div>
          </div>
        )

      case "poster2":
        return (
          <div className="qr-poster-container qr-poster-survey">
            <div className="qr-poster-content" style={{ color: "white" }}>
              <div style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
                University Research Survey
              </div>
              <div style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>
                Impact of Inflation Study
              </div>
              <div className="qr-poster-qr">
                <div style={{ background: "white", padding: "8px" }}>
                  <QRCode value={rickrollUrl} size={48} />
                </div>
              </div>
              <div className="qr-poster-badge">WIN €50 AMAZON VOUCHER!</div>
              <div
                style={{
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                  opacity: 0.8,
                }}
              >
                Study-Research Institute
              </div>
            </div>
          </div>
        )

      case "menu":
        return (
          <div className="qr-poster-container qr-poster-menu">
            <div className="qr-poster-content">
              <div className="qr-poster-title qr-poster-title-menu">
                Bella Cucina
              </div>
              <div className="qr-poster-subtitle qr-poster-subtitle-menu">
                Est. 1985
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                  color: "#451a03",
                }}
              >
                View Our Menu
              </div>
              <div className="qr-poster-qr qr-poster-qr-menu">
                <div style={{ background: "white", padding: "8px" }}>
                  <QRCode value={rickrollUrl} size={48} />
                </div>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#451a03" }}>
                Scan to browse our dishes
              </div>
              <div className="qr-poster-footer qr-poster-footer-menu">
                www.bellacucina-restaurant.com
              </div>
            </div>
          </div>
        )

      case "parking":
        return (
          <div className="qr-poster-container qr-poster-parking">
            <div className="qr-poster-pattern-gradient"></div>
            <div className="qr-poster-content" style={{ color: "#111827" }}>
              <div className="qr-poster-title qr-poster-title-parking">
                PARKING PAYMENT
              </div>
              <div className="qr-poster-subtitle qr-poster-subtitle-parking">
                Quick Pay - Scan Here
              </div>
              <div className="qr-poster-qr qr-poster-qr-parking">
                <div style={{ background: "white", padding: "10px" }}>
                  <QRCode value={rickrollUrl} size={60} />
                </div>
              </div>
              <div className="qr-poster-footer qr-poster-footer-parking">
                PAY NOW TO AVOID FINE
              </div>
            </div>
          </div>
        )

      default:
        return <div className="qr-poster-container">QR Code Poster</div>
    }
  }

  if (gameState === "intro") {
    return (
      <>
        <style>{styles}</style>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 4,
          }}
          className="qr-game-container"
        >
          <div className="qr-card">
            <div className="qr-card-header qr-card-header-intro">
              <div className="qr-card-header-flex">
                <div className="qr-blob-container">
                  <div className="qr-blob-glow"></div>
                  <ScambertIcon size={50} animate mode="lecturer" />
                </div>
                <div>
                  <h1 className="qr-title">QR Code Scam Detective</h1>
                  <p className="qr-subtitle">
                    Learn to spot malicious QR codes
                  </p>
                </div>
              </div>
            </div>

            <div className="qr-card-content">
              <div className="qr-space-y">
                <div className="qr-info-box">
                  <div className="qr-info-header">
                    <GraduationCap className="qr-icon-amber" size={20} />
                    <h2 className="qr-info-title">What You'll Learn:</h2>
                  </div>

                  <div className="qr-info-items">
                    <div className="qr-info-item">
                      <CheckCircle className="qr-icon-green" size={16} />
                      <span>Identify red flags in QR code posters</span>
                    </div>
                    <div className="qr-info-item">
                      <CheckCircle className="qr-icon-green" size={16} />
                      <span>Understand common scam tactics</span>
                    </div>
                    <div className="qr-info-item">
                      <CheckCircle className="qr-icon-green" size={16} />
                      <span>Practice safe scanning habits</span>
                    </div>
                  </div>
                </div>

                <div className="qr-alert-box">
                  <div className="qr-alert-content">
                    <AlertTriangle className="qr-icon-orange" size={16} />
                    <div className="qr-alert-text">
                      Vouchers and prizes are powerful hooks for QR scams.
                    </div>
                  </div>
                </div>

                <button onClick={startGame} className="qr-button">
                  Start Training
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )
  }

  if (gameState === "playing") {
    const scenario = scenarios[currentScenario]
    const allFlags = scenario.isScam ? scenario.redFlags : scenario.safePoints

    return (
      <>
        <style>{styles}</style>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="qr-game-container"
        >
          <div className="qr-card">
            <div className="qr-card-header">
              <div className="qr-card-header-flex-between">
                <div className="qr-card-header-flex">
                  <div className="qr-blob-container">
                    <div className="qr-blob-glow qr-blob-glow-blue"></div>
                    <ScambertIcon size={40} animate />
                  </div>
                  <div>
                    <h2 className="qr-title">
                      Scenario {currentScenario + 1}/{scenarios.length}
                    </h2>
                    <div className="qr-score-detail">
                      <Award size={12} />
                      Score: {score}/{scenarios.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="qr-card-content">
              <div className="qr-space-y">
                {renderPosterVisual(scenario.image)}

                <div className="qr-context-box">
                  <p className="qr-context-text">{scenario.context}</p>
                </div>

                {!showExplanation && (
                  <>
                    <div>
                      <div className="qr-clues-header">
                        <Eye className="qr-icon-blue" size={16} />
                        <h3 className="qr-clues-title">Inspect for clues:</h3>
                      </div>
                      <div className="qr-info-items">
                        {allFlags.map((flag, idx) => (
                          <div key={idx} className="qr-info-item">
                            <span
                              style={{
                                color: "#94a3b8",
                                marginRight: "0.5rem",
                              }}
                            >
                              •
                            </span>
                            <span>{flag}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="qr-divider">
                      <p className="qr-question">
                        Would you scan this QR code?
                      </p>
                      <div className="qr-button-grid">
                        <button
                          onClick={() => makeChoice("safe")}
                          className="qr-button qr-button-green"
                        >
                          <CheckCircle size={16} />
                          Safe
                        </button>
                        <button
                          onClick={() => makeChoice("scam")}
                          className="qr-button qr-button-red"
                        >
                          <XCircle size={16} />
                          Scam
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="qr-space-y"
                  >
                    <div
                      className={`qr-result-box ${
                        choices[choices.length - 1]
                          ? "qr-result-box-correct"
                          : "qr-result-box-incorrect"
                      }`}
                    >
                      <div className="qr-result-content">
                        {choices[choices.length - 1] ? (
                          <CheckCircle
                            className="qr-icon-result-correct"
                            size={20}
                          />
                        ) : (
                          <XCircle
                            className="qr-icon-result-incorrect"
                            size={20}
                          />
                        )}
                        <div>
                          <h3
                            className={`qr-result-title ${
                              choices[choices.length - 1]
                                ? "qr-result-title-correct"
                                : "qr-result-title-incorrect"
                            }`}
                          >
                            {choices[choices.length - 1]
                              ? "Correct!"
                              : "Not quite!"}
                          </h3>
                          <p
                            className={`qr-result-text ${
                              choices[choices.length - 1]
                                ? "qr-result-text-correct"
                                : "qr-result-text-incorrect"
                            }`}
                          >
                            {scenario.explanation}
                          </p>
                          {scenario.link && (
                            <a
                              href={scenario.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="qr-result-text"
                            >
                              {scenario.link.text}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <button onClick={nextScenario} className="qr-button">
                      {currentScenario < scenarios.length - 1
                        ? "Next Scenario"
                        : "See Results"}
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )
  }

  if (gameState === "summary") {
    const percentage = Math.round((score / scenarios.length) * 100)

    return (
      <>
        <style>{styles}</style>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="qr-game-container"
        >
          <div className="qr-card">
            <div className="qr-card-header">
              <div className="qr-card-header-flex-between">
                <div className="qr-card-header-flex">
                  <div className="qr-blob-container">
                    <div className="qr-blob-glow"></div>
                    <ScambertIcon size={50} animate mode="lecturer" />
                  </div>
                  <div>
                    <h1 className="qr-title qr-title-large">
                      Training Complete!
                    </h1>
                    <p className="qr-subtitle">Professor Scammerblob</p>
                  </div>
                </div>
                <button
                  onClick={startGame}
                  className="qr-button qr-button-icon"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            <div className="qr-card-content">
              <div className="qr-space-y">
                <div className="qr-score-container">
                  <Award className="qr-score-icon" size={64} />
                  <div className="qr-score-percentage">{percentage}%</div>
                  <p className="qr-score-text">
                    You got {score} out of {scenarios.length} correct
                  </p>
                </div>

                <div className="qr-info-box">
                  <div className="qr-info-header">
                    <GraduationCap className="qr-icon-amber" size={20} />
                    <h2 className="qr-info-title">Key Takeaways:</h2>
                  </div>

                  <div className="qr-info-items">
                    <div className="qr-info-item">
                      <Shield className="qr-icon-blue" size={16} />
                      <span>
                        <strong>Check for official branding</strong> -
                        Legitimate QR codes have clear logos
                      </span>
                    </div>
                    <div className="qr-info-item">
                      <Shield className="qr-icon-blue" size={16} />
                      <span>
                        <strong>Beware prizes/vouchers</strong> - Too good to be
                        true offers are bait
                      </span>
                    </div>
                    <div className="qr-info-item">
                      <Shield className="qr-icon-blue" size={16} />
                      <span>
                        <strong>Watch for layered stickers</strong> - Stickers
                        placed over originals are a red flag
                      </span>
                    </div>
                    <div className="qr-info-item">
                      <Shield className="qr-icon-blue" size={16} />
                      <span>
                        <strong>Preview URLs</strong> - Check the URL before
                        opening
                      </span>
                    </div>
                    <div className="qr-info-item">
                      <Shield className="qr-icon-blue" size={16} />
                      <span>
                        <strong>Trust your instincts</strong> - If it feels off,
                        don't scan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="qr-alert-box">
                  <p className="qr-alert-text">
                    You're now equipped to spot QR scams that fool most people.
                    Stay sharp!
                  </p>
                </div>

                <button onClick={startGame} className="qr-button">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )
  }

  return null
}

export default QRScamGame
