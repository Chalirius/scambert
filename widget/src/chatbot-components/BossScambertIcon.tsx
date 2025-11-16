import { motion } from "motion/react"

interface BossScambertIconProps {
  size?: number
  animate?: boolean
  name?: string
  onClick?: () => void
}

export function BossScambertIcon({
  size = 80,
  animate = false,
  name = "SCAMMY",
  onClick,
}: BossScambertIconProps) {
  const blob = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const float = animate
    ? {
        y: [0, -10, 0],
        transition: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }
    : {}

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        initial="hidden"
        animate="visible"
        variants={blob}
      >
        <defs>
          {/* Golden body gradient */}
          <radialGradient id="goldenBody" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </radialGradient>

          {/* Dark golden shading */}
          <radialGradient id="darkGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="100%" stopColor="#8B6914" />
          </radialGradient>

          {/* Eerie face glow */}
          <radialGradient id="eerieGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFA500" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF8C00" stopOpacity="0" />
          </radialGradient>

          {/* Shadow gradient */}
          <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Evil eye glow - red */}
          <radialGradient id="redEyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff0000" stopOpacity="1" />
            <stop offset="50%" stopColor="#cc0000" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ominous aura */}
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#eerieGlow)"
          animate={
            animate
              ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                }
              : {}
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main body - dark blob base */}
        <motion.ellipse
          cx="50"
          cy="60"
          rx="35"
          ry="38"
          fill="#1a1a1a"
          animate={float}
        />

        {/* Golden eerie face overlay */}
        <motion.g animate={float}>
          {/* Face base - golden skull-like shape */}
          <ellipse
            cx="50"
            cy="45"
            rx="28"
            ry="32"
            fill="url(#goldenBody)"
            opacity="0.95"
          />

          {/* Face shading/depth */}
          <ellipse
            cx="50"
            cy="50"
            rx="26"
            ry="28"
            fill="url(#darkGold)"
            opacity="0.3"
          />

          {/* Eerie forehead marking - third eye symbol */}
          <motion.circle
            cx="50"
            cy="32"
            r="3"
            fill="#8B0000"
            animate={
              animate
                ? {
                    opacity: [0.6, 1, 0.6],
                    scale: [1, 1.2, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <circle cx="50" cy="32" r="5" fill="url(#redEyeGlow)" opacity="0.5" />

          {/* Eye sockets - hollow and dark */}
          <ellipse cx="40" cy="42" rx="7" ry="9" fill="#000000" opacity="0.9" />
          <ellipse cx="60" cy="42" rx="7" ry="9" fill="#000000" opacity="0.9" />

          {/* Inner eye socket shadows */}
          <ellipse cx="40" cy="43" rx="6" ry="7" fill="url(#shadowGrad)" />
          <ellipse cx="60" cy="43" rx="6" ry="7" fill="url(#shadowGrad)" />

          {/* Glowing red eyes */}
          <motion.circle
            cx="40"
            cy="42"
            r="4"
            fill="#ff0000"
            animate={
              animate
                ? {
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.15, 1],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="60"
            cy="42"
            r="4"
            fill="#ff0000"
            animate={
              animate
                ? {
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.15, 1],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Eye glows */}
          <circle cx="40" cy="42" r="6" fill="url(#redEyeGlow)" />
          <circle cx="60" cy="42" r="6" fill="url(#redEyeGlow)" />

          {/* Pupil highlights for depth */}
          <circle cx="41" cy="41" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="61" cy="41" r="1.5" fill="#ffffff" opacity="0.8" />

          {/* Cheekbone ridges */}
          <path
            d="M 30 46 Q 35 48, 38 46"
            stroke="#B8860B"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 70 46 Q 65 48, 62 46"
            stroke="#B8860B"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />

          {/* Nose - simplified, eerie */}
          <ellipse cx="50" cy="52" rx="2" ry="3" fill="#000000" opacity="0.7" />

          {/* Sinister smile/grin - curved line */}
          <motion.path
            d="M 38 58 Q 50 63, 62 58"
            stroke="#000000"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
            animate={
              animate
                ? {
                    d: [
                      "M 38 58 Q 50 63, 62 58",
                      "M 38 58 Q 50 65, 62 58",
                      "M 38 58 Q 50 63, 62 58",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Smile highlight - golden gleam */}
          <path
            d="M 40 58 Q 50 62, 60 58"
            stroke="#FFD700"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Teeth suggestions */}
          <rect
            x="46"
            y="60"
            width="2"
            height="3"
            fill="#ffffff"
            opacity="0.6"
            rx="0.5"
          />
          <rect
            x="52"
            y="60"
            width="2"
            height="3"
            fill="#ffffff"
            opacity="0.6"
            rx="0.5"
          />

          {/* Face cracks/age lines */}
          <line
            x1="35"
            y1="38"
            x2="33"
            y2="44"
            stroke="#8B6914"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <line
            x1="65"
            y1="38"
            x2="67"
            y2="44"
            stroke="#8B6914"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <line
            x1="44"
            y1="52"
            x2="42"
            y2="56"
            stroke="#8B6914"
            strokeWidth="0.8"
            opacity="0.4"
          />
          <line
            x1="56"
            y1="52"
            x2="58"
            y2="56"
            stroke="#8B6914"
            strokeWidth="0.8"
            opacity="0.4"
          />

          {/* Golden aura particles */}
          <motion.circle
            cx="28"
            cy="35"
            r="1.5"
            fill="#FFD700"
            animate={
              animate
                ? {
                    y: [-2, 2, -2],
                    opacity: [0.5, 1, 0.5],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="72"
            cy="38"
            r="1.5"
            fill="#FFD700"
            animate={
              animate
                ? {
                    y: [2, -2, 2],
                    opacity: [0.5, 1, 0.5],
                  }
                : {}
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          <motion.circle
            cx="50"
            cy="25"
            r="1.5"
            fill="#FFA500"
            animate={
              animate
                ? {
                    y: [-2, 2, -2],
                    opacity: [0.5, 1, 0.5],
                  }
                : {}
            }
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.g>

        {/* Crown - evil king of scams */}
        <motion.g animate={float}>
          <path
            d="M 35 28 L 38 22 L 41 28 L 44 23 L 47 28 L 50 20 L 53 28 L 56 23 L 59 28 L 62 22 L 65 28 L 50 32 Z"
            fill="url(#goldenBody)"
            stroke="#8B6914"
            strokeWidth="1"
          />
          <circle cx="50" cy="20" r="2" fill="#8B0000" />
          <circle cx="38" cy="22" r="1.5" fill="#8B0000" />
          <circle cx="62" cy="22" r="1.5" fill="#8B0000" />

          {/* Crown gems */}
          <motion.circle
            cx="50"
            cy="26"
            r="2"
            fill="#ff0000"
            animate={
              animate
                ? {
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.2, 1],
                  }
                : {}
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.g>

        {/* Dark robes/body */}
        <motion.ellipse
          cx="50"
          cy="72"
          rx="32"
          ry="20"
          fill="#0a0a0a"
          opacity="0.9"
          animate={float}
        />

        {/* Robe details */}
        <motion.path
          d="M 35 65 Q 50 70, 65 65"
          stroke="#1a1a1a"
          strokeWidth="2"
          fill="none"
          animate={float}
        />
      </motion.svg>

      {/* Boss name tag with ominous styling */}
      <motion.div
        style={{
          marginTop: "0.5rem",
          padding: "0.375rem 1rem",
          background: "linear-gradient(to right, #78350f, #713f12, #78350f)",
          border: "2px solid #ca8a04",
          borderRadius: "0.375rem",
          boxShadow: "0 10px 15px -3px rgba(113, 63, 18, 0.5)",
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span
          style={{
            color: "#facc15",
            fontWeight: 700,
            fontSize: "0.875rem",
            letterSpacing: "0.05em",
            filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))",
          }}
        >
          👑 {name} 👑
        </span>
      </motion.div>

      {/* 5-star rating indicator */}
      <motion.div
        style={{ display: "flex", gap: "0.125rem", marginTop: "0.25rem" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="2"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>
        ))}
      </motion.div>

      {/* Mystical particles around the boss */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "0.25rem",
              height: "0.25rem",
              backgroundColor: "#facc15",
              borderRadius: "9999px",
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 40}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
