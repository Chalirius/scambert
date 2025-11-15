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
    const baseClasses = "w-full h-48 rounded-lg flex items-center justify-center text-sm font-medium";
    
    switch(type) {
      case "poster1":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-red-500 to-orange-500 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 border-4 border-white"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-4 border-white"></div>
            </div>
            <div className="text-center z-10 p-6">
              <div className="text-2xl font-bold mb-2">FREE WIFI!</div>
              <div className="text-lg mb-4">Scan for instant access</div>
              <div className="w-24 h-24 bg-white mx-auto mb-2 flex items-center justify-center">
                <div className="w-20 h-20 bg-black"></div>
              </div>
              <div className="text-xs">Connect now • No password</div>
            </div>
          </div>
        );
      
      case "poster2":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-400 to-blue-600 text-white`}>
            <div className="text-center p-6">
              <div className="text-xl font-bold mb-2">University Research Survey</div>
              <div className="text-sm mb-3">Impact of Inflation Study</div>
              <div className="w-24 h-24 bg-white mx-auto mb-3 flex items-center justify-center">
                <div className="w-20 h-20 bg-black"></div>
              </div>
              <div className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-xs font-bold inline-block">
                WIN €50 AMAZON VOUCHER!
              </div>
              <div className="text-xs mt-2 opacity-80">Study-Research Institute</div>
            </div>
          </div>
        );
      
      case "menu":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 border-4 border-amber-800`}>
            <div className="text-center p-6">
              <div className="text-2xl font-serif font-bold mb-1">Bella Cucina</div>
              <div className="text-sm mb-4">Est. 1985</div>
              <div className="text-lg font-semibold mb-3">View Our Menu</div>
              <div className="w-24 h-24 bg-white mx-auto mb-3 flex items-center justify-center border-2 border-amber-800">
                <div className="w-20 h-20 bg-black"></div>
              </div>
              <div className="text-xs">Scan to browse our dishes</div>
              <div className="text-xs mt-1 opacity-70">www.bellacucina-restaurant.com</div>
            </div>
          </div>
        );
      
      case "parking":
        return (
          <div className={`${baseClasses} bg-gray-200 border-2 border-gray-400 relative`}>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 opacity-50"></div>
            <div className="text-center z-10 p-4">
              <div className="text-xl font-bold text-gray-800 mb-2">PARKING PAYMENT</div>
              <div className="text-sm text-gray-700 mb-3">Quick Pay - Scan Here</div>
              <div className="w-28 h-28 bg-white mx-auto mb-2 flex items-center justify-center shadow-lg transform rotate-2">
                <div className="w-24 h-24 bg-black"></div>
              </div>
              <div className="text-xs text-red-600 font-semibold">PAY NOW TO AVOID FINE</div>
            </div>
          </div>
        );
      
      default:
        return <div className={baseClasses}>QR Code Poster</div>;
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <Shield className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">QR Code Scam Detective</h1>
          <p className="text-gray-600">Learn to spot malicious QR codes before they fool you</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">What You'll Learn:</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Identify red flags in QR code posters and stickers</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Understand common scam tactics (vouchers, urgency, fake branding)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Practice safe QR code scanning habits</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <strong>Did you know?</strong> Research shows that 83% of phishing victims fell for professionally designed QR codes offering vouchers or prizes.
            </div>
          </div>
        </div>

        <button
          onClick={startGame}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Start Training
        </button>
      </div>
    );
  }

  if (gameState === 'playing') {
    const scenario = scenarios[currentScenario];
    const allFlags = scenario.isScam ? scenario.redFlags : scenario.safePoints;
    
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-600">
            Scenario {currentScenario + 1} of {scenarios.length}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
            <Award className="w-4 h-4" />
            Score: {score}/{scenarios.length}
          </div>
        </div>

        <div className="mb-6">
          {renderPosterVisual(scenario.image)}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-800 font-medium">{scenario.context}</p>
        </div>

        {!showExplanation && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-800">Inspect for clues:</h3>
              </div>
              <div className="space-y-2">
                {allFlags.map((flag, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleFlag(idx)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      foundFlags.has(idx)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        foundFlags.has(idx) ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                      }`}>
                        {foundFlags.has(idx) && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-sm">{flag}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-center font-semibold text-gray-800 mb-4">
                Would you scan this QR code?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => makeChoice('safe')}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Safe to Scan
                </button>
                <button
                  onClick={() => makeChoice('scam')}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  It's a Scam!
                </button>
              </div>
            </div>
          </>
        )}

        {showExplanation && (
          <div className="space-y-4">
            <div className={`rounded-lg p-4 ${
              choices[choices.length - 1] 
                ? 'bg-green-50 border-2 border-green-500' 
                : 'bg-red-50 border-2 border-red-500'
            }`}>
              <div className="flex items-start gap-3">
                {choices[choices.length - 1] ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`font-bold mb-2 ${
                    choices[choices.length - 1] ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {choices[choices.length - 1] ? 'Correct!' : 'Not quite!'}
                  </h3>
                  <p className={`text-sm ${
                    choices[choices.length - 1] ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {scenario.explanation}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={nextScenario}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'See Results'}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'summary') {
    const percentage = Math.round((score / scenarios.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <Award className="w-20 h-20 mx-auto mb-4 text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Training Complete!</h2>
          <div className="text-5xl font-bold text-indigo-600 mb-2">{percentage}%</div>
          <p className="text-gray-600">You got {score} out of {scenarios.length} correct</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Takeaways:</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <Shield className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong>Check for official branding:</strong> Legitimate QR codes have clear company logos and contact information</span>
            </li>
            <li className="flex items-start">
              <Shield className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong>Be wary of prizes/vouchers:</strong> Scammers use "too good to be true" offers as bait</span>
            </li>
            <li className="flex items-start">
              <Shield className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong>Look for stickers:</strong> Fake QR stickers placed over legitimate ones are a major red flag</span>
            </li>
            <li className="flex items-start">
              <Shield className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong>Preview URLs:</strong> Most phone cameras show you the URL before opening it - check it!</span>
            </li>
            <li className="flex items-start">
              <Shield className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
              <span><strong>Trust your instincts:</strong> If something feels off, don't scan it</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Remember:</strong> Only 25% of people would refuse to scan suspicious QR codes. Now you're part of the informed minority who can spot the dangers!
          </p>
        </div>

        <button
          onClick={startGame}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default QRScamGame;