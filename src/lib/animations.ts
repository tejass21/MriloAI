import { Variants } from "framer-motion";

export const messageVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const userMessageVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -20,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};

export const aiMessageVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};

export const hoverVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

export const glowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
}; 