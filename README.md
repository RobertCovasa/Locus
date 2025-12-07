# Locus

> Define the center of your attention.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Size](https://img.shields.io/badge/size-20kb-green.svg) ![Dependencies](https://img.shields.io/badge/dependencies-none-lightgrey.svg)

**Locus** is a minimalistic, context-aware focus timer designed for deep work sessions. It strips away gamification and clutter, leaving only the essential variables: Time and Intent.

## 📍 Why "Locus"?

In mathematics, a **locus** is a set of points that satisfy a particular condition. In Latin, it simply means "place" or "center."

This app was named **Locus** to represent the singular point where your attention resides. In a world of infinite distractions, this tool creates a dedicated coordinate for your mind to rest—aligning your time (`25:00`) with your specific intent.

## ✨ Features

* **Intent-First Design:** An input field prompts you to explicitly define "WHAT IS YOUR FOCUS?" before the timer begins.
* **Context-Aware Environment:**
    * **Focus Mode:** Deep charcoal background (`#1a1a1a`) for high-contrast concentration.
    * **Break Mode:** Soothing light cyan (`#e0f2f1`) signals a physiological break for your eyes and mind.
* **Smart Browser Integration:**
    * **Dynamic Favicon:** A real-time generated pie chart in the tab bar visualizes time remaining.
    * **Active Title:** The browser tab updates every second (e.g., `14:20 (Debug API)`) so you can track progress without switching tabs.
* **Generative Audio:** Uses the Web Audio API to generate a gentle sine-wave tone upon completion. No external audio files are loaded.
* **Visual Pacing:** "Dots" appear below the timer to track sets of 4 sessions, automatically suggesting long breaks when appropriate.

## 🚀 Getting Started

Locus is built with zero dependencies. It requires no build step, no npm install, and no framework.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/locus.git](https://github.com/yourusername/locus.git)
    ```
2.  **Run the app:**
    Simply open `index.html` in your preferred web browser.

## ⌨️ Keyboard Shortcuts

Keep your hands on the keyboard to maintain flow:

| Key | Action |
| :--- | :--- |
| **Space** | Toggle Start / Pause |
| **Enter** | Start Timer (while typing Intent) |
| **R** | Reset current timer |

## ⚙️ Configuration

You can customize the specific durations for Focus, Short Break, and Long Break by editing the `MODES` object at the top of `script.js`:

```javascript
// script.js
const MODES = {
    focus: 25 * 60, // 25 Minutes
    short: 5 * 60,  // 5 Minutes
    long: 15 * 60   // 15 Minutes
};