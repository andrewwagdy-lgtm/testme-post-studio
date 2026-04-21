"use client";
import { useState, useRef } from "react";
import styles from "./page.module.css";

const POST_TYPES = [
  { id: "trivia", label: "Language Trivia" },
  { id: "quote",  label: "Expert Quote" },
  { id: "fact",   label: "Assessment Fact" },
  { id: "tip",    label: "Testing Tip" },
];

const PLATFORMS = ["LinkedIn", "Facebook"];

const TOPICS = [
  "General language testing",
  "IELTS / TOEFL style assessments",
  "University admissions & placement",
  "School-level language assessment",
  "History of language testing",
  "Validity & reliability in assessment",
  "Technology & AI in assessment",
  "Arabic language assessment",
  "Washback & test impact",
  "Formative vs summative assessment",
];

const HASHTAG_SETS = {
  trivia: "#LanguageTrivia #LinguisticFacts #LanguageLearning #TestMe #LanguageAssessment #EduFacts #Linguistics #TeachingLanguage",
  quote:  "#AssessmentQuote #LanguageTesting #EduLeadership #TestMe #LanguageAssessment #ELT #HigherEd #LanguageEducation",
  fact:   "#AssessmentFacts #LanguageTesting #HigherEducation #TestMe #EdTech #UniversityAdmissions #LanguageProficiency #EduData",
  tip:    "#AssessmentTips #LanguageTeaching #ELT #TestMe #LanguageAssessment #TeacherTips #HigherEd #EduBestPractice",
};

// ── Canvas drawing helpers ───────────────────────────────────────────────────

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawPuzzlePiece(ctx, x, y, w, h) {
  const b = Math.min(w, h) * 0.17;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w * 0.35, y);
  ctx.lineTo(x + w * 0.35, y - b * 0.5);
  ctx.arc(x + w * 0.5, y - b * 0.5, b * 0.48, Math.PI, 0, false);
  ctx.lineTo(x + w * 0.65, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h * 0.35);
  ctx.lineTo(x + w + b * 0.5, y + h * 0.35);
  ctx.arc(x + w + b * 0.5, y + h * 0.5, b * 0.48, -Math.PI / 2, Math.PI / 2, false);
  ctx.lineTo(x + w, y + h * 0.65);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w * 0.65, y + h);
  ctx.lineTo(x + w * 0.65, y + h + b * 0.5);
  ctx.arc(x + w * 0.5, y + h + b * 0.5, b * 0.48, 0, Math.PI, false);
  ctx.lineTo(x + w * 0.35, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + h * 0.65);
  ctx.lineTo(x - b * 0.5, y + h * 0.65);
  ctx.arc(x - b * 0.5, y + h * 0.5, b * 0.48, Math.PI / 2, -Math.PI / 2, false);
  ctx.lineTo(x, y + h * 0.35);
  ctx.lineTo(x, y);
  ctx.closePath();
}

