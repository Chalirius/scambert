import React, { useState, useMemo } from "react"
import { motion, easeInOut } from "motion/react"
import ScammerblobIcon from "./ScammerBlobIcon"

interface ScammerblobIconProps {
  size?: number
  className?: string
  animate?: boolean
  blobAnimation?: any
}

interface Character {
  tone: "friendly" | "serious"
  text: string
}

interface GreetingProps {
  character?: string // e.g. 'scambert'
  animate?: boolean
}

export const GreetingComponent: React.FC<GreetingProps> = ({
  character = "scambert",
  animate = true,
}) => {
  // initial character state derived from `character` prop
  const initial = useMemo<Character>(() => {
    if (character === "scambert") {
      return { tone: "friendly", text: "Hi there, I'm Scambert!" }
    }
    return { tone: "friendly", text: "Hi there!" }
  }, [character])

  const [characterState, setCharacter] = useState<Character>(initial)

  // Inline styles for a static speech bubble (no animation)
  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
  }

  return (
    <div
      className="scamducation-widget"
      style={{ position: "absolute", top: "25em", left: "1em" }}
    >
      <div className="widget-header" style={headerStyle}>
        <ScammerblobIcon animate={animate}></ScammerblobIcon>

        <motion.div
          className="absolute top-6 -left-28 bg-slate-800 border border-slate-600 rounded-2xl rounded-br-sm px-3 py-1.5 shadow-lg"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
        >
          <p>{characterState.text}</p>
          <p>Ready to level up your scam-spotting skills? Let's go! 🚀</p>
        </motion.div>
      </div>
    </div>
  )
}

// export function ScammerblobIcon({ size = 80, className = '', animate = false, blobAnimation }: ScammerblobIconProps) {
//   const eyeAnimation = animate ? {
//     x: [0, 2, -2, 0],
//     transition: {
//       duration: 3,
//       repeat: Infinity,
//       ease: easeInOut
//     }
//   } : {};

//   return (
//     <motion.svg
//       width={size}
//       height={size}
//       viewBox="0 0 100 100"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       className={className}
//       animate={blobAnimation}
//     >
//       {/* Blob body - dark slimy shape */}
//       <motion.path
//         d="M50 10C30 10 15 22 15 40C15 50 12 58 18 68C24 78 35 90 50 90C65 90 76 78 82 68C88 58 85 50 85 40C85 22 70 10 50 10Z"
//         fill="#1a1a1a"
//         style={{
//           filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3))'
//         }}
//       />

//       {/* Blob shine/highlight to give it dimension */}
//       <ellipse
//         cx="38"
//         cy="30"
//         rx="12"
//         ry="8"
//         fill="#2a2a2a"
//         opacity="0.6"
//       />

//       {/* Robber mask - darker black covering the face */}
//       <path
//         d="M20 35C20 35 25 30 35 28C40 27 45 26 50 26C55 26 60 27 65 28C75 30 80 35 80 35L80 50C80 50 78 55 75 58C72 61 70 62 68 62L32 62C30 62 28 61 25 58C22 55 20 50 20 50L20 35Z"
//         fill="#000000"
//       />

//       {/* Eye holes with slight shadow */}
//       <ellipse
//         cx="37"
//         cy="42"
//         rx="8"
//         ry="9"
//         fill="#0a0a0a"
//       />
//       <ellipse
//         cx="63"
//         cy="42"
//         rx="8"
//         ry="9"
//         fill="#0a0a0a"
//       />

//       {/* Shady eyes - left eye */}
//       <motion.g animate={eyeAnimation}>
//         <ellipse
//           cx="36"
//           cy="42"
//           rx="5"
//           ry="6"
//           fill="#4a4a4a"
//           opacity="0.8"
//         />
//         <ellipse
//           cx="37"
//           cy="41"
//           rx="3"
//           ry="4"
//           fill="#6a6a6a"
//         />
//         <ellipse
//           cx="38"
//           cy="40"
//           rx="1.5"
//           ry="2"
//           fill="#8a8a8a"
//         />
//         {/* Pupil with suspicious look */}
//         <circle
//           cx="35.5"
//           cy="43"
//           r="2"
//           fill="#2d2d2d"
//         />
//       </motion.g>

//       {/* Shady eyes - right eye */}
//       <motion.g animate={eyeAnimation}>
//         <ellipse
//           cx="64"
//           cy="42"
//           rx="5"
//           ry="6"
//           fill="#4a4a4a"
//           opacity="0.8"
//         />
//         <ellipse
//           cx="63"
//           cy="41"
//           rx="3"
//           ry="4"
//           fill="#6a6a6a"
//         />
//         <ellipse
//           cx="62"
//           cy="40"
//           rx="1.5"
//           ry="2"
//           fill="#8a8a8a"
//         />
//         {/* Pupil with suspicious look */}
//         <circle
//           cx="64.5"
//           cy="43"
//           r="2"
//           fill="#2d2d2d"
//         />
//       </motion.g>

//       {/* Slight drip effect at bottom for slime look */}
//       <ellipse
//         cx="45"
//         cy="88"
//         rx="4"
//         ry="5"
//         fill="#1a1a1a"
//       />
//       <ellipse
//         cx="55"
//         cy="89"
//         rx="3"
//         ry="4"
//         fill="#1a1a1a"
//       />
//     </motion.svg>
//   );
// }
