# Pranav Deo — Product & Engineering Portfolio

A high-fidelity, cinematic portfolio exploring the intersection of Ads Platform strategy and GenAI. Built with a "Cinematic Calm" aesthetic using Next.js, Framer Motion, and Three.js.

## 🌌 Core Aesthetic: Cinematic Calm
The site is designed as a minimalist, system-driven experience. 
- **Typography:** Elegant Serif headers contrasted with technical Monospace system tags.
- **Visuals:** A 3D dust-particle ambient background with fixed-coordinate navigation portals.
- **Motion:** 500ms snappy transitions with custom easing for a premium product feel.

## 🕹 Interactive Modules

### 1. [Signal Portals](src/components/SignalPortal.tsx)
Abstract 3D wireframe entities (Cube and Pentagonal Prism) serving as persistent navigation gateways.
- **HUD-Style Labels:** Glassy, high-contrast labels with `backdrop-blur-md` for perfect legibility across all site sections.
- **Stability Architecture:** Optimized for absolute persistence via window-level navigation, ensuring high-reliability state clearing between games.
- **Technologies:** React, Math-based SVG projection, Framer Motion.

### 2. [Escape Protocol](/escape)
A brutalist, endless-runner simulation utilizing high-performance `requestAnimationFrame` mechanics.
- **Features:** 3D wireframe player entity, dynamic gravity physics, and high-score persistence.

### 3. [The Crucible (RPSLS)](/rpsls)
A cinematic interpretation of Rock-Paper-Scissors-Lizard-Spock.
- **Features:** Scramble-text calculation logic, custom SVG iconography, and high-tension resolution sequences.

## 🛠 Technical Stack
- **Framework:** Next.js (App Router)
- **Animation:** Framer Motion
- **3D/Particles:** @react-three/fiber & @react-three/drei
- **Smooth Scroll:** Lenis
- **Styling:** Tailwind CSS (System Palette)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to experience the system.

