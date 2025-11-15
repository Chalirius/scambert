import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import ScammerblobIcon from './ScammerBlobIcon';

export function ScamsInYourArea() {

  const [isOpen, setIsopen] = useState(true);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => setRegion(data.region))
      .catch(err => console.error(err));
  }, []);
  

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260, 
        damping: 30,
        duration: 0.5 
      }}
      style={{
        width: '100%',
        maxWidth: '29rem',
        position: 'absolute',
        top: '25em',
        right: '3em'

      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)',
        borderRadius: '1.5rem',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        padding: '2.5rem',
        position: 'relative',
        border: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        {/* Header with animated icon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.1,
            duration: 0.5
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '2rem'
          }}
        >
          <motion.div 
            animate={{ 
              rotate: [0, 8, -8, 8, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
              delay: 0.3
            }}
          >
            <ScammerblobIcon size={28} />
          </motion.div>
          <h2 style={{ 
            color: '#e9d5ff', 
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>Scams in your area</h2>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            color: '#c4b5fd',
            lineHeight: '1.8',
            textAlign: 'left',
            fontSize: '0.95rem'
          }}
        >
          {/* Warning Title */}
          <div style={{
            marginBottom: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <p style={{ 
              margin: 0, 
              fontWeight: '700',
              color: '#fbbf24',
              fontSize: '1.05rem',
              marginBottom: '1rem'
            }}>
              WARNING: Bank Impersonation Scam
            </p>
            
            {/* What happened section */}
            <p style={{ 
              margin: 0,
              fontWeight: '600',
              color: '#e9d5ff',
              marginBottom: '0.75rem',
              fontSize: '0.9rem'
            }}>
              What happened:
            </p>
            
            <div style={{
              background: 'rgba(139, 92, 246, 0.08)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(139, 92, 246, 0.15)'
            }}>
              <p style={{ 
                margin: 0, 
                color: '#d8b4fe',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontWeight: '600', color: '#e9d5ff' }}>Victim:</span> Woman born in the 1960s, Joensuu
              </p>
              <p style={{ 
                margin: 0, 
                color: '#d8b4fe',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontWeight: '600', color: '#e9d5ff' }}>Date:</span> September 13
              </p>
              <p style={{ 
                margin: 0, 
                color: '#d8b4fe'
              }}>
                <span style={{ fontWeight: '600', color: '#e9d5ff' }}>Method:</span> Caller claimed to be an OP Bank representative, spoke fluent Finnish, and said her online banking needed an "update." She approved something on her phone during 4 separate calls.
              </p>
            </div>
          </div>

          {/* Result box */}
          <div style={{ 
              background: 'rgba(139, 92, 246, 0.08)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(139, 92, 246, 0.15)'
          }}>
            <p style={{ 
              margin: 0,
              fontWeight: '700',
              color: '#e9d5ff',
              fontSize: '1.05rem'
            }}>
              Result: €170,000 stolen from her account
            </p>
          </div>

          {/* Remember section */}
          <div>
            <p style={{ 
              marginTop: '1.5rem',
              fontWeight: '600',
              color: '#e9d5ff',
              marginBottom: '0.75rem',
              fontSize: '0.9rem'
            }}>
              Remember:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.9rem' }}>
                ❌ Banks never ask for approvals over the phone
              </p>
              <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.9rem' }}>
                ❌ Don't approve anything in banking app during a call
              </p>
              <p style={{ margin: 0, color: '#86efac', fontSize: '0.9rem' }}>
                ✅ Hang up and call the bank yourself
              </p>
              <p style={{ margin: 0, color: '#86efac', fontSize: '0.9rem' }}>
                ✅ Use the bank's official number (not the caller's)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
