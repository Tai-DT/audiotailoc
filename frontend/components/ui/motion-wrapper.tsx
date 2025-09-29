'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

const directionVariants = {
  up: { y: 20, opacity: 0 },
  down: { y: -20, opacity: 0 },
  left: { x: 20, opacity: 0 },
  right: { x: -20, opacity: 0 },
  fade: { opacity: 0 }
};

export function MotionWrapper({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  ...props
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth motion
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Scroll-triggered animation wrapper
interface ScrollMotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  amount?: number | "some" | "all";
  once?: boolean;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export function ScrollMotionWrapper({
  children,
  amount = 0.1,
  once = true,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  ...props
}: ScrollMotionWrapperProps) {
  return (
    <motion.div
      initial={directionVariants[direction]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ amount, once }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Hover animation wrapper
interface HoverMotionWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  scale?: number;
  y?: number;
}

export function HoverMotionWrapper({
  children,
  scale = 1.05,
  y = -5,
  ...props
}: HoverMotionWrapperProps) {
  return (
    <motion.div
      whileHover={{
        scale,
        y,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger animation for lists
interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export function StaggerItem({
  children,
  direction = 'up',
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: directionVariants[direction],
        visible: {
          x: 0,
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
