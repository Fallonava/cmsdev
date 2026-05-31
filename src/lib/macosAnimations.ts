/**
 * macOS-native Framer Motion animation presets.
 * Use these across all admin components for a consistent, native feel.
 */
import type { Variants, Transition } from "framer-motion";

// ── Spring Transitions ────────────────────────────────────────────────────────
export const macSpring = {
  /** Button press, icon bounce, micro-interactions */
  snappy:  { type: "spring", stiffness: 500, damping: 30 } as Transition,
  /** Panel slides, sidebar, drawers */
  smooth:  { type: "spring", stiffness: 360, damping: 30 } as Transition,
  /** Modal appear, popovers */
  bouncy:  { type: "spring", stiffness: 420, damping: 22 } as Transition,
  /** Page transitions, large elements */
  gentle:  { type: "spring", stiffness: 260, damping: 36 } as Transition,
  /** Quick fade for subtle UI */
  fade:    { duration: 0.15, ease: "easeOut" } as Transition,
} as const;

// ── Page Transition ───────────────────────────────────────────────────────────
export const macPageVariants: Variants = {
  initial: { opacity: 0, scale: 0.992, y: 6 },
  animate: { opacity: 1, scale: 1,     y: 0, transition: macSpring.gentle },
  exit:    { opacity: 0, scale: 0.995, y: -4, transition: { duration: 0.15, ease: "easeIn" } },
};

// ── Modal / Sheet (slides up from bottom) ─────────────────────────────────────
export const macSheetVariants: Variants = {
  hidden:  { y: "100%", opacity: 0, scale: 0.98 },
  visible: {
    y: 0, opacity: 1, scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
  exit: { y: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

// Backdrop for sheet/modal
export const macBackdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

// ── Sidebar Item ──────────────────────────────────────────────────────────────
export const macSidebarItemVariants: Variants = {
  rest:  { x: 0,    scale: 1 },
  hover: { x: 0.5,  scale: 1,    transition: macSpring.snappy },
  tap:   { scale: 0.97, x: 0,    transition: { duration: 0.08 } },
};

// ── Card / List Row hover ─────────────────────────────────────────────────────
export const macCardVariants: Variants = {
  rest:  { y: 0, transition: macSpring.snappy },
  hover: { y: -2, transition: macSpring.snappy },
  tap:   { y: 0, scale: 0.99, transition: { duration: 0.08 } },
};

// ── Staggered list children ───────────────────────────────────────────────────
export const macListContainerVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

export const macListItemVariants: Variants = {
  hidden:  { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,  transition: macSpring.smooth },
};

// ── Empty State ───────────────────────────────────────────────────────────────
export const macEmptyStateVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 300, damping: 28, delay: 0.1 },
  },
};

// ── Tooltip / Popover ─────────────────────────────────────────────────────────
export const macPopoverVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.94, y: 4 },
  visible: { opacity: 1, scale: 1,    y: 0, transition: macSpring.bouncy },
  exit:    { opacity: 0, scale: 0.96, y: 2, transition: { duration: 0.12 } },
};
