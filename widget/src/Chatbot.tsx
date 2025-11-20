import { useState, useEffect, useRef } from "react"
import { BossScambertIcon } from "./chatbot-components/BossScambertIcon"
import BossBattle from "./chatbot-components/BossBattle"
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
        className="sb-link"
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

export default function ChatBot() {
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
  const bossTimeoutRef = useRef<number | null>(null)

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
    // Avoid spawning multiple boss icons if one is already visible
    setShowBossIcon((prev) => {
      if (prev) return prev
      return true
    })
  }

  const handleBossIconClick = () => {
    setShowBossBattle(true) // Open the battle window when boss icon is clicked
  }

  const handleBossVictory = () => {
    setHasDefeatedBoss(true)
    localStorage.setItem("Scambert_boss_defeated", "true")
    setShowChampionTitle(true)
    // Clearable timeout so we don't leak state updates after unmount
    const tid = window.setTimeout(() => {
      setShowBossBattle(false)
      setShowBossIcon(false) // Remove boss icon after defeat
    }, 3000)
    bossTimeoutRef.current = tid
  }

  // Defensive: if multiple floating icons exist in the DOM (e.g., host mounted widget twice), hide extras
  useEffect(() => {
    try {
      const els = document.querySelectorAll('.scambert-float')
      if (els.length > 1) {
        els.forEach((el, i) => {
          if (i > 0) {
            ;(el as HTMLElement).style.display = 'none'
          }
        })
      }
    } catch (err) {
      // ignore
    }
  }, [])

  // clear any timeouts when unmounting to avoid setState on unmounted component
  useEffect(() => {
    return () => {
      if (bossTimeoutRef.current) {
        clearTimeout(bossTimeoutRef.current)
        bossTimeoutRef.current = null
      }
    }
  }, [])

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
        className="scambert-float"
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
            className="scambert-bubble"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            <p className="sb-chat-bubble-text">Hey you! Psst!...</p>
          </motion.div>

          <div></div>
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
            className="sb-boss-icon-container"
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
                className="sb-boss-pulse"
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
                className="sb-boss-click-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="sb-boss-click-indicator-text">
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
            className="sb-dialog-backdrop"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="sb-dialog-container"
            >
              {/* Header */}
              <div className="sb-header">
                <div className="sb-header-content">
                  <div className="sb-header-left">
                    {mode === "caught" ? (
                      // Simple icon for ending screen
                      <div className="sb-icon-wrapper">
                        <div className="sb-avatar-simple">
                          {checkForMegaAchievement(achievementProgress) ? (
                            <Crown size={28} className="sb-icon sb-icon--yellow" />
                          ) : (
                            <GraduationCap size={28} className="sb-icon sb-icon--amber" />
                          )}
                        </div>
                      </div>
                    ) : (
                      // Full Scambert icon for other modes
                      <div className="relative">
                        <div className="sb-amber-glow-wrap">
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
                      </div>
                    )}
                    <div className="sb-header-text">
                      <h1 className="sb-heading">
                        {checkForMegaAchievement(achievementProgress)
                          ? "👑 MEGA CHAMPION Scambert 👑"
                          : mode === "learning" || mode === "caught"
                          ? "Professor Scambert"
                          : "Scambert"}
                      </h1>
                      <p className="sb-muted">
                        {mode === "learning" || mode === "caught"
                          ? "Educational Mode"
                          : "Scam Scenario Simulator"}
                      </p>
                    </div>
                  </div>
                  <button onClick={handleResetClick} className="sb-reset-button">
                    <RotateCcw className="sb-reset-icon" />
                  </button>
                </div>
                <p className="sb-disclaimer">
                  ⚠️ Educational purposes only - Learn to identify common scam
                  tactics
                </p>
              </div>

              {/* Chat Area */}
              <div className="sb-chat-area">
                {mode === "learning" && currentScamType ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="learning-panel"
                  >
                    <div className="sb-learning-content">
                      <div className="sb-learning-header">
                        <GraduationCap className="sb-learning-icon" />
                        <h2 className="sb-learning-title">Scam Analysis</h2>
                      </div>

                      <div className="sb-learning-body">
                        <div>
                          <h3 className="sb-learning-subheader">
                            Scam Type: {currentScamType.name}
                          </h3>
                          <div className="relative">
                            <p className="sb-learning-description">
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
                                              className="sb-link-inline"
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
                                                  className="sb-achievement-inline"
                                                >
                                                  <BookOpen className="sb-achievement-inline-icon" />
                                                  <span className="sb-achievement-inline-text">
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

                        <div className="sb-stats-card">
                          <h4 className="sb-stats-header">📊 Statistics</h4>
                          <p className="sb-card-text">{currentScamType.statistics}</p>
                          <p className="sb-card-urgent">{currentScamType.moneyLost}</p>
                        </div>

                        <div className="sb-learn-card">
                          <h4 className="sb-learn-header">📚 Learn More</h4>
                          <a
                            href={currentScamType.resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sb-learn-link"
                          >
                            {currentScamType.resource.name}
                            <ExternalLink className="sb-learn-icon" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleTryAgain}
                      className="sb-try-button"
                    >
                      Try Another Scenario
                    </button>
                  </motion.div>
                ) : mode === "caught" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="sb-ending-container"
                  >
                    {/* Professor and Whiteboard */}
                    <div className="sb-professor-container">
                      {/* Whiteboard on stand */}
                      <svg
                        width="180"
                        height="140"
                        viewBox="0 0 180 140"
                        className="sb-flex-shrink-0"
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
                      <div className="sb-professor-overlap">
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

                    <div className="sb-ending-text">
                      {wasSuccessful ? (
                        <>
                          <h2 className="sb-ending-title-success">
                            You defeated the scammer! 🎉
                          </h2>
                          <p className="sb-ending-description">
                            Well done! You identified the red flags and avoided
                            falling for the scam. Would you like to learn more
                            about this type of scam?
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="sb-ending-title-failure">
                            You have been caught! 🎣
                          </h2>
                          <p className="sb-ending-description">
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
                        className="sb-achievements-panel"
                      >
                        <h3 className="sb-achievements-title">
                          <Trophy size={20} className="sb-icon sb-icon--amber" />
                          New Achievements Unlocked!
                        </h3>
                        <div className="sb-achievements-list">
                          {newAchievements.includes("first") && (
                            <div className="sb-achievement sb-achievement--first">
                              <Star size={16} className="sb-icon sb-icon--blue" />
                              <span className="sb-achievement-label">First Steps</span>
                            </div>
                          )}
                          {newAchievements.includes("third") && (
                            <div className="sb-achievement sb-achievement--third">
                              <Award size={16} className="sb-icon sb-icon--purple" />
                              <span className="sb-achievement-label">Getting Good</span>
                            </div>
                          )}
                          {newAchievements.includes("rickroll") && (
                            <div className="sb-achievement sb-achievement--rickroll">
                              <Trophy size={16} className="sb-icon sb-icon--pink" />
                              <span className="sb-achievement-label">Never Gonna Give You Up</span>
                            </div>
                          )}
                          {newAchievements.includes("master") && (
                            <div className="sb-achievement sb-achievement--master">
                              <Crown size={20} className="sb-icon sb-icon--yellow" />
                              <span className="sb-achievement-label">Scam Master</span>
                            </div>
                          )}
                          {newAchievements.includes("gullible") && (
                            <div className="sb-achievement sb-achievement--gullible">
                              <Frown size={20} className="sb-icon sb-icon--red" />
                              <span className="sb-achievement-label">Easily Fooled</span>
                            </div>
                          )}
                          {newAchievements.includes("hypergamer") && (
                            <div className="sb-achievement sb-achievement--hypergamer">
                              <Trophy size={20} className="sb-icon sb-icon--cyan" />
                              <span className="sb-achievement-label">HYPERGAMER - Gotta unlock them all!</span>
                            </div>
                          )}
                          {newAchievements.includes("wiseone") && (
                            <div className="sb-achievement sb-achievement--wiseone">
                              <BookOpen size={20} className="sb-icon sb-icon--amber" />
                              <span className="sb-achievement-label">Wise One - Knowledge is Power!</span>
                            </div>
                          )}
                          {newAchievements.includes("readrickroll") && (
                            <div className="sb-achievement sb-achievement--readrickroll">
                              <BookOpen size={20} className="sb-icon sb-icon--green" />
                              <span className="sb-achievement-label">Learned - masterful at reading text!</span>
                            </div>
                          )}
                          {newAchievements.includes("megaachievement") && (
                            <div className="sb-achievement sb-achievement--mega sb-achievement--pulse">
                              <Sparkles size={24} className="sb-icon sb-icon--yellow" />
                              <span className="sb-achievement-label">THE COLLECT ALL ACHIEVEMENTS MEGAACHIEVEMENT!</span>
                              <Sparkles size={24} className="sb-icon sb-icon--yellow" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Overall Progress Display */}
                    <div className="sb-progress-panel">
                      <h4 className="sb-progress-title">Your Progress</h4>
                      <div className="sb-progress-grid">
                        <div className="sb-progress-card">
                          <div className="sb-progress-number sb-progress-number--blue">
                            {achievementProgress.totalRoutesCompleted}
                          </div>
                          <div className="sb-progress-label">Routes Completed</div>
                        </div>
                        <div className="sb-progress-card">
                          <div className="sb-progress-number sb-progress-number--green">
                            {Math.min(achievementProgress.avoidedScamTypes.size, 8)}/8
                          </div>
                          <div className="sb-progress-label">Scam Types Avoided</div>
                        </div>
                      </div>

                      <div className="sb-progress-grid">
                        <div className="sb-progress-card">
                          <div className="sb-progress-number sb-progress-number--red">
                            {Math.min(achievementProgress.fallenForScamTypes.size, 8)}/8
                          </div>
                          <div className="sb-progress-label">Fallen For</div>
                        </div>
                        <div className="sb-progress-card">
                          <div className="sb-progress-number sb-progress-number--purple">
                            {Math.min(
                              achievementProgress.avoidedScamTypes.size + achievementProgress.fallenForScamTypes.size,
                              16
                            )}/16
                          </div>
                          <div className="sb-progress-label">Total Outcomes</div>
                        </div>
                      </div>

                      <div className="sb-progress-grid-single">
                        <div className="sb-progress-card">
                          <div className="sb-progress-number sb-progress-number--amber">
                            {Math.min(achievementProgress.learnedScamTypes.size, 9)}/9
                          </div>
                          <div className="sb-progress-label">Scam Types Learned</div>
                        </div>
                      </div>
                      {achievementProgress.totalRoutesCompleted >= 1 && (
                        <div className="sb-achievement-line sb-achievement-blue sb-small">
                          <Star size={16} className="sb-achievement-icon sb-achievement-blue" />
                          <span>First Steps Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.totalRoutesCompleted >= 3 && (
                        <div className="sb-achievement-line sb-achievement-purple sb-small">
                          <Award size={16} className="sb-achievement-icon sb-achievement-purple" />
                          <span>Getting Good Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.rickRollCompleted && (
                        <div className="sb-achievement-line sb-achievement-pink sb-small">
                          <Trophy size={16} className="sb-achievement-icon sb-achievement-pink" />
                          <span>Never Gonna Give You Up Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.avoidedScamTypes.size === 8 && (
                        <div className="sb-achievement-line sb-achievement-yellow sb-small">
                          <Crown size={16} className="sb-achievement-icon sb-achievement-yellow" />
                          <span>Scam Master Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.fallenForScamTypes.size === 8 && (
                        <div className="sb-achievement-line sb-achievement-red sb-small">
                          <Frown size={16} className="sb-achievement-icon sb-achievement-red" />
                          <span>Easily Fooled Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.avoidedScamTypes.size === 8 && achievementProgress.fallenForScamTypes.size === 8 && (
                          <div className="sb-achievement-line sb-achievement-cyan sb-small">
                            <Trophy size={16} className="sb-achievement-icon sb-achievement-cyan" />
                            <span>HYPERGAMER Achieved!</span>
                          </div>
                        )}
                      {achievementProgress.learnedScamTypes.size === 9 && (
                        <div className="sb-achievement-line sb-achievement-amber sb-small">
                          <BookOpen size={16} className="sb-achievement-icon sb-achievement-amber" />
                          <span>Wise One Achieved!</span>
                        </div>
                      )}
                      {achievementProgress.readRickRollText && (
                        <div className="sb-achievement-line sb-achievement-green sb-small">
                          <BookOpen size={16} className="sb-achievement-icon sb-achievement-green" />
                          <span>Learned - masterful at reading text!</span>
                        </div>
                      )}
                      {checkForMegaAchievement(achievementProgress) && (
                        <div className="sb-progress-mega">
                          <Sparkles size={20} className="sb-progress-mega-icon" />
                          <span className="sb-progress-mega-text">THE COLLECT ALL ACHIEVEMENTS MEGAACHIEVEMENT!</span>
                          <Sparkles size={20} className="sb-progress-mega-icon" />
                        </div>
                      )}
                      {hasDefeatedBoss && (
                        <div className="sb-progress-champion">
                          <Crown size={20} className="sb-progress-champion-icon" />
                          <span className="sb-progress-champion-text">TRUE ASCENDED CHAMPION!</span>
                          <Crown size={20} className="sb-progress-champion-icon" />
                        </div>
                      )}
                    </div>

                      <div className="sb-action-buttons">
                      <button onClick={handleLearn} className="sb-learn-button">
                        <GraduationCap size={16} className="sb-learn-button-icon" />
                        {wasSuccessful
                          ? "What was this scam about?"
                          : "Oh no! What was this? What do I learn?"}
                      </button>
                      <button onClick={handleTryAgain} className="sb-retry-button">
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
                            <button onClick={handleUnleashBoss} className="sb-boss-button">
                              <Flame size={20} className="sb-boss-button-icon" />
                              UNLEASH THE FINAL BOSS
                              <Flame size={20} className="sb-boss-button-icon" />
                            </button>
                          </motion.div>
                        )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="sb-messages-container">
                    {messages.map((message, index) => (
                      <div key={message.id}>
                        <div
                          className={`sb-message ${
                            message.sender === "user" ? "sb-message-reverse" : ""
                          }`}
                        >
                          {message.sender === "Scambert" && (
                            <div className="sb-avatar-wrap">
                              <div className="sb-avatar-glow" />
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
                          <div className={`sb-message-bubble ${message.sender === "user" ? "sb-message-user" : "sb-message-scammer"}`}>
                            <p>{renderMessageWithLinks(message.text)}</p>
                            <span className="sb-message-timestamp">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {message.sender === "user" && (
                            <div className="sb-user-avatar">U</div>
                          )}
                        </div>

                        {/* Quick Reply Buttons - Show after last scammer message */}
                        {message.sender === "Scambert" &&
                          index === messages.length - 1 &&
                          showQuickReplies &&
                          mode === "chatting" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="sb-quick-replies">
                              <button onClick={() => handleQuickReply("YES, let's do this!") } className="sb-quick-reply sb-quick-reply-primary">YES, let's do this!</button>
                              <button onClick={() => handleQuickReply("NO. I'm not 100% sure you're legitimate.") } className="sb-quick-reply sb-quick-reply-secondary">NO. I'm not 100% sure you're legitimate.</button>
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
                              className="sb-followup-wrap"
                            >
                              <button
                                onClick={handleClickLink}
                                className="sb-followup-button"
                              >
                                <Link size={16} className="sb-followup-icon" />
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
                              className="sb-outcome-wrap"
                            >
                              <button
                                onClick={handleProceedToOutcome}
                                className={`sb-outcome-btn ${
                                  wasSuccessful ? "sb-outcome-success" : "sb-outcome-fail"
                                }`}
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
                <div className="sb-input-area">
                  <div className="sb-input-row">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Type your response..."
                      className="sb-input-field"
                    />
                    <button onClick={() => handleSendMessage()} className="sb-send-button">
                      <Send size={16} className="sb-send-icon" />
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
            className="sb-modal-backdrop"
            onClick={() => setShowWelcomeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="sb-modal-content sb-modal-large"
            >
              <div className="sb-modal-header">
                <div className="sb-modal-icon-row">
                  <ScambertIcon size={100} animate mode="scammer" />
                </div>
                <h2 className="sb-modal-heading">Welcome, traveler!</h2>
              </div>

              <div className="sb-welcome-body">
                <p className="sb-modal-paragraph">
                  I'm <span className="sb-accent">Scambert</span>, your
                  shadowy guide through the treacherous world of scams and
                  schemes. Care to test your wits?
                </p>

                <div className="sb-info-card">
                  <p className="sb-card-text sb-small">On this journey, you shall:</p>
                  <ul className="sb-list sb-list-muted">
                    <li className="sb-list-item">
                      <span className="sb-list-icon sb-icon--blue">⚔️</span>
                      <span>Navigate through interactive scam scenarios and minigames</span>
                    </li>
                    <li className="sb-list-item">
                      <span className="sb-list-icon sb-icon--amber">🎓</span>
                      <span>Learn about financial crime with authentic UK fraud statistics</span>
                    </li>
                    <li className="sb-list-item">
                      <span className="sb-list-icon sb-icon--yellow">🏆</span>
                      <span>Unlock achievements and track your progress</span>
                    </li>
                    <li className="sb-list-item">
                      <span className="sb-list-icon sb-icon--red">💀</span>
                      <span>Perhaps even face a fearsome boss battle...</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="sb-modal-actions">
                <button
                  onClick={() => {
                    setShowWelcomeModal(false)
                  }}
                  className="sb-modal-button sb-modal-button--secondary"
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
                  className="sb-modal-button sb-modal-button--primary"
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
            className="sb-modal-backdrop"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="sb-modal-content sb-modal-confirm"
            >
              <h2 className="sb-modal-heading sb-heading-error">Reset All Progress?</h2>
              <p className="sb-modal-paragraph">
                Are you certain you want to reset all progress? This will
                permanently delete:
              </p>
              <ul className="sb-list sb-list-muted sb-small">
                <li>All achievements earned</li>
                <li>Routes completed counter</li>
                <li>Scam types avoided/fallen for records</li>
              </ul>
              <div className="sb-warning-text">This action cannot be undone!</div>
              <div className="sb-modal-actions">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="sb-modal-button sb-modal-button--secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => performReset(true)}
                  className="sb-modal-button sb-modal-button--danger"
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
            className="sb-boss-backdrop"
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
            className="sb-champion-container"
          >
            <div className="sb-champion-root">
              {/* Golden glow */}
              <div className="sb-champion-glow" />

              {/* Main title card */}
              <motion.div
                className="sb-champion-card"
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
                <div className="sb-champion-stack">
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
                    <Crown size={80} className="sb-champion-crown" />
                  </motion.div>

                  <h1 className="sb-champion-title">TRUE ASCENDED</h1>
                  <h2 className="sb-champion-subtitle">CHAMPION</h2>

                  <div className="sb-champion-icons">
                    <Trophy size={32} className="sb-champion-icon sb-animate-bounce" />
                    <Sparkles size={32} className="sb-champion-icon sb-animate-pulse" />
                    <Trophy size={32} className="sb-champion-icon sb-animate-bounce" />
                  </div>

                  <p className="sb-champion-desc">
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
          className="sb-champion-badge-container"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="sb-champion-badge">
            <Crown size={20} className="sb-champion-badge-icon" />
          </div>
        </motion.div>
      )}
    </>
  )
}
