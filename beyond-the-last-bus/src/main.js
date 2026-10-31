
import Phaser from "phaser";
import "./style.css";
const ASSET_BASE = `${import.meta.env.BASE_URL}assets/`;

// Beyond the Last Bus — complete playable story prototype.
// real interview videos at:
// public/assets/interviews/interview1.mp4
// public/assets/interviews/interview2.mp4

const W = 960;
const H = 640;

const VIDEO_PATHS = [
  `${ASSET_BASE}interviews/interview1.mp4`,
];

const progress = {
  campus: new Set(),
  housing: new Set(),
};

function resetProgress() {
  progress.campus.clear();
  progress.housing.clear();
}

function label(scene, x, y, text, size = 18, color = "#ffffff", extra = {}) {
  return scene.add.text(x, y, text, {
    fontFamily: "Arial, sans-serif",
    fontSize: `${size}px`,
    color,
    align: "center",
    ...extra,
  }).setOrigin(0.5);
}

function panel(scene, heading, subheading) {
  scene.add.rectangle(W / 2, 39, W - 50, 67, 0x182638, 0.94)
    .setStrokeStyle(2, 0x8ca5b3).setDepth(1500);

  label(scene, W / 2, 30, heading, 23, "#ffe6a6", {
    fontStyle: "bold"
  }).setDepth(1501);

  label(scene, W / 2, 57, subheading, 14, "#ffffff")
    .setDepth(1501);
}

function controlsHint(scene, text = "WASD / Arrows: Move     E: Interact") {
  scene.add.text(16, 610, text, {
    fontFamily: "Arial, sans-serif",
    fontSize: "15px",
    color: "#ffffff",
    backgroundColor: "#172638",
    padding: { x: 10, y: 6 },
  }).setDepth(1501);
}

function drawBuilding(scene, g, x, y, w, h, title, color = 0xb77960) {
  g.fillStyle(0x635047).fillRect(x - 7, y - 7, w + 14, h + 14);
  g.fillStyle(color).fillRect(x, y, w, h);
  g.fillStyle(0xd6a184).fillRect(x + 12, y + 11, w - 24, 13);

  for (let wx = x + 33; wx < x + w - 30; wx += 75) {
    g.fillStyle(0x374e65).fillRect(wx, y + 47, 34, 28);
    g.lineStyle(3, 0xf4e5cd).strokeRect(wx, y + 47, 34, 28);
  }

  g.fillStyle(0x493b39).fillRect(
    x + w / 2 - 22, y + h - 38, 44, 38
  );

  label(scene, x + w / 2, y + 34, title, 18, "#fff7e4", {
    fontStyle: "bold",
    backgroundColor: "#4c3b34",
    padding: { x: 8, y: 3 },
  });
}

function drawRoad(g) {
  g.fillStyle(0x454d57).fillRect(0, 452, W, 146);
  g.fillStyle(0x9b9fa1).fillRect(0, 452, W, 7);

  g.fillStyle(0xe2c56e);

  for (let x = 20; x < W; x += 98) {
    g.fillRect(x, 522, 49, 5);
  }
}

function drawCampus(scene, returning = false) {
  const g = scene.add.graphics().setDepth(-100);

  g.fillStyle(0x83b879).fillRect(0, 0, W, H);

  for (let x = 0; x < W; x += 36) {
    for (let y = 0; y < H; y += 36) {
      g.fillStyle(
        (x + y) % 72 === 0 ? 0x7aad72 : 0x8cbd80
      );
      g.fillRect(x + 2, y + 2, 31, 31);
    }
  }

  // Shared pedestrian plaza and entrance paths.
  g.fillStyle(0xd6c7a8).fillRect(0, 285, W, 142);
  g.fillRect(210, 213, 55, 75);
  g.fillRect(675, 213, 55, 75);

  g.lineStyle(2, 0xb4a78d);

  for (let x = 0; x <= W; x += 50) {
    g.lineBetween(x, 285, x, 427);
  }

  g.lineBetween(0, 354, W, 354);

  drawRoad(g);

  drawBuilding(
    scene, g, 80, 93, 305, 131,
    returning ? "AUDITORIUM" : "LIBRARY"
  );

  drawBuilding(
    scene, g, 555, 93, 310, 131, "ENGINEERING"
  );

  for (const [x, y] of [
    [35, 190],
    [445, 172],
    [490, 249],
    [925, 179]
  ]) {
    scene.add.image(x, y, "tree_286")
      .setScale(3)
      .setDepth(y);
  }

  // Bus stop and bus.
  scene.add.rectangle(766, 263, 137, 55, 0x496b86)
    .setStrokeStyle(4, 0x273c50)
    .setDepth(120);

  label(scene, 766, 263, "BUS STOP", 16, "#ffffff", {
    fontStyle: "bold"
  }).setDepth(121);

  const bus = scene.add.rectangle(
    766, 484, 173, 69, 0xe8b54b
  ).setStrokeStyle(4, 0x55412b).setDepth(95);

  label(scene, 766, 482, "CITIBUS", 19, "#302c26", {
    fontStyle: "bold"
  }).setDepth(96);

  if (returning) {
    label(
      scene, 232, 256, "AUDITORIUM ENTRANCE  [E]",
      16, "#20374c",
      {
        fontStyle: "bold",
        backgroundColor: "#ffe6a6",
        padding: { x: 8, y: 5 },
      }
    ).setDepth(120);
  }

  return bus;
}