function drawLogoOnCanvas(ctx, x, y, size) {
  const half = (size - 2) / 2;
  const gap = 2;
  const colors = ["#1A3A8F", "#6478B5", "#6478B5", "#C0392B"];
  const icons  = ["💬", "👂", "📖", "✏️"];
  [[0,0],[1,0],[0,1],[1,1]].forEach(([col, row], i) => {
    const px = x + col * (half + gap);
    const py = y + row * (half + gap);
    ctx.fillStyle = colors[i];
    roundedRect(ctx, px, py, half, half, 4);
    ctx.fill();
    ctx.font = `${half * 0.52}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(icons[i], px + half / 2, py + half / 2);
  });
}

function generateCanvas(post, typeLabel) {
  const W = 1080, H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#6FA3E0";
  ctx.fillRect(0, 0, W, H);

  // Puzzle pieces
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;
  const pieces = [
    [60,30,160,160],[250,30,155,155],[640,20,175,175],[860,60,150,150],
    [20,390,130,130],[900,360,145,145],[25,880,155,155],[855,840,165,165],
    [195,1150,150,150],[490,1165,155,155],[750,1130,145,145],
  ];
  pieces.forEach(([x,y,w,h]) => { drawPuzzlePiece(ctx,x,y,w,h); ctx.stroke(); });
  ctx.restore();

  // Logo
  const lx = 44, ly = 44, lsize = 78;
  drawLogoOnCanvas(ctx, lx, ly, lsize);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "bold 34px 'DM Sans', sans-serif";
  ctx.fillStyle = "#1A3A8F";
  ctx.fillText("TEST", lx + lsize + 10, ly + lsize / 2);
  const tw = ctx.measureText("TEST").width;
  ctx.font = "italic bold 34px 'DM Sans', sans-serif";
  ctx.fillStyle = "#C0392B";
  ctx.fillText("Me", lx + lsize + 10 + tw, ly + lsize / 2);

  // White card
  const cx = cardX => W / 2;
  const cardX = W * 0.07, cardY = H * 0.20, cardW = W * 0.86, cardH = H * 0.68;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.13)";
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "white";
  roundedRect(ctx, cardX, cardY, cardW, cardH, 52);
  ctx.fill();
  ctx.restore();

  const MID = cardX + cardW / 2;
  let cY = cardY + cardH * 0.11;
  const maxW = cardW * 0.78;

  // Type tag
  ctx.font = "500 25px 'DM Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const tagText = typeLabel.toUpperCase();
  const tagW = ctx.measureText(tagText).width + 60;
  const tagH = 50;
  ctx.fillStyle = "#EEF0F8";
  roundedRect(ctx, MID - tagW/2, cY, tagW, tagH, tagH/2);
  ctx.fill();
  ctx.strokeStyle = "#C5CBE8"; ctx.lineWidth = 2;
  roundedRect(ctx, MID - tagW/2, cY, tagW, tagH, tagH/2);
  ctx.stroke();
  ctx.fillStyle = "#6478B5";
  ctx.fillText(tagText, MID, cY + tagH / 2);
  cY += tagH + 50;

  // Headline
  ctx.font = "bold 50px 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#1A2353";
  ctx.textBaseline = "top";
  const headline = post.headline.replace(/\{\{/g, "\u201C").replace(/\}\}/g, "\u201D");
  const hlLines = wrapLines(ctx, headline, maxW);
  hlLines.forEach((l, i) => ctx.fillText(l, MID, cY + i * 66));
  cY += hlLines.length * 66 + 44;

  // Divider
  ctx.strokeStyle = "#E8EAF2"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(MID - 80, cY); ctx.lineTo(MID + 80, cY); ctx.stroke();
  cY += 40;

  // Body
  ctx.font = "400 33px 'DM Sans', sans-serif";
  ctx.fillStyle = "#555";
  const bodyLines = wrapLines(ctx, post.body, maxW);
  bodyLines.forEach((l, i) => ctx.fillText(l, MID, cY + i * 50));
  cY += bodyLines.length * 50 + 34;

  // Source
  if (post.source) {
    ctx.font = "italic 27px 'DM Sans', sans-serif";
    ctx.fillStyle = "#BBBBBB";
    ctx.fillText(post.source, MID, cY);
  }

  return canvas;
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [postType, setPostType]   = useState("trivia");
  const [platform, setPlatform]   = useState("LinkedIn");
  const [topic, setTopic]         = useState(TOPICS[0]);
  const [loading, setLoading]     = useState(false);
  const [post, setPost]           = useState(null);
  const [typeLabel, setTypeLabel] = useState("");
  const [error, setError]         = useState("");
  const [copied, setCopied]       = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setPost(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postType, platform, topic }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPost(data.post);
      setTypeLabel(data.typeLabel);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  function handleCopy() {
    if (!post) return;
    const text = post.caption + "\n\n" + (post.hashtags || HASHTAG_SETS[postType]);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    if (!post) return;
    setDownloading(true);
    setTimeout(() => {
      try {
        const canvas = generateCanvas(post, typeLabel);
        const a = document.createElement("a");
        a.download = `testme-post-${Date.now()}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
      } catch (e) {
        alert("Download failed: " + e.message);
      }
      setDownloading(false);
    }, 60);
  }

  const displayHeadline = post?.headline
    ?.replace(/\{\{/g, "\u201C")
    ?.replace(/\}\}/g, "\u201D");

  return (
    <div className={styles.page}>
      <div className={styles.app}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoRow}>
            <div className={styles.logoGrid}>
              <div className={styles.lp} style={{background:"#1A3A8F"}}>💬</div>
              <div className={styles.lp} style={{background:"#6478B5"}}>👂</div>
              <div className={styles.lp} style={{background:"#6478B5"}}>📖</div>
              <div className={styles.lp} style={{background:"#C0392B"}}>✏️</div>
            </div>
            <span className={styles.logoText}>
              <span className={styles.logoTest}>TEST</span>
              <span className={styles.logoMe}>Me</span>
            </span>
            <span className={styles.studioLabel}>Post Studio</span>
          </div>
          <p className={styles.subtitle}>AI-generated, accurately sourced social media posts for language assessment</p>
        </div>

        <div className={styles.studio}>

          {/* Controls */}
          <div className={styles.controls}>

            <div>
              <div className={styles.sectionLabel}>Post type</div>
              <div className={styles.typeGrid}>
                {POST_TYPES.map(t => (
                  <button
                    key={t.id}
                    className={`${styles.typeBtn} ${postType === t.id ? styles.typeBtnActive : ""}`}
                    onClick={() => setPostType(t.id)}
                  >{t.label}</button>
                ))}
              </div>
            </div>

            <div>
              <div className={styles.sectionLabel}>Platform</div>
              <div className={styles.platformRow}>
                {PLATFORMS.map(p => (
                  <button
                    key={p}
                    className={`${styles.platBtn} ${platform === p ? styles.platBtnActive : ""}`}
                    onClick={() => setPlatform(p)}
                  >{p}</button>
                ))}
              </div>
            </div>

            <div>
              <div className={styles.sectionLabel}>Topic focus</div>
              <select
                className={styles.select}
                value={topic}
                onChange={e => setTopic(e.target.value)}
              >
                {TOPICS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating…" : "Generate post ✦"}
            </button>

            {error && <div className={styles.error}>{error}</div>}

            {post && (
              <>
                <button className={styles.downloadBtn} onClick={handleDownload} disabled={downloading}>
                  {downloading ? "Preparing…" : "⬇ Download graphic (PNG)"}
                </button>
                <button className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy caption + hashtags"}
                </button>
              </>
            )}
          </div>

          {/* Preview */}
          <div className={styles.preview}>
            <div className={styles.sectionLabel}>Preview</div>

            <div className={styles.canvasWrap}>
              {/* SVG background */}
              <svg className={styles.puzzleBg} viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <rect width="400" height="500" fill="#6FA3E0"/>
                <g fill="none" stroke="white" strokeWidth="1.2" opacity="0.32">
                  <path d="M180,20 L180,60 Q200,60 200,50 Q200,40 220,40 L220,20 Z"/>
                  <path d="M240,10 L240,50 Q260,50 260,40 L300,40 L300,10 Z"/>
                  <path d="M320,30 L320,80 L360,80 L360,30 Q340,30 340,20 Q340,10 330,15 Q320,20 320,30 Z"/>
                  <path d="M10,180 L10,220 Q20,220 20,210 Q20,200 30,200 L50,200 L50,180 Z"/>
                  <path d="M350,200 L350,250 L390,250 L390,200 Q370,200 370,190 Q370,180 360,185 Q350,190 350,200 Z"/>
                  <path d="M30,350 L30,400 Q50,400 50,390 L80,390 L80,350 Q60,350 60,340 Q60,330 50,335 Q40,340 30,350 Z"/>
                  <path d="M300,380 L300,430 L350,430 L350,380 Q330,380 330,370 Q330,360 315,365 Z"/>
                  <path d="M100,440 L100,490 Q120,490 120,480 Q120,470 135,470 L135,440 Z"/>
                  <path d="M200,450 L200,490 L250,490 L250,450 Q230,450 230,440 Q230,430 220,435 Z"/>
                  <path d="M60,60 L60,110 L110,110 L110,60 Q90,60 90,50 Q90,40 78,44 Z"/>
                </g>
              </svg>

              {/* Logo */}
              <div className={styles.logoArea}>
                <div className={styles.miniLogoGrid}>
                  <div className={styles.mlp} style={{background:"#1A3A8F"}}>💬</div>
                  <div className={styles.mlp} style={{background:"#6478B5"}}>👂</div>
                  <div className={styles.mlp} style={{background:"#6478B5"}}>📖</div>
                  <div className={styles.mlp} style={{background:"#C0392B"}}>✏️</div>
                </div>
                <span className={styles.miniLogoText}>
                  <span style={{color:"#1A3A8F",fontWeight:700}}>TEST</span>
                  <span style={{color:"#C0392B",fontWeight:700,fontStyle:"italic"}}>Me</span>
                </span>
              </div>

              {/* White card */}
              <div className={styles.whiteCard}>
                {loading ? (
                  <div className={styles.loadingCard}>
                    <div className={styles.spinner}></div>
                    <p>Generating your post…</p>
                  </div>
                ) : post ? (
                  <div className={styles.cardContent}>
                    <span className={styles.tag}>{typeLabel.toUpperCase()}</span>
                    <p className={styles.cardHeadline}>{displayHeadline}</p>
                    <div className={styles.divider}></div>
                    <p className={styles.cardBody}>{post.body}</p>
                    {post.source && <p className={styles.cardSource}>{post.source}</p>}
                  </div>
                ) : (
                  <div className={styles.emptyCard}>
                    <p>Choose a type and topic,<br/>then click <strong>Generate post</strong></p>
                  </div>
                )}
              </div>
            </div>

            {/* Caption area */}
            {post && (
              <div className={styles.captionWrap}>
                <div className={styles.sectionLabel} style={{marginBottom:6}}>Caption</div>
                <div className={styles.captionBox}>{post.caption}</div>
                <div className={styles.hashtagBox}>{post.hashtags || HASHTAG_SETS[postType]}</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
