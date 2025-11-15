import { motion } from 'motion/react';

interface ScammerBlobIconProps {
  size?: number;
  className?: string;
  animate?: boolean;
  mode?: 'scammer' | 'lecturer';
  withPointer?: boolean;
}

export default function ScammerBlobIcon({ size = 80, className = '', animate = false, mode = 'scammer', withPointer = false }: ScammerBlobIconProps) {
  const eyeAnimation = animate ? {
    x: [0, 2, -2, 0],
    transition: {
      duration: 3,
      repeat: Infinity
    }
  } : {};

  const blobAnimation = animate ? {
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  } : {};

  const leftHandAnimation = animate ? {
    scaleY: [1, 0.92, 1, 0.92, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatDelay: 6
    }
  } : {};

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={blobAnimation}
    >
      {mode === 'lecturer' && (
        <>
          {/* Academic Graduation Hat (Mortarboard) - Cum Laude Style */}
          {/* Hat base/cap */}
          <ellipse
            cx="60"
            cy="22"
            rx="18"
            ry="5"
            fill="#1a1a1a"
            stroke="#f5e6c8"
            strokeWidth="1"
          />
          {/* Square board on top - larger and more prominent */}
          <rect
            x="42"
            y="12"
            width="36"
            height="4"
            fill="#1a1a1a"
            stroke="#f5e6c8"
            strokeWidth="1"
            style={{
              filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.4))'
            }}
          />
          {/* Button/center of the board */}
          <circle
            cx="60"
            cy="14"
            r="2"
            fill="#2a2a2a"
          />
          {/* Gold tassel cord */}
          <line
            x1="60"
            y1="14"
            x2="72"
            y2="8"
            stroke="#d4af37"
            strokeWidth="1.5"
          />
          {/* Gold tassel top knot */}
          <circle
            cx="72"
            cy="8"
            r="2.5"
            fill="#d4af37"
          />
          {/* Tassel strands */}
          <line x1="72" y1="10" x2="71" y2="14" stroke="#c9a527" strokeWidth="1" opacity="0.8" />
          <line x1="72" y1="10" x2="72" y2="15" stroke="#d4af37" strokeWidth="1" />
          <line x1="72" y1="10" x2="73" y2="14" stroke="#c9a527" strokeWidth="1" opacity="0.8" />
          {/* Gold trim/ribbon on hat for "cum laude" distinction */}
          <ellipse
            cx="60"
            cy="22"
            rx="17"
            ry="2"
            fill="#d4af37"
            opacity="0.7"
          />
        </>
      )}

      {/* Blob body - dark slimy shape */}
      <motion.path
        d="M60 20C40 20 25 32 25 50C25 60 22 68 28 78C34 88 45 100 60 100C75 100 86 88 92 78C98 68 95 60 95 50C95 32 80 20 60 20Z"
        fill="#1a1a1a"
        style={{
          filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.3))'
        }}
      />
      
      {/* Blob shine/highlight to give it dimension */}
      <ellipse
        cx="48"
        cy="40"
        rx="12"
        ry="8"
        fill="#2a2a2a"
        opacity="0.6"
      />

      {/* Robber mask - darker black covering the face */}
      <path
        d="M30 45C30 45 35 40 45 38C50 37 55 36 60 36C65 36 70 37 75 38C85 40 90 45 90 45L90 60C90 60 88 65 85 68C82 71 80 72 78 72L42 72C40 72 38 71 35 68C32 65 30 60 30 60L30 45Z"
        fill="#000000"
      />

      {/* Eye holes with slight shadow */}
      <ellipse
        cx="47"
        cy="52"
        rx="8"
        ry="9"
        fill="#0a0a0a"
      />
      <ellipse
        cx="73"
        cy="52"
        rx="8"
        ry="9"
        fill="#0a0a0a"
      />

      {/* Shady eyes - left eye */}
      <motion.g animate={eyeAnimation}>
        <ellipse
          cx="46"
          cy="52"
          rx="5"
          ry="6"
          fill="#4a4a4a"
          opacity="0.8"
        />
        <ellipse
          cx="47"
          cy="51"
          rx="3"
          ry="4"
          fill="#6a6a6a"
        />
        <ellipse
          cx="48"
          cy="50"
          rx="1.5"
          ry="2"
          fill="#8a8a8a"
        />
        {/* Pupil with suspicious look */}
        <circle
          cx="45.5"
          cy="53"
          r="2"
          fill="#2d2d2d"
        />
      </motion.g>

      {/* Shady eyes - right eye */}
      <motion.g animate={eyeAnimation}>
        <ellipse
          cx="74"
          cy="52"
          rx="5"
          ry="6"
          fill="#4a4a4a"
          opacity="0.8"
        />
        <ellipse
          cx="73"
          cy="51"
          rx="3"
          ry="4"
          fill="#6a6a6a"
        />
        <ellipse
          cx="72"
          cy="50"
          rx="1.5"
          ry="2"
          fill="#8a8a8a"
        />
        {/* Pupil with suspicious look */}
        <circle
          cx="74.5"
          cy="53"
          r="2"
          fill="#2d2d2d"
        />
      </motion.g>

      {/* Slight drip effect at bottom for slime look */}
      <ellipse
        cx="55"
        cy="98"
        rx="4"
        ry="5"
        fill="#1a1a1a"
      />
      <ellipse
        cx="65"
        cy="99"
        rx="3"
        ry="4"
        fill="#1a1a1a"
      />

      {/* Left Hand - Beckoning with subtle finger wave OR holding pointer */}
      {!withPointer ? (
        <motion.g animate={leftHandAnimation} style={{ originX: '28px', originY: '78px' }}>
          {/* Palm */}
          <ellipse
            cx="28"
            cy="75"
            rx="2.5"
            ry="3.2"
            fill="#ffc9c9"
            stroke="#ffb3b3"
            strokeWidth="0.3"
          />
          {/* Thumb */}
          <ellipse
            cx="26.8"
            cy="72.5"
            rx="1"
            ry="1.2"
            fill="#ffc9c9"
            stroke="#ffb3b3"
            strokeWidth="0.3"
          />
          {/* Fingers (simplified as small bumps) */}
          <ellipse
            cx="27.5"
            cy="78"
            rx="0.8"
            ry="1"
            fill="#ffc9c9"
            stroke="#ffb3b3"
            strokeWidth="0.3"
          />
          <ellipse
            cx="29"
            cy="78.2"
            rx="0.7"
            ry="0.9"
            fill="#ffc9c9"
            stroke="#ffb3b3"
            strokeWidth="0.3"
          />
        </motion.g>
      ) : (
        <motion.g animate={leftHandAnimation} style={{ originX: '28px', originY: '78px' }}>
          {/* Hand holding pointer */}
          <ellipse
            cx="28"
            cy="75"
            rx="2.5"
            ry="3.2"
            fill="#ffc9c9"
            stroke="#ffb3b3"
            strokeWidth="0.3"
          />
          {/* Pointer stick extending from hand */}
          <line
            x1="28"
            y1="72"
            x2="20"
            y2="58"
            stroke="#8b4513"
            strokeWidth="2"
          />
          <circle
            cx="19"
            cy="56"
            r="1.5"
            fill="#8b4513"
          />
        </motion.g>
      )}

      {/* Right Hand - Static, resting on side */}
      <g>
        {/* Palm */}
        <ellipse
          cx="92"
          cy="75"
          rx="2.5"
          ry="3.2"
          fill="#ffc9c9"
          stroke="#ffb3b3"
          strokeWidth="0.3"
        />
        {/* Thumb */}
        <ellipse
          cx="93.2"
          cy="72.5"
          rx="1"
          ry="1.2"
          fill="#ffc9c9"
          stroke="#ffb3b3"
          strokeWidth="0.3"
        />
        {/* Fingers (simplified as small bumps) */}
        <ellipse
          cx="92.5"
          cy="78"
          rx="0.8"
          ry="1"
          fill="#ffc9c9"
          stroke="#ffb3b3"
          strokeWidth="0.3"
        />
        <ellipse
          cx="91"
          cy="78.2"
          rx="0.7"
          ry="0.9"
          fill="#ffc9c9"
          stroke="#ffb3b3"
          strokeWidth="0.3"
        />
      </g>

      {/* Lecturer pointer (only in lecturer mode and when not using withPointer) */}
      {mode === 'lecturer' && !withPointer && (
        <g>
          {/* Arm/hand coming from side */}
          <ellipse
            cx="95"
            cy="70"
            rx="8"
            ry="6"
            fill="#1a1a1a"
          />
          {/* Pointer stick */}
          <line
            x1="95"
            y1="70"
            x2="105"
            y2="65"
            stroke="#8b4513"
            strokeWidth="2"
          />
          <circle
            cx="106"
            cy="64"
            r="1.5"
            fill="#8b4513"
          />
        </g>
      )}
    </motion.svg>
  );
}