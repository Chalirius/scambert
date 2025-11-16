import { useState, useEffect, useRef } from "react"
import { BossScambertIcon } from "./chatbot-components/BossScambertIcon"
import { BossBattle } from "./chatbot-components/BossBattle"
import {
  Send,
  RotateCcw,
  GraduationCap,
  ExternalLink,
  Link,
  Crown,
  Award,
  Trophy,
  Star,
  Frown,
  BookOpen,
  Sparkles,
  Flame,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import {
  getScamTypeFromResponse,
  ScamType,
  scamTypes,
} from "./chatbot-components/ScamData"
import ScambertIcon from "./ScambertIcon"
import "./chatbot-components/chatbot.css"

interface Message {
  id: string
  text: string
  sender: "user" | "Scambert"
  timestamp: Date
}

type AppMode =
  | "chatting"
  | "followup"
  | "caught"
  | "learning"
  | "waitingForOutcome"

const scammerResponses = [
  "Congratulations! You've won $1,000,000! Just send me your bank details to claim your prize! 😈",
  "Hello dear, I am an Estonian prince and I need your help transferring funds...",
  "Your computer has a virus! Click this link immediately to fix it!",
  "This is the IRS. You owe $5,000 in back taxes. Pay now or face arrest!",
  "Hot singles in your area want to meet you! Just provide your credit card for verification...",
  "Your package is stuck at customs. Send $500 to release it!",
  "I'm stranded in a foreign country and lost my wallet. Can you wire me money?",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "You've been selected for a special investment opportunity! Send money now to get rich quick!",
  "Click this link, I promise you it won't be a rick roll: https://www.youtube.com/watch?v=F-k2AwyoaJ0",
]

// Map response index to scam type key
const responseToScamTypeMap: Record<number, string> = {
  0: "lottery",
  1: "inheritance",
  2: "techSupport",
  3: "tax",
  4: "romance",
  5: "delivery",
  6: "stranded",
  7: "investment",
  8: "investment",
  9: "investment",
  10: "investment",
  11: "investment",
  12: "investment",
  13: "investment",
  14: "investment",
  15: "investment",
  16: "investment",
  // Index 17 is rick roll - no scam type
}

// Weighted random selection that prioritizes scam types not yet encountered
function getWeightedRandomResponse(
  avoidedScamTypes: Set<string>,
  fallenForScamTypes: Set<string> = new Set(),
  rickRollCompleted: boolean = false,
  learnedScamTypes: Set<string> = new Set()
): string {
  // Get all unique scam types from the response map
  const allScamTypes = new Set(Object.values(responseToScamTypeMap))

  // Check if ALL scam types have been avoided (8 total scam types)
  const allScamTypesAvoided = Array.from(allScamTypes).every((scamType) =>
    avoidedScamTypes.has(scamType)
  )

  // Check if there are any scam types not yet avoided
  const hasUnavoidedScams = Array.from(allScamTypes).some(
    (scamType) => !avoidedScamTypes.has(scamType)
  )

  const weights = scammerResponses.map((_, index) => {
    const scamTypeKey = responseToScamTypeMap[index]

    // Rick roll (index 17) - easter egg with moderate discoverability
    if (index === 17) {
      // Check if learned
      const hasLearnedRickRoll = learnedScamTypes.has("rickRoll")

      // If Rick Roll has been completed AND learned, make it rare (1%)
      if (rickRollCompleted && hasLearnedRickRoll) {
        return 0.01
      }

      // If there are unavoided scams, make Rick Roll much less likely (5%)
      // so it doesn't dominate over unavoided scams
      if (hasUnavoidedScams) {
        return 0.05
      }

      // If no unavoided scams left and Rick Roll hasn't been fully explored,
      // give it moderate weight (30%) to make it discoverable
      if (!rickRollCompleted || !hasLearnedRickRoll) {
        return 0.3
      }

      // Fallback for rare edge cases
      return 0.01
    }

    if (scamTypeKey) {
      const hasAvoided = avoidedScamTypes.has(scamTypeKey)
      const hasFallenFor = fallenForScamTypes.has(scamTypeKey)

      // PHASE 1: Prioritize completing all "Scam Types Avoided" routes
      if (!allScamTypesAvoided) {
        // High priority (90%): Has NOT been avoided yet
        if (!hasAvoided) {
          return 0.9
        }
        // Very low priority (0.5%): Has been avoided already
        return 0.005
      }

      // PHASE 2: Once all scam types are avoided, prioritize "Fallen For" routes
      if (allScamTypesAvoided) {
        // High priority (90%): Has NOT fallen for yet (regardless of avoided status)
        if (!hasFallenFor) {
          return 0.9
        }
        // Low priority (0.5%): Has fallen for already
        return 0.005
      }
    }

    // Default weight for other responses
    return 0.9
  })

  // Debug logging to help track scam type distribution
  const scamTypeCounts: Record<
    string,
    {
      highPriority: number
      lowPriority: number
      rickRollLow: number
      rickRollMod: number
      rickRollRare: number
    }
  > = {}
  weights.forEach((weight, index) => {
    const scamTypeKey = responseToScamTypeMap[index]
    if (scamTypeKey) {
      if (!scamTypeCounts[scamTypeKey]) {
        scamTypeCounts[scamTypeKey] = {
          highPriority: 0,
          lowPriority: 0,
          rickRollLow: 0,
          rickRollMod: 0,
          rickRollRare: 0,
        }
      }
      if (weight === 0.9) scamTypeCounts[scamTypeKey].highPriority++
      else if (weight === 0.005) scamTypeCounts[scamTypeKey].lowPriority++
    } else if (index === 17) {
      // Rick Roll tracking
      if (!scamTypeCounts["rickRoll"]) {
        scamTypeCounts["rickRoll"] = {
          highPriority: 0,
          lowPriority: 0,
          rickRollLow: 0,
          rickRollMod: 0,
          rickRollRare: 0,
        }
      }
      if (weight === 0.05) scamTypeCounts["rickRoll"].rickRollLow++
      else if (weight === 0.3) scamTypeCounts["rickRoll"].rickRollMod++
      else if (weight === 0.01) scamTypeCounts["rickRoll"].rickRollRare++
    }
  })
  console.log("Scam Type Weights:", scamTypeCounts)
  console.log("All Scam Types Avoided:", allScamTypesAvoided)
  console.log("Has Unavoided Scams:", hasUnavoidedScams)
  console.log("Scam Type Weights:", scamTypeCounts)
  console.log("Current State:", {
    avoidedScamTypes: Array.from(avoidedScamTypes),
    fallenForScamTypes: Array.from(fallenForScamTypes),
    learnedScamTypes: Array.from(learnedScamTypes),
    rickRollCompleted,
  })

  // Calculate total weight
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  // Select random value based on weights
  let random = Math.random() * totalWeight

  for (let i = 0; i < scammerResponses.length; i++) {
    random -= weights[i]
    if (random <= 0) {
      return scammerResponses[i]
    }
  }

  // Fallback (should never reach here)
  return scammerResponses[0]
}

// Helper function to render text with clickable links
function renderMessageWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-orange-400 transition-colors"
        >
          {part}
        </a>
      )
    }
    return part
  })
}