function drawHousing(scene, dusk = false, morning = false) {
  const g = scene.add.graphics().setDepth(-100);

  g.fillStyle(0x84ac79).fillRect(0, 0, W, H);
  g.fillStyle(0xd6c8ad).fillRect(0, 283, W, 151);

  g.fillStyle(0xbeb39f);

  for (let x = 0; x < W; x += 52) {
    g.fillRect(x, 284, 2, 149);
  }

  g.fillRect(0, 352, W, 3);

  drawRoad(g);

  drawBuilding(
    scene, g, 65, 99, 300, 143,
    "APARTMENTS A", 0x9f827c
  );

  drawBuilding(
    scene, g, 430, 99, 290, 143,
    "APARTMENTS B", 0x9f827c
  );

  // Friend's home is a distinct landmark.
  g.fillStyle(0x66514b).fillRect(773, 147, 145, 101);
  g.fillStyle(0xd49c74).fillRect(780, 154, 131, 87);
  g.fillStyle(0x394a5b).fillRect(832, 196, 30, 45);

  label(scene, 845, 176, "FRIEND'S", 14, "#fff9e8", {
    fontStyle: "bold"
  });

  label(scene, 845, 193, "HOUSE", 14, "#fff9e8", {
    fontStyle: "bold"
  });

  scene.add.rectangle(130, 272, 115, 52, 0x496b86)
    .setStrokeStyle(4, 0x263c4e)
    .setDepth(110);

  label(scene, 130, 272, "BUS STOP", 16, "#ffffff", {
    fontStyle: "bold"
  }).setDepth(111);

  if (morning) {
    scene.add.rectangle(130, 484, 170, 69, 0xe8b54b)
      .setStrokeStyle(4, 0x55412b)
      .setDepth(95);

    label(scene, 130, 484, "CITIBUS", 18, "#302c26", {
      fontStyle: "bold"
    }).setDepth(96);
  }

  if (dusk) {
    scene.add.rectangle(
      480, 320, 960, 640, 0x151a39, 0.43
    ).setDepth(900);
  }
}

function showWorksCitedPDF() {
  // Prevent multiple overlays.
  if (document.getElementById("works-cited-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "works-cited-overlay";

  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0, 0, 0, 0.92)",
    zIndex: "9999",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box"
  });

  const header = document.createElement("div");
  header.textContent = "WORKS CITED";

  Object.assign(header.style, {
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "12px"
  });

  const pdf = document.createElement("iframe");
pdf.src = `${ASSET_BASE}works-cited.pdf`;

  Object.assign(pdf.style, {
    width: "min(900px, 95vw)",
    height: "80vh",
    border: "2px solid white",
    borderRadius: "8px",
    background: "white"
  });

  const closeButton = document.createElement("button");
  closeButton.textContent = "CLOSE WORKS CITED";

  Object.assign(closeButton.style, {
    marginTop: "14px",
    padding: "12px 24px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer"
  });

  closeButton.onclick = () => overlay.remove();

  overlay.appendChild(header);
  overlay.appendChild(pdf);
  overlay.appendChild(closeButton);

  document.body.appendChild(overlay);
}

function addCharacter(scene, x, y, texture, name = "") {
  const entity = scene.add.container(x, y);

  const sprite = scene.add.image(0, 0, texture)
    .setScale(4);

  entity.add(sprite);
  entity.characterSprite = sprite;

  if (name) {
    entity.add(
      scene.add.text(0, -53, name, {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#ffffff",
        backgroundColor: "#263b35",
        padding: { x: 6, y: 4 },
      }).setOrigin(0.5)
    );
  }

  entity.setDepth(y + 20);

  return entity;
}

function near(a, b, radius = 90) {
  return Phaser.Math.Distance.Between(
    a.x, a.y, b.x, b.y
  ) < radius;
}

// =====================================================
// REUSABLE WALKING AND DIALOGUE SYSTEM
// =====================================================

