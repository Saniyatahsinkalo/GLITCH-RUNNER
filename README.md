# 🎮 GLITCH RUNNER

An intense, responsive cyberpunk arcade runner browser game built entirely with pure web technologies (Vanilla HTML5, CSS3, and JavaScript). Survive corrupt anomalies, collect memory shards, activate high-tech power-ups, and endure sudden **Reality Shifts** as the digital simulation collapses around you.

Fully responsive, offline-ready, and deployable to **GitHub Pages** with zero build steps or external dependencies.

---

## 🚀 Features

- **Multi-Device Support**: Play with keyboard controls on desktop/laptops or virtual D-pad / direct drag controls on touchscreen laptops, tablets, and phones.
- **Synthesized Web Audio Engine**: Pure native Web Audio API (`AudioContext`) sound effects with zero external audio assets or load delays. Full mute toggle (`M`).
- **Connected Power-Up System**:
  - 🛡️ **Shield Matrix**: Absorbs lethal glitch collisions.
  - ⚡ **Overclock**: Grants +45% movement speed and a 2x score multiplier.
  - 💥 **Glitch Purge**: EMP burst that vaporizes all active threats on screen.
- **Dynamic Shard Economy**:
  - **Memory Shard**: Base score & combo builder.
  - **Corrupted Shard**: High score bounty with risk of aggressive glitch spawns.
  - **Recovery Shard**: Restores +20% ship health.
  - **Special Shards**: Instantly triggers Shield, Overclock, or Glitch Purge.
- **10 Reality Shift Anomalies**:
  - *Reverse World*: Inverts directional steering.
  - *Hyper Mode*: Extreme speed boost for player and threats.
  - *Blackout*: Concentrated darkness with a dynamic radial spotlight.
  - *Magnetic Field*: Shards glide smoothly toward the ship.
  - *Time Fracture*: Corrupted threats are frozen in time.
  - *Shard Storm*: Bonus floating shards rain across the arena.
  - *Glitch Rain*: Corrupted data packets fall as dodgeable hazards.
  - *Mirror World*: Horizontal axis flipped.
  - *Gravity Flux*: Low-friction inertia and glide mechanics.
  - *Data Rush*: 3x score multiplier with elevated threat speeds.
- **Enemy Variety**:
  - **Chaser**: Directly tracks and chases the player.
  - **Drifter**: Moves in smooth, bouncing spatial trajectories.
  - **Dasher**: Charges a short, telegraphed burst dash toward the ship.
- **Run-Based Mini Challenges**: Dynamic objectives offering score bounties (`Collect 10 Shards`, `Reach 5x Combo`, `Survive a Reality Shift`, etc.).
- **Combo Scaling & Milestones**: Exponential score rewards with audio-visual milestones at 5x, 10x, 20x, and 30x.
- **Persistent High Scores**: Safely stores Best Score, Best Combo, and Level records in `localStorage`.
- **HiDPI / Retina Canvas**: Sharp rendering on high-density displays using `devicePixelRatio`.
- **Game Feel ("Juice")**: Screen trauma shake, floating combat text, engine thruster trails, and chromatic aberration.

---

## 🕹️ Controls

### Desktop & Laptop
- **WASD** or **Arrow Keys**: Move Ship (8 directions)
- **Space**: Start / Pause / Resume / Restart
- **P** or **Escape**: Pause / Resume
- **Enter**: Start / Reboot
- **M**: Toggle Audio Mute
- **Canvas Click**: Start from Ready or Reboot from Game Over

### Touch Devices (Tablets & Phones)
Two switchable touch modes (stored in `localStorage`):
1. **BUTTONS (Virtual D-Pad)**: Large, comfortable touch targets (`▲`, `◀`, `▼`, `▶`) with hold-to-move pointer tracking and haptic visual feedback.
2. **TOUCH / DRAG**: Touch and glide anywhere on the game arena to directly steer the ship.

---

## 📖 How to Play

1. **Evade Threats**: Avoid colliding with crimson Glitch enemies and falling data rain.
2. **Collect Shards**: Gather glowing cyan memory shards to increase your score and build your Combo multiplier.
3. **Grab Power-Ups**: Collect special shards to activate defensive shields, turbo overclocks, and EMP glitch purges.
4. **Survive Reality Shifts**: When the simulation warps, read the incoming warning banner and adapt to inverted physics, reduced visibility, or spatial anomalies.
5. **Complete Objectives**: Follow the active mission objective for big score bonuses.

---

## 🛠️ Technologies

- **HTML5**: Semantic document layout, viewport management, and 16:9 canvas container.
- **CSS3**: Custom cyberpunk aesthetic, neon variables, glassmorphism, responsive breakpoints (320px to 4K), chamfered cyber cuts, and screen shake animations.
- **Vanilla JavaScript (ES6+)**: Custom game loop (`requestAnimationFrame` with delta timing), entity physics, collision mathematics, state machines, and `localStorage` persistence.
- **Web Audio API**: Native synthesized oscillators, gain nodes, and frequency ramps for retro-futuristic sound effects. Zero external `.mp3` or `.wav` dependencies.

---

## 📁 Project Structure

```text
glitch-runner/
│
├── index.html       # Game entry point, semantic HUD, touch controls, and SVG favicon
├── style.css        # Responsive stylesheet, animations, and arcade theme
├── game.js          # Game engine, audio synth, power-ups, and Reality Shifts
├── README.md        # Documentation and deployment guide
└── assets/          # Directory for static assets or previews
    └── .gitkeep     # Preserves assets folder in git
```

---

## 💻 Local Run Instructions

No Node.js, package managers, or build steps are required.

1. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/your-username/glitch-runner.git
   ```
2. Navigate to the project folder:
   ```bash
   cd glitch-runner
   ```
3. Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari, Brave), or run with a local server like VS Code Live Server or Python:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
4. Visit `http://localhost:8000` in your browser.

---

## 🌐 GitHub Pages Deployment Instructions

1. Push the repository to GitHub:
   ```bash
   git add .
   git commit -m "Release GLITCH RUNNER v1.0"
   git push origin main
   ```
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Select branch `main` (or `master`) and folder `/(root)`.
5. Click **Save**. Within 1–2 minutes, your game will be live at `https://<your-username>.github.io/<repo-name>/`!

---

## 🔮 Future Improvements

- Custom pilot ship skins unlocked via high score milestones.
- Global online leaderboard using serverless edge functions.
- Gamepad / Controller API integration for Bluetooth controllers.
- Procedural synthwave background music track synthesized in real time via Web Audio API.
