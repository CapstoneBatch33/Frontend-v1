import { dotPositions } from '@/app/constants/positions';

// ... in your component
{dotPositions.map((position, index) => (
  <motion.div 
    key={index}
    className="absolute h..."
    animate={{x: [...], y: [...]}}
    transition={{...}}
  >
    <div
      className="absolute h-2 w-2 rounded-full bg-primary/30"
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`
      }}
      ref={function}
    />
  </motion.div>
))}