class WalkScene extends Phaser.Scene {
  setupWalking(x, y) {
    this.player = addCharacter(
      this, x, y, "player_456"
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.moveKeys = this.input.keyboard.addKeys("W,A,S,D");

    this.dialogue = null;
    this.talking = null;

    const handler = () => {
      if (this.dialogue) {
        this.advanceDialogue();
      } else if (this.talking) {
        return;
      } else {
        this.interact();
      }
    };

    this.input.keyboard.on("keydown-E", handler);

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.input.keyboard.off("keydown-E", handler);
        this.closeDialogue();
      }
    );
  }

  showDialogue(lines, onFinish = () => {}) {
    this.closeDialogue();

    this.dialogue = {
      lines: Array.isArray(lines) ? lines : [lines],
      index: 0,
      onFinish
    };

    const box = this.add.container(480, 537)
      .setDepth(2500);

    const bg = this.add.rectangle(
      0, 0, 903, 165, 0xf6eed9
    ).setStrokeStyle(5, 0x33465b)
      .setInteractive();

    const msg = this.add.text(
      -414, -52,
      this.dialogue.lines[0],
      {
        fontFamily: "Arial, sans-serif",
        fontSize: "21px",
        color: "#253445",
        wordWrap: { width: 825 },
        lineSpacing: 7,
      }
    );

    const hint = label(
      this, 387, 52,
      "E / Click to continue  ▶",
      15, "#506477"
    ).setOrigin(1, 0.5);

    box.add([bg, msg, hint]);

    this.dialogue.box = box;
    this.dialogue.message = msg;

    bg.on("pointerdown", () => {
      this.advanceDialogue();
    });
  }

  advanceDialogue() {
    if (!this.dialogue) return;

    const active = this.dialogue;
    active.index++;

    if (active.index < active.lines.length) {
      active.message.setText(
        active.lines[active.index]
      );
    } else {
      const next = active.onFinish;

      this.closeDialogue();
      next();
    }
  }

  closeDialogue() {
    if (this.dialogue) {
      this.dialogue.box.destroy();
      this.dialogue = null;
    }
  }

  update(_time, delta) {
    if (
      !this.player ||
      this.dialogue ||
      this.talking
    ) return;

    let dx = 0;
    let dy = 0;

    if (
      this.cursors.left.isDown ||
      this.moveKeys.A.isDown
    ) dx--;

    if (
      this.cursors.right.isDown ||
      this.moveKeys.D.isDown
    ) dx++;

    if (
      this.cursors.up.isDown ||
      this.moveKeys.W.isDown
    ) dy--;

    if (
      this.cursors.down.isDown ||
      this.moveKeys.S.isDown
    ) dy++;

    if (dx < 0) {
      this.player.characterSprite.setTexture(
        "player_455"
      );
    } else if (dx > 0) {
      this.player.characterSprite.setTexture(
        "player_458"
      );
    } else if (dy < 0) {
      this.player.characterSprite.setTexture(
        "player_457"
      );
    } else if (dy > 0) {
      this.player.characterSprite.setTexture(
        "player_456"
      );
    }

    const magnitude = Math.hypot(dx, dy) || 1;
    const speed = Math.min(40, delta) * 0.19;

    this.player.x = Phaser.Math.Clamp(
      this.player.x + dx / magnitude * speed,
      25, 935
    );

    this.player.y = Phaser.Math.Clamp(
      this.player.y + dy / magnitude * speed,
      287, 427
    );

    this.player.setDepth(this.player.y + 20);
  }
}

// =====================================================
// SCENE 1 — UNIVERSITY CAMPUS
// =====================================================

class CampusScene extends WalkScene {
  constructor() {
    super("CampusScene");
  }

  init(data = {}) {
    this.phase = data.phase || "interviews";
  }

  
preload() {
  const loadTile = (key, n) => {
    this.load.image(
      key,
      `${ASSET_BASE}urban/Tiles/tile_${String(n).padStart(4, "0")}.png`
    );
  };

  // Player sprites
  for (let n = 455; n <= 458; n++) {
    loadTile(`player_${n}`, n);
  }

  // NPC sprites
  for (let n = 23; n <= 26; n++) {
    loadTile(`npc_${n}`, n);
  }

  // Trees
  for (const n of [286, 287, 291, 292]) {
    loadTile(`tree_${n}`, n);
  }
}