// Achievement tracking types
interface AchievementProgress {
  totalRoutesCompleted: number
  avoidedScamTypes: Set<string>
  fallenForScamTypes: Set<string>
  rickRollCompleted: boolean
  learnedScamTypes: Set<string>
  readRickRollText: boolean
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<AppMode>("chatting")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello there... I have a very *legitimate* business proposal for you...",
      sender: "Scambert",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [currentScamType, setCurrentScamType] = useState<ScamType | null>(null)
  const [lastScamResponse, setLastScamResponse] = useState<string>("")
  const [wasSuccessful, setWasSuccessful] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem("Scambert_welcome_seen") === "true"
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Boss Battle state
  const [showBossIcon, setShowBossIcon] = useState(false) // Boss icon spawned
  const [showBossBattle, setShowBossBattle] = useState(false) // Battle window open
  const [bossName, setBossName] = useState("")
  const [hasDefeatedBoss, setHasDefeatedBoss] = useState(() => {
    return localStorage.getItem("Scambert_boss_defeated") === "true"
  })
  const [showChampionTitle, setShowChampionTitle] = useState(false)

  // Achievement tracking
  const [achievementProgress, setAchievementProgress] =
    useState<AchievementProgress>(() => {
      const saved = localStorage.getItem("Scambert_achievements")
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...parsed,
          avoidedScamTypes: new Set(parsed.avoidedScamTypes || []),
          fallenForScamTypes: new Set(parsed.fallenForScamTypes || []),
          learnedScamTypes: new Set(parsed.learnedScamTypes || []),
        }
      }
      return {
        totalRoutesCompleted: 0,
        avoidedScamTypes: new Set<string>(),
        fallenForScamTypes: new Set<string>(),
        rickRollCompleted: false,
        learnedScamTypes: new Set<string>(),
        readRickRollText: false,
      }
    })
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [showRickRollAchievement, setShowRickRollAchievement] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // Don't autoscroll on ending screens
    if (mode !== "caught" && mode !== "learning") {
      scrollToBottom()
    }
  }, [messages, showQuickReplies, mode])

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "Scambert_achievements",
      JSON.stringify({
        totalRoutesCompleted: achievementProgress.totalRoutesCompleted,
        avoidedScamTypes: Array.from(achievementProgress.avoidedScamTypes),
        fallenForScamTypes: Array.from(achievementProgress.fallenForScamTypes),
        rickRollCompleted: achievementProgress.rickRollCompleted,
        learnedScamTypes: Array.from(achievementProgress.learnedScamTypes),
        readRickRollText: achievementProgress.readRickRollText,
      })
    )
  }, [achievementProgress])

  // Helper function to check if player has all achievements (for mega achievement)
  // Requirements for MEGAACHIEVEMENT:
  // 1. Complete at least 1 route (First Steps)
  // 2. Complete at least 3 routes (Getting Good)
  // 3. Successfully click Rick Roll link (Never Gonna Give You Up)
  // 4. Avoid all 8 regular scam types (Scam Master)
  // 5. Fall for all 8 regular scam types (Easily Fooled)
  // 6. Complete all 16 outcomes - 8 avoided + 8 fallen (HYPERGAMER)
  // 7. Click "What do I learn?" for all 9 scam types including Rick Roll (Wise One)
  // 8. Read the Rick Roll educational text completely (Learned - masterful at reading text!)
  const checkForMegaAchievement = (progress: AchievementProgress): boolean => {
    const hasFirst = progress.totalRoutesCompleted >= 1
    const hasThird = progress.totalRoutesCompleted >= 3
    const hasRickRoll = progress.rickRollCompleted
    const hasMaster = progress.avoidedScamTypes.size === 8
    const hasGullible = progress.fallenForScamTypes.size === 8
    const hasHypergamer =
      progress.avoidedScamTypes.size === 8 &&
      progress.fallenForScamTypes.size === 8
    const hasWiseOne = progress.learnedScamTypes.size === 9
    const hasReadRickRoll = progress.readRickRollText

    // Debug logging
    console.log("Mega Achievement Check:", {
      hasFirst,
      hasThird,
      hasRickRoll,
      hasMaster,
      hasGullible,
      hasHypergamer,
      hasWiseOne,
      hasReadRickRoll,
      totalRoutesCompleted: progress.totalRoutesCompleted,
      avoidedScamTypes: progress.avoidedScamTypes.size,
      fallenForScamTypes: progress.fallenForScamTypes.size,
      learnedScamTypes: progress.learnedScamTypes.size,
      readRickRollText: progress.readRickRollText,
    })

    return (
      hasFirst &&
      hasThird &&
      hasRickRoll &&
      hasMaster &&
      hasGullible &&
      hasHypergamer &&
      hasWiseOne &&
      hasReadRickRoll
    )
  }

  // Check and award achievements
  const checkAchievements = (
    scamType: ScamType | null,
    wasSuccessful: boolean,
    scamResponse: string
  ) => {
    const achievements: string[] = []
    const newProgress = { ...achievementProgress }

    console.log("checkAchievements called:", {
      scamTypeName: scamType?.name,
      wasSuccessful,
      scamResponsePreview: scamResponse.substring(0, 50),
    })

    // Check for rick roll completion
    if (scamResponse.toLowerCase().includes("rick roll") && wasSuccessful) {
      if (!achievementProgress.rickRollCompleted) {
        achievements.push("rickroll")
        newProgress.rickRollCompleted = true
      }
    }

    // Track route completion and scam types (avoided or fallen for)
    if (scamType) {
      // Find which scam type this is
      const scamTypeKey = Object.keys(scamTypes).find(
        (key) => scamTypes[key] === scamType
      )

      console.log("Scam type key found:", scamTypeKey)

      // Skip rick roll for the fallen/avoided tracking (it's a special easter egg)
      if (scamTypeKey && scamTypeKey !== "rickRoll") {
        if (wasSuccessful) {
          // Track avoided scam types
          if (!achievementProgress.avoidedScamTypes.has(scamTypeKey)) {
            newProgress.avoidedScamTypes = new Set(
              achievementProgress.avoidedScamTypes
            )
            newProgress.avoidedScamTypes.add(scamTypeKey)
            console.log("Added to avoided:", scamTypeKey)
          }
        } else {
          // Track fallen for scam types
          if (!achievementProgress.fallenForScamTypes.has(scamTypeKey)) {
            newProgress.fallenForScamTypes = new Set(
              achievementProgress.fallenForScamTypes
            )
            newProgress.fallenForScamTypes.add(scamTypeKey)
            console.log("Added to fallen for:", scamTypeKey)
          }
        }
      }
    }

    // Increment total routes
    const newTotal = achievementProgress.totalRoutesCompleted + 1
    newProgress.totalRoutesCompleted = newTotal

    // Check for route milestones
    if (newTotal === 1) {
      achievements.push("first")
    }
    if (newTotal === 3) {
      achievements.push("third")
    }

    // Check for all scam types avoided (8 different types)
    if (newProgress.avoidedScamTypes.size === 8) {
      if (achievementProgress.avoidedScamTypes.size < 8) {
        achievements.push("master")
      }
    }

    // Check for fallen for all scam types (8 different types)
    if (newProgress.fallenForScamTypes.size === 8) {
      if (achievementProgress.fallenForScamTypes.size < 8) {
        achievements.push("gullible")
      }
    }

    // Check for HYPERGAMER - all 16 outcomes (avoided all 8 AND fallen for all 8)
    if (
      newProgress.avoidedScamTypes.size === 8 &&
      newProgress.fallenForScamTypes.size === 8
    ) {
      if (
        !(
          achievementProgress.avoidedScamTypes.size === 8 &&
          achievementProgress.fallenForScamTypes.size === 8
        )
      ) {
        achievements.push("hypergamer")
      }
    }

    // Check for mega achievement (only after hypergamer check)
    const hasMegaAchievement = checkForMegaAchievement(newProgress)
    const hadMegaAchievement = checkForMegaAchievement(achievementProgress)
    if (hasMegaAchievement && !hadMegaAchievement) {
      achievements.push("megaachievement")
    }

    setAchievementProgress(newProgress)
    setNewAchievements(achievements)
  }

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue
    if (!messageText.trim()) return

    // Hide quick replies when user sends a message
    setShowQuickReplies(false)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Check if user said "YES" - show follow-up message!
    if (messageText.includes("YES, let's do this!")) {
      setTimeout(() => {
        // Store the scam type for the follow-up
        const scamType = getScamTypeFromResponse(lastScamResponse)
        setCurrentScamType(scamType)

        const followUpMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: scamType.followUpMessage,
          sender: "Scambert",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, followUpMsg])
        setMode("followup")
      }, 1000)
      return
    }

    // Check if user said "NO" - they successfully avoided the scam!
    if (messageText.includes("NO. I'm not 100% sure you're legitimate.")) {
      setTimeout(() => {
        // Store the scam type for learning
        const scamType = getScamTypeFromResponse(lastScamResponse)
        setCurrentScamType(scamType)
        setWasSuccessful(true)

        const successMsg: Message = {
          id: (Date.now() + 1).toString(),
          text:
            scamType?.defeatMessage ||
            "Oh my... You're too smart for me! You spotted my tricks! 😤",
          sender: "Scambert",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, successMsg])
        setMode("waitingForOutcome")
      }, 1000)
      return
    }

    // Normal scammer response
    setTimeout(() => {
      const randomResponse = getWeightedRandomResponse(
        achievementProgress.avoidedScamTypes,
        achievementProgress.fallenForScamTypes,
        achievementProgress.rickRollCompleted,
        achievementProgress.learnedScamTypes
      )
      setLastScamResponse(randomResponse)
      const scammerMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "Scambert",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, scammerMessage])
      // Show quick replies again after scammer responds
      setShowQuickReplies(true)
    }, 1000)
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const handleLearn = () => {
    setMode("learning")

    // Track learned scam type
    if (currentScamType) {
      const scamTypeKey = Object.keys(scamTypes).find(
        (key) => scamTypes[key] === currentScamType
      )

      console.log("handleLearn called:", {
        currentScamTypeName: currentScamType?.name,
        scamTypeKey,
        alreadyLearned: scamTypeKey
          ? achievementProgress.learnedScamTypes.has(scamTypeKey)
          : "N/A",
        currentLearnedTypes: Array.from(achievementProgress.learnedScamTypes),
      })

      if (
        scamTypeKey &&
        !achievementProgress.learnedScamTypes.has(scamTypeKey)
      ) {
        const newProgress = { ...achievementProgress }
        newProgress.learnedScamTypes = new Set(
          achievementProgress.learnedScamTypes
        )
        newProgress.learnedScamTypes.add(scamTypeKey)

        console.log("Adding new learned scam type:", scamTypeKey)
        console.log(
          "New learned types:",
          Array.from(newProgress.learnedScamTypes)
        )

        const achievements: string[] = []

        // Check for Wise One achievement (learned all 9 scam types)
        if (
          newProgress.learnedScamTypes.size === 9 &&
          achievementProgress.learnedScamTypes.size < 9
        ) {
          achievements.push("wiseone")
        }

        // Check for mega achievement
        const hasMegaAchievement = checkForMegaAchievement(newProgress)
        const hadMegaAchievement = checkForMegaAchievement(achievementProgress)
        if (hasMegaAchievement && !hadMegaAchievement) {
          achievements.push("megaachievement")
        }

        setAchievementProgress(newProgress)
        if (achievements.length > 0) {
          setNewAchievements((prev) => [...prev, ...achievements])
        }
      }
    } else {
      console.warn("handleLearn called but currentScamType is null!")
    }
  }

  const handleReadRickRoll = () => {
    if (!achievementProgress.readRickRollText) {
      const newProgress = { ...achievementProgress }
      newProgress.readRickRollText = true

      const achievements: string[] = ["readrickroll"]

      // Check for mega achievement
      const hasMegaAchievement = checkForMegaAchievement(newProgress)
      const hadMegaAchievement = checkForMegaAchievement(achievementProgress)
      if (hasMegaAchievement && !hadMegaAchievement) {
        achievements.push("megaachievement")
      }

      setAchievementProgress(newProgress)
      setNewAchievements((prev) => [...prev, ...achievements])

      // Show the small achievement animation
      setShowRickRollAchievement(true)
      setTimeout(() => setShowRickRollAchievement(false), 3000)
    }
  }

  const handleClickLink = () => {
    setWasSuccessful(false)
    const caughtMessage: Message = {
      id: Date.now().toString(),
      text: "Got you! You fell for it! I have caught you! 😈🎣",
      sender: "Scambert",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, caughtMessage])
    setMode("waitingForOutcome")
  }

  const handleProceedToOutcome = () => {
    setMode("caught")
    // Check achievements when route is completed
    checkAchievements(currentScamType, wasSuccessful, lastScamResponse)
  }

  const handleTryAgain = () => {
    setMode("chatting")
    setWasSuccessful(false)
    const randomResponse = getWeightedRandomResponse(
      achievementProgress.avoidedScamTypes,
      achievementProgress.fallenForScamTypes,
      achievementProgress.rickRollCompleted,
      achievementProgress.learnedScamTypes
    )
    setLastScamResponse(randomResponse)
    setMessages([
      {
        id: Date.now().toString(),
        text: "Well then, let's see if you can catch me this time... 😏",
        sender: "Scambert",
        timestamp: new Date(),
      },
      {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "Scambert",
        timestamp: new Date(),
      },
    ])
    setShowQuickReplies(true)
  }

  const handleResetClick = () => {
    // Close the chat window and show reset confirmation
    setIsOpen(false)
    setShowResetConfirm(true)
  }

  const performReset = (resetProgress: boolean) => {
    // If resetting progress, clear all achievements
    if (resetProgress) {
      const freshProgress = {
        totalRoutesCompleted: 0,
        avoidedScamTypes: new Set<string>(),
        fallenForScamTypes: new Set<string>(),
        rickRollCompleted: false,
        learnedScamTypes: new Set<string>(),
        readRickRollText: false,
      }
      setAchievementProgress(freshProgress)
      setNewAchievements([])
      localStorage.removeItem("Scambert-achievement-progress")
      localStorage.removeItem("Scambert_boss_defeated")
      localStorage.removeItem("Scambert_welcome_seen")
      setHasDefeatedBoss(false)
      setShowBossIcon(false)
      setShowBossBattle(false)
      setHasSeenWelcome(false)
    }

    setMode("chatting")
    setWasSuccessful(false)
    const randomResponse = getWeightedRandomResponse(
      resetProgress ? new Set<string>() : achievementProgress.avoidedScamTypes,
      resetProgress
        ? new Set<string>()
        : achievementProgress.fallenForScamTypes,
      resetProgress ? false : achievementProgress.rickRollCompleted,
      resetProgress ? new Set<string>() : achievementProgress.learnedScamTypes
    )
    setLastScamResponse(randomResponse)
    setMessages([
      {
        id: "1",
        text: "Hello there... I have a very *legitimate* business proposal for you...",
        sender: "Scambert",
        timestamp: new Date(),
      },
    ])
    setInputValue("")
    setShowQuickReplies(true)
    setCurrentScamType(null)
    setShowResetConfirm(false)
  }

  const handleUnleashBoss = () => {
    // Randomize boss name
    const names = ["SCAMMY", "SCAMBERT"]
    const randomName = names[Math.floor(Math.random() * names.length)]
    setBossName(randomName)
    setShowBossIcon(true) // Spawn the boss icon (doesn't open battle yet)
  }

  const handleBossIconClick = () => {
    setShowBossBattle(true) // Open the battle window when boss icon is clicked
  }

  const handleBossVictory = () => {
    setHasDefeatedBoss(true)
    localStorage.setItem("Scambert_boss_defeated", "true")
    setShowChampionTitle(true)
    setTimeout(() => {
      setShowBossBattle(false)
      setShowBossIcon(false) // Remove boss icon after defeat
    }, 3000)
  }

  const handleCloseBoss = () => {
    setShowBossBattle(false) // Just close the battle window, keep icon visible
  }

  const handleBossBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close if clicking the backdrop itself, not the battle window
    if (e.target === e.currentTarget) {
      setShowBossBattle(false)
    }
  }

  return (
    <>
      {/* Floating Scambert Icon */}
      <motion.div
        className="fixed bottom-8 right-8 z-50 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (!hasSeenWelcome) {
            setShowWelcomeModal(true)
          } else {
            setIsOpen(true)
          }
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          {/* Chat bubble */}
          <motion.div
            className="absolute top-6 -left-28 bg-slate-800 border border-slate-600 rounded-2xl rounded-br-sm px-3 py-1.5 shadow-lg"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            <p className="text-slate-200 text-xs whitespace-nowrap">
              Hey you! Psst!...
            </p>
          </motion.div>

          <div className="absolute inset-0 bg-slate-900/80 rounded-full blur-xl"></div>
          <ScambertIcon
            size={80}
            animate
            mode={
              checkForMegaAchievement(achievementProgress) ? "mega" : "scammer"
            }
          />
        </div>
      </motion.div>

      {/* Floating Boss Icon - Spawns next to main icon */}
      <AnimatePresence>
        {showBossIcon && !hasDefeatedBoss && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 100 }}
            className="fixed bottom-8 right-32 z-50 cursor-pointer"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            <div className="relative">
              {/* Warning pulse */}
              <motion.div
                className="absolute inset-0 bg-red-600/50 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Boss icon with click handler */}
              <BossScambertIcon
                size={90}
                animate
                name={bossName}
                onClick={handleBossIconClick}
              />

              {/* Click indicator */}
              <motion.div
                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-900 border border-red-600 rounded-lg px-3 py-1 shadow-lg whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-red-200 text-xs font-bold">
                  ⚠️ CLICK TO BATTLE! ⚠️
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-950 border border-slate-700 shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="border-b border-orange-900/30 p-6 bg-gradient-to-r from-slate-900/50 via-blue-950/30 to-orange-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {mode === "caught" ? (
                      // Simple icon for ending screen
                      <div className="relative">
                        <div
                          className={`absolute inset-0 rounded-full blur-lg ${
                            checkForMegaAchievement(achievementProgress)
                              ? "bg-yellow-500/30"
                              : "bg-amber-500/20"
                          }`}
                        ></div>
                        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center border-2 border-amber-500/50">
                          {checkForMegaAchievement(achievementProgress) ? (
                            <Crown className="h-7 w-7 text-yellow-200" />
                          ) : (
                            <GraduationCap className="h-7 w-7 text-amber-100" />
                          )}
                        </div>
                      </div>
                    ) : (
                      // Full Scambert icon for other modes
                      <div className="relative">
                        <div
                          className={`absolute inset-0 rounded-full blur-lg ${
                            checkForMegaAchievement(achievementProgress)
                              ? "bg-yellow-500/30"
                              : mode === "learning"
                              ? "bg-amber-500/20"
                              : "bg-blue-500/20"
                          }`}
                        ></div>
                        <ScambertIcon
                          size={60}
                          animate
                          mode={
                            checkForMegaAchievement(achievementProgress)
                              ? "mega"
                              : mode === "learning"
                              ? "lecturer"
                              : "scammer"
                          }
                        />
                      </div>
                    )}
                    <div>
                      <h1 className="text-slate-100">
                        {checkForMegaAchievement(achievementProgress)
                          ? "👑 MEGA CHAMPION Scambert 👑"
                          : mode === "learning" || mode === "caught"
                          ? "Professor Scambert"
                          : "Scambert"}
                      </h1>
                      <p className="text-slate-400 text-sm">
                        {mode === "learning" || mode === "caught"
                          ? "Educational Mode"
                          : "Scam Scenario Simulator"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetClick}
                    className="w-10 h-10 rounded-md border border-orange-700/50 hover:bg-orange-950/30 hover:border-orange-600 flex items-center justify-center transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 text-slate-300" />
                  </button>
                </div>
                <p className="text-slate-500 text-xs mt-3 bg-slate-800/50 p-2 rounded border border-blue-900/30">
                  ⚠️ Educational purposes only - Learn to identify common scam
                  tactics
                </p>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-950 to-slate-900">
                {mode === "learning" && currentScamType ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-amber-950/50 to-orange-950/30 border border-amber-900/50 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <GraduationCap className="h-6 w-6 text-amber-400" />
                        <h2 className="text-amber-100">Scam Analysis</h2>
                      </div>

                      <div className="space-y-4 text-slate-200">
                        <div>
                          <h3 className="text-amber-300 mb-2">
                            Scam Type: {currentScamType.name}
                          </h3>
                          <div className="relative">
                            <p className="text-sm leading-relaxed">
                              {currentScamType.name ===
                              "Rick Roll (Easter Egg)" ? (
                                <>
                                  {currentScamType.description
                                    .split("click here")
                                    .map((part, index, array) => (
                                      <span key={index}>
                                        {part}
                                        {index < array.length - 1 && (
                                          <span className="relative inline-block">
                                            <button
                                              onClick={handleReadRickRoll}
                                              className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                                            >
                                              click here
                                            </button>
                                            <AnimatePresence>
                                              {showRickRollAchievement && (
                                                <motion.div
                                                  initial={{
                                                    opacity: 0,
                                                    scale: 0.5,
                                                    y: 0,
                                                  }}
                                                  animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                    y: -10,
                                                  }}
                                                  exit={{
                                                    opacity: 0,
                                                    scale: 0.5,
                                                    y: -20,
                                                  }}
                                                  transition={{ duration: 0.3 }}
                                                  className="absolute left-0 top-full mt-2 whitespace-nowrap bg-gradient-to-r from-green-950/90 to-emerald-950/90 border border-green-400/50 rounded-md px-3 py-1.5 flex items-center gap-2 z-10"
                                                >
                                                  <BookOpen className="h-4 w-4 text-green-400" />
                                                  <span className="text-green-200 text-xs">
                                                    Achievement Unlocked!
                                                  </span>
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </span>
                                        )}
                                      </span>
                                    ))}
                                </>
                              ) : (
                                currentScamType.description
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded border border-orange-900/30">
                          <h4 className="text-orange-300 mb-2">
                            📊 Statistics
                          </h4>
                          <p className="text-sm mb-2">
                            {currentScamType.statistics}
                          </p>
                          <p className="text-sm text-red-400">
                            {currentScamType.moneyLost}
                          </p>
                        </div>

                        <div className="bg-blue-950/30 p-4 rounded border border-blue-900/50">
                          <h4 className="text-blue-300 mb-2">📚 Learn More</h4>
                          <a
                            href={currentScamType.resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2 underline"
                          >
                            {currentScamType.resource.name}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleTryAgain}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg px-4 py-2 transition-all"
                    >
                      Try Another Scenario
                    </button>
                  </motion.div>
                ) : mode === "caught" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full space-y-6"
                  >
                    {/* Professor and Whiteboard */}
                    <div className="flex items-end justify-center">
                      {/* Whiteboard on stand */}
                      <svg
                        width="180"
                        height="140"
                        viewBox="0 0 180 140"
                        className="flex-shrink-0"
                      >
                        {/* Whiteboard frame */}
                        <rect
                          x="10"
                          y="10"
                          width="160"
                          height="100"
                          fill="#2a2a2a"
                          rx="4"
                        />

                        {/* Whiteboard surface */}
                        <rect
                          x="15"
                          y="15"
                          width="150"
                          height="90"
                          fill="#f8f8f8"
                          rx="2"
                        />

                        {/* Content on whiteboard */}
                        <text
                          x="90"
                          y="35"
                          textAnchor="middle"
                          fill="#1a1a1a"
                          fontSize="14"
                          fontWeight="bold"
                        >
                          Scam Alert! 🚨
                        </text>
                        <line
                          x1="30"
                          y1="45"
                          x2="150"
                          y2="45"
                          stroke="#e5e5e5"
                          strokeWidth="1"
                        />

                        {/* Bullet points */}
                        <circle cx="30" cy="60" r="2" fill="#ff6b6b" />
                        <text x="40" y="63" fill="#4a4a4a" fontSize="10">
                          Check sender details
                        </text>

                        <circle cx="30" cy="75" r="2" fill="#ff6b6b" />
                        <text x="40" y="78" fill="#4a4a4a" fontSize="10">
                          Verify urgency claims
                        </text>

                        <circle cx="30" cy="90" r="2" fill="#ff6b6b" />
                        <text x="40" y="93" fill="#4a4a4a" fontSize="10">
                          Never share passwords
                        </text>

                        {/* Stand pole */}
                        <rect
                          x="85"
                          y="110"
                          width="10"
                          height="25"
                          fill="#3a3a3a"
                        />

                        {/* Stand base */}
                        <ellipse
                          cx="90"
                          cy="135"
                          rx="30"
                          ry="4"
                          fill="#3a3a3a"
                        />
                      </svg>

                      {/* Professor Scambert overlaying the whiteboard */}
                      <div className="-ml-16">
                        <ScambertIcon
                          size={120}
                          animate
                          mode={
                            checkForMegaAchievement(achievementProgress)
                              ? "mega"
                              : "lecturer"
                          }
                          withPointer
                        />
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      {wasSuccessful ? (
                        <>
                          <h2 className="text-green-400">
                            You defeated the scammer! 🎉
                          </h2>
                          <p className="text-slate-300 text-sm max-w-md">
                            Well done! You identified the red flags and avoided
                            falling for the scam. Would you like to learn more
                            about this type of scam?
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="text-red-400">
                            You have been caught! 🎣
                          </h2>
                          <p className="text-slate-300 text-sm max-w-md">
                            This is a learning experience! Would you like to
                            understand what just happened?
                          </p>
                        </>
                      )}
                    </div>

                    {/* Achievements Display */}
                    {newAchievements.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md bg-gradient-to-br from-amber-950/50 to-amber-900/30 border border-amber-600/30 rounded-lg p-4"
                      >
                        <h3 className="text-amber-400 text-center mb-3 flex items-center justify-center gap-2">
                          <Trophy className="h-5 w-5" />
                          New Achievements Unlocked!
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {newAchievements.includes("first") && (
                            <div className="flex items-center gap-2 bg-blue-950/50 border border-blue-600/30 rounded-md px-3 py-2">
                              <Star className="h-4 w-4 text-blue-400" />
                              <span className="text-blue-200 text-sm">
                                First Steps
                              </span>
                            </div>
                          )}
                          {newAchievements.includes("third") && (
                            <div className="flex items-center gap-2 bg-purple-950/50 border border-purple-600/30 rounded-md px-3 py-2">
                              <Award className="h-4 w-4 text-purple-400" />
                              <span className="text-purple-200 text-sm">
                                Getting Good
                              </span>
                            </div>
                          )}
                          {newAchievements.includes("rickroll") && (
                            <div className="flex items-center gap-2 bg-pink-950/50 border border-pink-600/30 rounded-md px-3 py-2">
                              <Trophy className="h-4 w-4 text-pink-400" />
                              <span className="text-pink-200 text-sm">
                                Never Gonna Give You Up
                              </span>
                            </div>
                          )}
                          {newAchievements.includes("master") && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-950/50 to-amber-950/50 border border-yellow-500/50 rounded-md px-3 py-2">
                              <Crown className="h-5 w-5 text-yellow-400" />
                              <span className="text-yellow-200 text-sm">
                                Scam Master
                              </span>
                            </div>
                          )}
                          {newAchievements.includes("gullible") && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-red-950/50 to-orange-950/50 border border-red-500/50 rounded-md px-3 py-2">
                              <Frown className="h-5 w-5 text-red-400" />
                              <span className="text-red-200 text-sm">
                                Easily Fooled
                              </span>
                            </div>
                          )}
                          {newAchievements.includes("hypergamer") && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-950/50 to-blue-950/50 border border-cyan-400/50 rounded-md px-3 py-2">
                              <Trophy className="h-5 w-5 text-cyan-400" />
                              <span className="text-cyan-200 text-sm">
                                HYPERGAMER - Gotta unlock them all!
                              </span>
                            </div>
                          )}
                          {newAchievements.includes("wiseone") && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/50 to-yellow-950/50 border border-amber-400/50 rounded-md px-3 py-2">
                              <BookOpen className="h-5 w-5 text-amber-400" />
                              <span className="text-amber-200 text-sm">
                                Wise One - Knowledge is Power!
                              </span>
                            </div>
                          )}
                          {newAchievements.includes("readrickroll") && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-green-950/50 to-emerald-950/50 border border-green-400/50 rounded-md px-3 py-2">
                              <BookOpen className="h-5 w-5 text-green-400" />
                              <span className="text-green-200 text-sm">
                                Learned - masterful at reading text!
                              </span>
                            </div>
                          )}
                          {newAchievements.includes("megaachievement") && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-900/70 via-pink-900/70 to-purple-900/70 border-2 border-yellow-400 rounded-md px-4 py-3 animate-pulse">
                              <Sparkles className="h-6 w-6 text-yellow-300" />
                              <span className="text-yellow-100 animate-pulse">
                                THE COLLECT ALL ACHIEVEMENTS MEGAACHIEVEMENT!
                              </span>
                              <Sparkles className="h-6 w-6 text-yellow-300" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Overall Progress Display */}
                    <div className="w-full max-w-md bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                      <h4 className="text-slate-300 text-sm mb-3 text-center">
                        Your Progress
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-slate-900/50 rounded-md p-2">
                          <div className="text-2xl text-blue-400">
                            {achievementProgress.totalRoutesCompleted}
                          </div>
                          <div className="text-xs text-slate-400">
                            Routes Completed
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-md p-2">
                          <div className="text-2xl text-green-400">
                            {Math.min(
                              achievementProgress.avoidedScamTypes.size,
                              8
                            )}
                            /8
                          </div>
                          <div className="text-xs text-slate-400">
                            Scam Types Avoided
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center mt-2">
                        <div className="bg-slate-900/50 rounded-md p-2">
                          <div className="text-2xl text-red-400">
                            {Math.min(
                              achievementProgress.fallenForScamTypes.size,
                              8
                            )}
                            /8
                          </div>
                          <div className="text-xs text-slate-400">
                            Fallen For
                          </div>
                        </div>
                        <div className="bg-slate-900/50 rounded-md p-2">
                          <div className="text-2xl text-purple-400">
                            {Math.min(
                              achievementProgress.avoidedScamTypes.size +
                                achievementProgress.fallenForScamTypes.size,
                              16
                            )}
                            /16
                          </div>
                          <div className="text-xs text-slate-400">
                            Total Outcomes
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-center mt-2">
                        <div className="bg-slate-900/50 rounded-md p-2">
                          <div className="text-2xl text-amber-400">
                            {Math.min(
                              achievementProgress.learnedScamTypes.size,
                              9
                            )}
                            /9
                          </div>
                          <div className="text-xs text-slate-400">
                            Scam Types Learned
                          </div>
                        </div>
                      </div>
                      {achievementProgress.totalRoutesCompleted >= 1 && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-blue-400 text-sm">
                          <Star className="h-4 w-4" />
                          <span>First Steps Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.totalRoutesCompleted >= 3 && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-purple-400 text-sm">
                          <Award className="h-4 w-4" />
                          <span>Getting Good Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.rickRollCompleted && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-pink-400 text-sm">
                          <Trophy className="h-4 w-4" />
                          <span>Never Gonna Give You Up Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.avoidedScamTypes.size === 8 && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-yellow-400 text-sm">
                          <Crown className="h-4 w-4" />
                          <span>Scam Master Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.fallenForScamTypes.size === 8 && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-red-400 text-sm">
                          <Frown className="h-4 w-4" />
                          <span>Easily Fooled Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.avoidedScamTypes.size === 8 &&
                        achievementProgress.fallenForScamTypes.size === 8 && (
                          <div className="mt-3 flex items-center justify-center gap-2 text-cyan-400 text-sm">
                            <Trophy className="h-4 w-4" />
                            <span>HYPERGAMER Achieved!</span>
                          </div>
                        )}
                      {achievementProgress.learnedScamTypes.size === 9 && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-amber-400 text-sm">
                          <BookOpen className="h-4 w-4" />
                          <span>Wise One Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.readRickRollText && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-green-400 text-sm">
                          <BookOpen className="h-4 w-4" />
                          <span>Learned - masterful at reading text!</span>
                        </div>
                      )}
                      {checkForMegaAchievement(achievementProgress) && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-sm animate-pulse">
                          <Sparkles className="h-5 w-5 text-yellow-400" />
                          <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                            THE COLLECT ALL ACHIEVEMENTS MEGAACHIEVEMENT!
                          </span>
                          <Sparkles className="h-5 w-5 text-yellow-400" />
                        </div>
                      )}
                      {hasDefeatedBoss && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                          <Crown className="h-5 w-5 text-yellow-400 animate-pulse" />
                          <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-bold">
                            TRUE ASCENDED CHAMPION!
                          </span>
                          <Crown className="h-5 w-5 text-yellow-400 animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-md">
                      <button
                        onClick={handleLearn}
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 border border-amber-500/50 text-white rounded-lg px-4 py-2 transition-all flex items-center justify-center"
                      >
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {wasSuccessful
                          ? "What was this scam about?"
                          : "Oh no! What was this? What do I learn?"}
                      </button>
                      <button
                        onClick={handleTryAgain}
                        className="border border-blue-700/50 bg-blue-950/30 hover:bg-blue-900/50 text-blue-200 rounded-lg px-4 py-2 transition-all"
                      >
                        {wasSuccessful
                          ? "Try another scenario!"
                          : "You shall not defeat me again! Let's have another go at it!"}
                      </button>

                      {/* FINAL BOSS BUTTON - Only shows if requirements met */}
                      {achievementProgress.avoidedScamTypes.size === 8 &&
                        achievementProgress.learnedScamTypes.size === 9 &&
                        !hasDefeatedBoss && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <button
                              onClick={handleUnleashBoss}
                              className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 border-2 border-red-500 text-white font-bold text-lg py-6 shadow-lg shadow-red-900/50 animate-pulse rounded-lg flex items-center justify-center"
                            >
                              <Flame className="h-6 w-6 mr-2 animate-bounce" />
                              UNLEASH THE FINAL BOSS
                              <Flame className="h-6 w-6 ml-2 animate-bounce" />
                            </button>
                          </motion.div>
                        )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={message.id}>
                        <div
                          className={`flex gap-3 ${
                            message.sender === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          {message.sender === "Scambert" && (
                            <div className="flex-shrink-0">
                              <ScambertIcon
                                size={40}
                                mode={
                                  checkForMegaAchievement(achievementProgress)
                                    ? "mega"
                                    : "scammer"
                                }
                              />
                            </div>
                          )}
                          <div
                            className={`rounded-lg p-4 max-w-[80%] ${
                              message.sender === "user"
                                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border border-blue-500/50"
                                : "bg-slate-800 text-slate-200 border border-orange-900/30"
                            }`}
                          >
                            <p>{renderMessageWithLinks(message.text)}</p>
                            <span className="text-xs opacity-60 mt-1 block">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {message.sender === "user" && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white border border-blue-400/50">
                              U
                            </div>
                          )}
                        </div>

                        {/* Quick Reply Buttons - Show after last scammer message */}
                        {message.sender === "Scambert" &&
                          index === messages.length - 1 &&
                          showQuickReplies &&
                          mode === "chatting" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-wrap gap-2 mt-3 ml-14 mr-2"
                            >
                              <button
                                onClick={() =>
                                  handleQuickReply("YES, let's do this!")
                                }
                                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white border border-orange-500/50 whitespace-normal rounded-lg px-4 py-2 transition-all"
                              >
                                YES, let's do this!
                              </button>
                              <button
                                onClick={() =>
                                  handleQuickReply(
                                    "NO. I'm not 100% sure you're legitimate."
                                  )
                                }
                                className="border border-blue-700/50 bg-blue-950/30 hover:bg-blue-900/50 text-blue-200 hover:text-blue-100 whitespace-normal rounded-lg px-4 py-2 transition-all"
                              >
                                NO. I'm not 100% sure you're legitimate.
                              </button>
                            </motion.div>
                          )}

                        {/* Link Button - Show in followup mode */}
                        {message.sender === "Scambert" &&
                          index === messages.length - 1 &&
                          mode === "followup" &&
                          currentScamType && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 ml-14"
                            >
                              <button
                                onClick={handleClickLink}
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border border-red-500/50 rounded-lg px-4 py-2 transition-all flex items-center"
                              >
                                <Link className="h-4 w-4 mr-2" />
                                {currentScamType.linkText}
                              </button>
                            </motion.div>
                          )}

                        {/* Outcome Button - Show after Scambert's final response */}
                        {message.sender === "Scambert" &&
                          index === messages.length - 1 &&
                          mode === "waitingForOutcome" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 ml-14"
                            >
                              <button
                                onClick={handleProceedToOutcome}
                                className={`${
                                  wasSuccessful
                                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border border-green-500/50"
                                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border border-red-500/50"
                                } rounded-lg px-4 py-2 transition-all`}
                              >
                                {wasSuccessful
                                  ? currentScamType?.name?.includes("Rick Roll")
                                    ? "MOAR DAIKONS"
                                    : "Gotcha! 🎉"
                                  : "Oh noes! 😱"}
                              </button>
                            </motion.div>
                          )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              {(mode === "chatting" || mode === "followup") && (
                <div className="border-t border-orange-900/30 p-4 bg-gradient-to-r from-slate-900/50 to-blue-950/20">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type your response..."
                      className="flex-1 bg-slate-800 border border-blue-900/30 text-slate-100 placeholder:text-slate-500 focus:border-blue-700 rounded-lg px-4 py-2 outline-none"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-500/50 rounded-lg px-4 py-2 transition-all flex items-center justify-center"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcomeModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowWelcomeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border-2 border-blue-500/30 rounded-lg p-8 max-w-lg w-full mx-4 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <ScambertIcon size={100} animate mode="scammer" />
                </div>
                <h2 className="text-blue-400 text-2xl mb-2">
                  Welcome, traveler!
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-slate-200">
                  I'm <span className="text-orange-400">Scambert</span>, your
                  shadowy guide through the treacherous world of scams and
                  schemes. Care to test your wits?
                </p>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-300 text-sm mb-3">
                    On this journey, you shall:
                  </p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">⚔️</span>
                      <span>
                        Navigate through interactive scam scenarios and
                        minigames
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">🎓</span>
                      <span>
                        Learn about financial crime with authentic UK fraud
                        statistics
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-0.5">🏆</span>
                      <span>Unlock achievements and track your progress</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">💀</span>
                      <span>Perhaps even face a fearsome boss battle...</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowWelcomeModal(false)
                  }}
                  className="flex-1 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg px-4 py-3 transition-all"
                >
                  Not today
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("Scambert_welcome_seen", "true")
                    setHasSeenWelcome(true)
                    setShowWelcomeModal(false)
                    setIsOpen(true)
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white rounded-lg px-4 py-3 transition-all shadow-lg"
                >
                  Let's begin!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-red-900/50 rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h2 className="text-red-400 text-xl mb-2">Reset All Progress?</h2>
              <p className="text-slate-300 mb-4">
                Are you certain you want to reset all progress? This will
                permanently delete:
              </p>
              <ul className="list-disc list-inside text-slate-400 text-sm mb-4 space-y-1">
                <li>All achievements earned</li>
                <li>Routes completed counter</li>
                <li>Scam types avoided/fallen for records</li>
              </ul>
              <div className="text-red-300 text-sm mb-6">
                This action cannot be undone!
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg px-4 py-2 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => performReset(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition-all"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Boss Battle */}
      <AnimatePresence>
        {showBossBattle && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={handleBossBackdropClick}
          >
            <BossBattle
              bossName={bossName}
              onClose={handleCloseBoss}
              onVictory={handleBossVictory}
              apiEndpoint={undefined} // Using Google Gemini API directly
            />
          </div>
        )}
      </AnimatePresence>

      {/* TRUE ASCENDED CHAMPION Title */}
      <AnimatePresence>
        {showChampionTitle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60]"
          >
            <div className="relative">
              {/* Golden glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 blur-3xl opacity-60 animate-pulse" />

              {/* Main title card */}
              <motion.div
                className="relative bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 p-8 rounded-2xl border-4 border-yellow-300 shadow-2xl"
                animate={{
                  rotate: [0, 2, -2, 2, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <Crown className="h-20 w-20 text-slate-900" />
                  </motion.div>

                  <h1 className="text-5xl font-bold text-slate-900 text-center tracking-wider">
                    TRUE ASCENDED
                  </h1>
                  <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-900 via-slate-900 to-red-900 text-center">
                    CHAMPION
                  </h2>

                  <div className="flex gap-4 mt-2">
                    <Trophy className="h-8 w-8 text-slate-900 animate-bounce" />
                    <Sparkles className="h-8 w-8 text-slate-900 animate-pulse" />
                    <Trophy className="h-8 w-8 text-slate-900 animate-bounce" />
                  </div>

                  <p className="text-slate-800 text-center max-w-md mt-2">
                    You have defeated the Ultimate Scam Boss and proven your
                    mastery of scam identification!
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Champion Badge - Floating indicator if boss defeated */}
      {hasDefeatedBoss && !showBossBattle && !showChampionTitle && (
        <motion.div
          className="fixed top-8 right-8 z-40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 p-3 rounded-full border-2 border-yellow-300 shadow-xl">
            <Crown className="h-6 w-6 text-slate-900" />
          </div>
        </motion.div>
      )}
    </>
  )
}
