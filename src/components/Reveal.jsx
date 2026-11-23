import { motion } from "motion/react";

const animations = {
  "slide-up": {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },

  "pop-up": {
    hidden: {
      opacity: 0,
      scale: 0.85,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  },

  "slide-down": {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },

  "slide-right": {
    hidden: {
      opacity: 0,
      x: -40,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  },
};

const Reveal = ({
  children,
  variant = "slide-up",
  delay = 0,
  duration = 0.6,
  className = "",
}) => {
  const animation = animations[variant];

  return (
    <motion.div
      className={className}
      initial={animation.hidden}
      whileInView={animation.visible}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