  create() {
    this.bus = drawCampus(
      this,
      this.phase === "return"
    );

    this.npcs = [
      addCharacter(
        this, 332, 346, "npc_23", "Eva"
      ),
      addCharacter(
        this, 542, 346, "npc_24", "Tahmid"
      ),
    ];

    this.setupWalking(
      this.phase === "interviews" ? 115 : 760,
      365
    );

    const status = this.phase === "return"
      ? "You're back at Texas Tech. Enter the auditorium."
      : this.phase === "board"
        ? "Board the bus to visit the housing complex."
        : `Talk to both interviewees (${progress.campus.size}/2)`;

    panel(
      this,
      "TEXAS TECH UNIVERSITY",
      status
    );

    controlsHint(this);

    this.interviewLines = [
      [
        "Researcher: Hi, My name is Yaishik, and I am conducting a research on how Citibus services affect students' day-to-day lives.",
      "Researcher: Would you be able to answer a few questions for me?",
      "Unknown (I know but you don't yet!): Sure!",
         "Researcher: Could you introduce yourself?",
  "Eva: I am Anika Ibnat Eva, and I'm majoring in Electrical Engineering. My expected graduation is Spring 2030.",

  "Researcher: Do you live off-campus?",
  "Eva: Yes, I live off-campus at Raiders Pass.",

  "Researcher: Do you rely on Citibus as your main means of transportation?",
  "Eva: Yes, Citibus is the only means of transportation I rely on.",

  "Researcher: What problems do you face on weekends?",
  "Eva: I never plan to go anywhere on weekends due to the unavailability of Citibus.",

  "Researcher: Has there been a particular weekend when you faced transportation difficulties?",
  "Eva: Yes, of course. I had to go to Best Buy to buy my new phone urgently.",
  "Eva: However, the lack of public transportation meant that I had to take an Uber, which was not cheap.",

  "Researcher: What about campus events after 7 PM?",
  "Eva: I don't usually participate in any campus events after 7 PM because it's already dark and there's no public transportation.",

  "Researcher: Was there a particular event you really wanted to attend but couldn't because of transportation?",
  "Eva: Yes, there was a certain sorority event I badly wanted to participate in.",
  "Eva: But the lack of reliable and easy transportation held me back.",

  "Researcher: Are you happy with the Citibus schedule and its timeliness?",
  "Eva: I'm sort of happy with Citibus's service.",

  "Researcher: What discrepancies have you noticed while commuting?",
  "Eva: I think they provide more buses for Routes 45 or 44 than for Route 47.",
  "Eva: Route 47 is basically my route, and I have to wait a long time for the bus.",

  "Researcher: What suggestions do you have for improving transportation?",
  "Eva: (Laughing) My suggestion would be to increase the bus count for my route.",
  "Eva: Also, to expand their services on weekends, even on a small scale.",

  "Researcher: Thank you for sharing your experiences!",
  "Eva: You're welcome!"
      ],
      [
      "Researcher: Hi, My name is Yaishik, and I am conducting a research on how Citibus services affect students' day-to-day lives.",
      "Researcher: Would you be able to answer a few questions for me?",
      "Unknown (I know but you don't yet!): Sure!",
        "Researcher: Could you introduce yourself?",
    "Tahmid: My name is Tahmid Ahnaf Taseen. My current majors are Computer Science and Mathematics, and I'm in the Class of 2030.",

    "Researcher: Do you live off-campus?",
    "Tahmid: Yes, I live off-campus at Raiders Pass.",

    "Researcher: Do you rely on Citibus as your main means of transportation?",
    "Tahmid: Yes, Citibus is my primary means of transportation for commuting to campus.",

    "Researcher: What problems do you face on weekends?",
    "Tahmid: Most places are far from my residence, and walking facilities in Lubbock are insufficient.",
    "Tahmid: Due to the unavailability of Citibus on weekends and holidays, I have to either rely on expensive options like Uber and Lyft or choose not to go.",

    "Researcher: Has there been a particular weekend when you faced transportation difficulties?",
    "Tahmid: Yes. One weekend, I had to buy some groceries urgently, and Walmart was a 38-minute walk away.",
    "Tahmid: With no Citibus available, I had to book an Uber, which cost almost $30 for a round trip.",
    "Tahmid: It was very expensive because I only needed to buy items totaling $15.",

    "Researcher: What about campus events after 7 PM?",
    "Tahmid: After 7:00 PM to 7:30 PM, things become easier because TechRide is available.",
    "Tahmid: Other than the wait time, TechRide is accessible to me because its pickup and drop-off locations are near my residence.",

    "Researcher: Are you happy with the Citibus schedule and its timeliness?",
    "Tahmid: The schedule and timeliness are somewhat tolerable, in my opinion.",
    "Tahmid: Most of the time, buses on certain routes, such as Route 47, which I travel on, are late.",

    "Researcher: What discrepancies have you noticed while commuting?",
    "Tahmid: During torrential weather, the bus timing gets worse.",

    "Researcher: What suggestions do you have for improving transportation?",
    "Tahmid: The service could be improved by adding more buses to high-traffic routes and improving the timeliness of the service.",

    "Researcher: Thank you for sharing your experiences!",
    "Tahmid: You're welcome!"
      ],
    ];

    if (this.phase === "return") {
      this.showDialogue(
        "Back on campus! The research presentation is at the auditorium. Find the entrance on the left."
      );
    }
  }

  interact() {
    if (this.phase === "return") {
      if (
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          232,
          285
        ) < 115
      ) {
        this.scene.start("AuditoriumScene");
      } else {
        this.showDialogue(
          "Walk toward the AUDITORIUM entrance on the left side of campus."
        );
      }
      return;
    }

    if (this.phase === "interviews") {
      for (let i = 0; i < this.npcs.length; i++) {
        if (near(this.player, this.npcs[i], 85)) {
          if (progress.campus.has(i)) {
            this.showDialogue(
              "You've already completed this interview. Find the other interviewee."
            );
          } else {
            this.showDialogue(
              this.interviewLines[i],
              () => {
                progress.campus.add(i);

                if (progress.campus.size === 2) {
                  this.scene.start("MonologueScene");
                } else {
                  this.showDialogue(
                    "Interview recorded. One more campus interview to go."
                  );
                }
              }
            );
          }
          return;
        }
      }

      if (near(this.player, this.bus, 145)) {
        this.showDialogue(
          "First, speak to both interviewees on campus."
        );
      }

    } else if (this.phase === "board") {
      if (near(this.player, this.bus, 155)) {
        this.scene.start(
          "BusJourneyScene",
          { direction: "outbound" }
        );
      } else {
        this.showDialogue(
          "The Citibus is waiting by the road. Approach it and press E."
        );
      }
    }
  }
}

// =====================================================
// NARRATION CARD SYSTEM
// =====================================================

class StoryCardsScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  create() {
    const isNight =
      this.scene.key === "OvernightScene";

    const title = isNight
      ? "A NIGHT AWAY FROM HOME"
      : "A THOUGHT ON THE WAY";

    this.lines = isNight ? [
      "With no bus available, you ask a friend whether you can stay the night.",
      "Your friend offers a place to sleep. You are safe, but your journey home has been disrupted.",
      "The next morning arrives. It's time to catch the bus back to university.",
    ] : [
      "Two different students, but a similar concern: campus life doesn't always end when bus service does.",
      "What happens to people who live farther away? We should hear from residents of a housing complex.",
      "There's still time to catch a bus. We'll go there and continue our research.",
    ];

    this.index = 0;

    this.add.rectangle(
      480, 320, W, H,
      isNight ? 0x121c35 : 0x283c49
    );

    for (let i = 0; i < 60; i++) {
      const x = (i * 137) % 960;
      const y = (i * 83) % 610;

      this.add.circle(
        x, y,
        isNight ? 2 : 1,
        0xe8dfbd, 0.4
      );
    }

    label(
      this, 480, 125, title,
      33, "#f8dc8a",
      { fontStyle: "bold" }
    );

    this.card = label(
      this, 480, 310,
      this.lines[0],
      25,
      "#ffffff",
      {
        wordWrap: { width: 735 },
        lineSpacing: 10,
      }
    );

    label(
      this, 480, 535,
      "Press E, SPACE, or click to continue",
      17, "#c6d8e5"
    );

    const advance = () => {
      this.index++;

      if (this.index < this.lines.length) {
        this.card.setText(
          this.lines[this.index]
        );
      } else if (isNight) {
        this.scene.start("MorningScene");
      } else {
        this.scene.start(
          "CampusScene",
          { phase: "board" }
        );
      }
    };

    this.input.keyboard.on(
      "keydown-E", advance
    );

    this.input.keyboard.on(
      "keydown-SPACE", advance
    );

    this.input.on(
      "pointerdown", advance
    );
  }
}

class MonologueScene extends StoryCardsScene {
  constructor() {
    super("MonologueScene");
  }
}

class OvernightScene extends StoryCardsScene {
  constructor() {
    super("OvernightScene");
  }
}

// =====================================================
// SCENE 3 / 7 — BUS JOURNEY
// =====================================================

class BusJourneyScene extends Phaser.Scene {
  constructor() {
    super("BusJourneyScene");
  }

  init(data = {}) {
    this.direction =
      data.direction || "outbound";
  }

  create() {
    this.elapsed = 0;
    this.duration = 8000;
    this.finished = false;

    this.add.rectangle(
      480, 320, W, H, 0x17263d
    );

    const destination =
      this.direction === "return"
        ? "Housing complex  →  University"
        : "University  →  Housing complex";

    label(
      this, 480, 58,
      "CITIBUS — ON THE ROAD",
      29, "#f9d783",
      { fontStyle: "bold" }
    );

    label(
      this, 480, 100,
      destination,
      19, "#ffffff"
    );

    this.city = [];

    for (let i = 0; i < 10; i++) {
      const height =
        110 + (i * 37) % 115;

      const b = this.add.rectangle(
        i * 120,
        365 - height / 2,
        96,
        height,
        0x354a61
      );

      this.city.push(b);
    }

    this.add.rectangle(
      480, 475, 960, 220, 0x3d4550
    );

    this.marks = [];

    for (let i = 0; i < 12; i++) {
      this.marks.push(
        this.add.rectangle(
          i * 100,
          540,
          53,
          6,
          0xf3d77c
        )
      );
    }

    // Bus body
    this.add.rectangle(
      480, 407, 376, 124, 0xe8b54b
    ).setStrokeStyle(5, 0x54432f);

    // Windshield
    this.add.rectangle(
      307, 395, 34, 55, 0xa3c7d7
    ).setStrokeStyle(3, 0x334b5e);

    // Windows
    for (let x = 366; x <= 610; x += 61) {
      this.add.rectangle(
        x, 380, 49, 43, 0xa3c7d7
      ).setStrokeStyle(3, 0x334b5e);
    }

    // Wheels
    for (const x of [360, 604]) {
      this.add.circle(
        x, 472, 31, 0x181e26
      ).setStrokeStyle(5, 0x9ba0a8);
    }

    label(
      this, 477, 437,
      "CITIBUS", 25, "#303030",
      { fontStyle: "bold" }
    );

    this.status = label(
      this, 480, 585,
      "Traveling... 0%",
      20, "#ffffff"
    );

    label(
      this, 890, 610,
      "SPACE: Skip",
      14, "#c9d8e6"
    );

    const skip = () => this.arrive();

    this.input.keyboard.on(
      "keydown-SPACE", skip
    );

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        this.input.keyboard.off(
          "keydown-SPACE", skip
        );
      }
    );
  }

  update(_time, delta) {
    if (this.finished) return;

    this.elapsed += delta;

    const movement =
      Math.min(delta, 40) * 0.19;

    // Move road markings
    for (const mark of this.marks) {
      mark.x -= movement * 3;

      if (mark.x < -60) {
        mark.x += 1200;
      }
    }

    // Move background buildings
    for (const b of this.city) {
      b.x -= movement;

      if (b.x < -80) {
        b.x += 1200;
      }
    }

    const percentage = Math.min(
      100,
      Math.floor(
        100 * this.elapsed / this.duration
      )
    );

    this.status.setText(
      `Traveling... ${percentage}%`
    );

    if (this.elapsed >= this.duration) {
      this.arrive();
    }
  }

  arrive() {
    if (this.finished) return;

    this.finished = true;

    if (this.direction === "return") {
      this.scene.start(
        "CampusScene",
        { phase: "return" }
      );
    } else {
      this.scene.start("HousingScene");
    }
  }
}

// =====================================================
// VIDEO PLAYER
// =====================================================

function showInterviewVideo(scene, index, onClose) {
  const wrap = document.createElement("div");

  Object.assign(wrap.style, {
    position: "fixed",
    inset: "0",
    zIndex: "99999",
    background: "rgba(9,16,29,0.94)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "18px",
    color: "white",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  });

  const heading =
    document.createElement("h2");

  heading.textContent =
    `Housing Complex — Video Interview ${index + 1}`;

  heading.style.cssText =
    "margin:0;text-align:center;font-size:24px";

  const video =
    document.createElement("video");

  video.src = VIDEO_PATHS[index];
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";

  Object.assign(video.style, {
    width: "min(840px,94vw)",
    maxHeight: "65vh",
    background: "#000",
    border: "3px solid #d1b16a",
    borderRadius: "8px",
  });

  const message =
    document.createElement("p");

  message.textContent =
    "Watch the recorded interview, then select Continue Story.";

  message.style.cssText =
    "text-align:center;max-width:700px;margin:0;line-height:1.5";

  video.addEventListener("error", () => {
    video.style.display = "none";

    message.textContent =
      `Video not found.`;
  });

  const button =
    document.createElement("button");

  button.textContent = "Continue Story";

  button.style.cssText =
    "padding:13px 25px;background:#e8b54b;color:#1f2733;border:0;border-radius:7px;font-size:18px;font-weight:bold;cursor:pointer";

  let closed = false;

  const cleanup = (completed) => {
    if (closed) return;

    closed = true;

    video.pause();
    wrap.remove();

    scene.talking = false;

    if (
      completed &&
      scene.sys.isActive()
    ) {
      onClose();
    }
  };

  button.addEventListener(
    "click",
    () => cleanup(true)
  );

  wrap.append(
    heading,
    video,
    message,
    button
  );

  document.body.appendChild(wrap);
  scene.talking = true;

  scene.events.once(
    Phaser.Scenes.Events.SHUTDOWN,
    () => cleanup(false)
  );
}

// =====================================================
// SCENE 4 — HOUSING COMPLEX
// =====================================================

class HousingScene extends WalkScene {
  constructor() {
    super("HousingScene");
  }

  create() {
    drawHousing(this);

    this.npcs = [
  addCharacter(
    this, 382, 347,
    "npc_25",
    "Nuha [Video]"
  ),
];

    this.setupWalking(145, 365);

    panel(
  this,
  "HOUSING COMPLEX",
  `Watch the recorded interview (${progress.housing.size}/1)`
);

    controlsHint(this);

    this.showDialogue([
  "We've reached the housing complex. One resident agreed to share their experience on video.",
  "Approach the resident and press E to watch the interview.",
]);
  }

  interact() {
    for (let i = 0; i < this.npcs.length; i++) {
      if (
        !near(this.player, this.npcs[i], 95)
      ) continue;

      if (progress.housing.has(i)) {
        this.showDialogue(
          "You've watched this interview. Speak with the other resident."
        );
      } else {
        showInterviewVideo(this, i, () => {
          progress.housing.add(i);

          if (progress.housing.size === 1) {
            this.showDialogue([
  "The interview is complete. The afternoon has slipped away during our research.",
  "The sky is getting darker. We should check the bus stop.",
], () => {
  this.scene.start("EveningScene");
});
          } else {
            this.showDialogue(
              "Interview saved. Find the second resident."
            );
          }
        });
      }

      return;
    }
  }
}

// =====================================================
// SCENE 5 — EVENING / MISSING BUS
// =====================================================

class EveningScene extends WalkScene {
  constructor() {
    super("EveningScene");
  }

  create() {
    drawHousing(this, true);

    this.busStop = {
      x: 130,
      y: 310
    };

    this.friend = {
      x: 845,
      y: 305
    };

    this.checkedStop = false;

    this.setupWalking(570, 367);

    panel(
      this,
      "DUSK — SERVICE HAS ENDED",
      "Find out whether a bus is still available."
    );

    controlsHint(this);

    this.showDialogue(
      "It's getting dark. We head toward the bus stop, hoping to catch a ride home."
    );
  }

  interact() {
    if (!this.checkedStop) {
      if (
        near(this.player, this.busStop, 110)
      ) {
        this.checkedStop = true;

        this.showDialogue([
          "The bus stop is empty. There is no bus available for your trip tonight.",
          "Researcher (thinking): This is exactly the problem I've been studying. I need to stay here tonight.",
          "Perhaps I can sleep on the sofa for tonight in one of my friend's apartment here.",
        ]);
      } else {
        this.showDialogue(
          "Check the BUS STOP on the far left side of the complex."
        );
      }

      return;
    }

    if (
      near(this.player, this.friend, 110)
    ) {
      this.scene.start("OvernightScene");
    } else {
      this.showDialogue(
        "Walk to your friend's house on the right and press E near the entrance."
      );
    }
  }
}

// =====================================================
// SCENE 6 — NEXT MORNING
// =====================================================

class MorningScene extends WalkScene {
  constructor() {
    super("MorningScene");
  }

  create() {
    drawHousing(this, false, true);

    this.bus = {
      x: 130,
      y: 484
    };

    this.setupWalking(790, 360);

    panel(
      this,
      "THE NEXT MORNING",
      "Take the bus back to the University."
    );

    controlsHint(this);

    this.showDialogue(
      "Morning has arrived. There's a bus at the stop. Return to campus for your presentation."
    );
  }

  interact() {
    if (
      near(this.player, this.bus, 155)
    ) {
      this.scene.start(
        "BusJourneyScene",
        { direction: "return" }
      );
    } else {
      this.showDialogue(
        "Go to the Citibus stop on the left side of the housing complex."
      );
    }
  }
}

// =====================================================
// RESEARCH PRESENTATION CONTENT
// =====================================================

const SLIDES = [
  {
    title: "INTRODUCTION",
    body:
      "Hi folks! Before I jump into why I presented 4 interviews and will present more boring information, I would like to provide some context.",
  },
  {
    title: "",
    body:
      "To go or not to go? This is a question off-campus students at Texas Tech University may find themselves asking when an interesting club meeting, campus event, or recreational activity is scheduled for the evening. For students who rely on Citibus to commute to campus, the decision is not about whether an event is worth attending; rather, it is about whether they can get home afterward.",
  },
  {
    title: "",
    body:
      "Due to the bus services ending in the evening, students may have to leave campus early, pay for alternative transportation, or walk considerable distances to their residences. The problem goes beyond optional activities. Graduate students attending late classes and student employees working evening shifts at university facilities may also face transportation difficulties. Moreover, walking long distances at night can raise concerns about safety.",
  },
  {
    title: "",
    body:
      "Weekends present a similar challenge. Students who depend on public transportation may have limited options for reaching grocery stores, recreational facilities (like the Rec), and other destinations when regular bus service is unavailable. These limitations may affect students’ ability to participate fully in campus life and manage everyday responsibilities.",
  },
  {
    title: "",
    body:
      "Although expanding public transportation could require additional operating costs, introducing limited evening and weekend service (for example, one bus per route) may offer an alternative to improving the quality of life for off-campus residents.",
  },
  {
    title: "RESEARCH QUESTION",
    body:
      "So, this project dives in to find what the impact of extending Citibus evening hours (until 10:00 PM on a limited scale) and introducing limited weekend service is on the academic engagement, cost truncation, safety, and overall quality of life for off-campus students at Texas Tech University.",
  },
  {
    title: "WHAT WE HEARD",
    body:
      "",
  },
  {
    title: "",
    body:
      "",
  },
  
{
  title: "OTHER INFORMATION",
  body: `
Past researches allow us to find out about:
1. Academic participation
2. Financial stress
3. Student quality of life
4. The feasibility of limited service expansion
`
},

{
  title: "TRANSPORTATION AND ACADEMIC SUCCESS",
  body: `
Research identifies several ways in which
inadequate transportation may affect students`
},
{
  title: "",
  body: `
• Longer commutes reduce available study time.
• Unreliable transportation can contribute
  to lateness and missed classes.
• Travel-related fatigue and stress can
  interfere with academic engagement.
Improving accessibility may support
student participation.
(Igwe and Endurance 14–16)
`
},

{
  title: "TRANSPORTATION AND QUALITY OF LIFE",
  body: `
Research on university bus services highlights the relationship between
transportation and student well-being.
`},
{
  title: "TRANSFORMATION AND QUALITY OF LIFE CONTINUED",
  body:`
Limited transportation may contribute to:
• Financial pressure
• Concerns about traveling after dark
• Commute anxiety
• Reduced accessibility and social equity
Reliable transportation may improve students' overall university experience.
(Nadimi et al.)
`
},

{
  title: "CONNECTING RESEARCH TO OUR INTERVIEWS",
  body: `
Our interviews illustrate transportation
concerns discussed in academic research.`
},

{
  title: "CONNECTING RESEARCH TO OUR INTERVIEWS CONTINUED",
  body: `
Taseen reported spending almost $30 on
transportation to purchase $15 of groceries.

Eva described avoiding weekend travel
and missing a sorority event because of
transportation difficulties.
`},
{
  title: "CONNECTING RESEARCH TO OUR INTERVIEWS CONTINUED",
  body: `
These accounts connect transportation
accessibility to financial and social life.
`
},

{
  title: "COULD A SMALLER SERVICE WORK?",
  body: `
Instead of immediately expanding every
Citibus route, let us consider a limited program.`
},
{
title: "TINY BIT OF MATH",
body: `
Operating hours: 7 PM to 10 PM
Route loop: 2 miles
Frequency: Every 20 minutes
Operating period: 3 hours
Total distance: 18 miles
These are hypothetical planning assumptions,
not an approved Citibus service proposal.
`
},

{
  title: "ESTIMATING FUEL COST",
  body: `
Assumptions:
Distance traveled: 18 miles per evening
Fuel efficiency: 3.4 miles per gallon
(Alternative Fuels Data Center)`},
{
  title: "ESTIMATING FUEL COST CONTINUED",
  body: `
Fuel price: $3.953 per gallon
(U.S. Energy Information Administration)
Fuel required:
18 / 3.4 = approximately 5.29 gallons`},
{
  title: "ESTIMATING FUEL COST CONTINUED",
  body: `
Estimated fuel expense:
5.29 × $3.953 = approximately $20.91
FUEL COST: $20.91 PER EVENING
`
},

{
  title: "WHAT WOULD EXTENDED SERVICE COST?",
  body: `
Fuel expenses for one bus:
One evening (3 hours): $20.91
Five evenings: $104.55
Twenty evenings: $418.20
(Calculated using AFDC and EIA data)
`},
{
  title: "LIMITATIONS",
  body:`
IMPORTANT:
These figures include fuel only.
Driver wages, maintenance, insurance,
administration, and vehicle costs
are NOT included.
`
},

  {
    title: "POSSIBLE SOLUTIONS",
    body:
      "",
  },
  {
  title: "WORKS CITED",
  body: `
Thank you for exploring Beyond the Last Bus!
Our research draws on personal interviews,
academic publications, and transportation data.
Press V to view the complete Works Cited PDF.
Press R to restart the game.
`
},
];

// =====================================================
// SCENE 8 — AUDITORIUM / PRESENTATION
// =====================================================

class AuditoriumScene extends Phaser.Scene {
  constructor() {
    super("AuditoriumScene");
  }

  create() {
    this.slideIndex = 0;
    this.input.keyboard.on("keydown-V", () => {
  if (this.slideIndex === SLIDES.length - 1) {
    showWorksCitedPDF();
  }
});
    this.add.rectangle(
      480, 320, W, H, 0x182437
    );

    // Stage
    this.add.rectangle(
      480, 112, 920, 170, 0x60473e
    ).setStrokeStyle(5, 0xc6a977);

    label(
      this, 480, 39,
      "TEXAS TECH UNIVERSITY — RESEARCH PRESENTATION",
      21, "#ffe0a0",
      { fontStyle: "bold" }
    );

    // Audience seating
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        this.add.rectangle(
          69 + col * 75,
          400 + row * 46,
          48,
          25,
          0x405c7e
        ).setStrokeStyle(2, 0x263548);
      }
    }

    // Presentation screen
    this.screen = this.add.rectangle(
      480, 253, 830, 300, 0xf6efdc
    ).setStrokeStyle(8, 0xe7c277);

    this.slideTitle = label(
      this, 480, 162,
      "", 29, "#1f3547",
      { fontStyle: "bold" }
    );

    this.slideBody = label(
      this, 480, 283,
      "", 20, "#253748",
      {
        wordWrap: { width: 710 },
        lineSpacing: 8,
      }
    );

    this.counter = label(
      this, 480, 598,
      "", 16, "#f9e5b3"
    );

    const prev = label(
      this, 145, 598,
      "◀ PREVIOUS",
      17, "#ffffff",
      {
        backgroundColor: "#385775",
        padding: { x: 12, y: 8 },
      }
    ).setInteractive({
      useHandCursor: true
    });

    const next = label(
      this, 812, 598,
      "NEXT ▶",
      17, "#ffffff",
      {
        backgroundColor: "#385775",
        padding: { x: 12, y: 8 },
      }
    ).setInteractive({
      useHandCursor: true
    });

    prev.on(
      "pointerdown",
      () => this.changeSlide(-1)
    );

    next.on(
      "pointerdown",
      () => this.changeSlide(1)
    );

    this.input.keyboard.on(
      "keydown-RIGHT",
      () => this.changeSlide(1)
    );

    this.input.keyboard.on(
      "keydown-LEFT",
      () => this.changeSlide(-1)
    );

    this.input.keyboard.on(
      "keydown-SPACE",
      () => this.changeSlide(1)
    );

    this.input.keyboard.on(
      "keydown-R",
      () => {
        if (
          this.slideIndex === SLIDES.length - 1
        ) {
          resetProgress();

          this.scene.start(
            "CampusScene",
            { phase: "interviews" }
          );
        }
      }
    );

    this.renderSlide();
  }

  changeSlide(amount) {
    this.slideIndex = Phaser.Math.Clamp(
      this.slideIndex + amount,
      0,
      SLIDES.length - 1
    );

    this.renderSlide();
  }

  renderSlide() {
    const s = SLIDES[this.slideIndex];

    this.slideTitle.setText(s.title);
    this.slideBody.setText(s.body);

    this.counter.setText(
      `Slide ${this.slideIndex + 1} of ${SLIDES.length}    •    ← / → or SPACE to navigate`
    );
  }
}

// =====================================================
// PHASER CONFIGURATION
// =====================================================

const config = {
  type: Phaser.AUTO,

  width: W,
  height: H,

  parent: "app",

  backgroundColor: "#172638",

  pixelArt: true,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  scene: [
    CampusScene,
    MonologueScene,
    BusJourneyScene,
    HousingScene,
    EveningScene,
    OvernightScene,
    MorningScene,
    AuditoriumScene,
  ],
};

new Phaser.Game(config);
