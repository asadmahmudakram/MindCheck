import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream: #F7F4EE;
          --sage: #4A6741;
          --sage-light: #7A9B70;
          --sage-pale: #E8EFE6;
          --bark: #2C2416;
          --bark-mid: #5C4F3A;
          --gold: #C9A84C;
          --gold-light: #E8D49A;
          --white: #FFFFFF;
        }

        .landing {
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px;
          background: rgba(247,244,238,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(74,103,65,0.1);
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--bark);
          font-weight: 600;
          font-size: 18px;
        }
        .nav-logo-dot {
          width: 32px;
          height: 32px;
          background: var(--sage-pale);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-logo-img {
          height: 50px;
          width: auto;
          object-fit: contain;
        }
        .nav-logo:hover { opacity: 0.9; }
        .nav-links {
          display: flex; align-items: center; gap: 32px;
          list-style: none;
        }
        .nav-links a {
          font-size: 14px; font-weight: 400; color: var(--bark-mid);
          text-decoration: none; transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--bark); }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .btn-ghost {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; color: var(--bark);
          background: none; border: none; cursor: pointer; padding: 8px 16px;
          border-radius: 8px; transition: background 0.2s; text-decoration: none;
        }
        .btn-ghost:hover { background: var(--sage-pale); }
        .btn-primary {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600; color: var(--white);
          background: var(--bark); border: none; cursor: pointer;
          padding: 10px 20px; border-radius: 10px;
          transition: all 0.2s; text-decoration: none; display: inline-flex;
          align-items: center; gap: 6px;
        }
        .btn-primary:hover { background: var(--sage); transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          padding: 140px 48px 80px;
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: center;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--sage-pale); border: 1px solid rgba(74,103,65,0.2);
          color: var(--sage); font-size: 13px; font-weight: 500;
          padding: 6px 14px; border-radius: 100px; margin-bottom: 28px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--sage-light); animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: 62px; line-height: 1.08; color: var(--bark);
          margin-bottom: 20px;
        }
        .hero-title em {
          font-style: italic; color: var(--gold);
        }
        .hero-desc {
          font-size: 17px; line-height: 1.7; color: var(--bark-mid);
          margin-bottom: 40px; font-weight: 300; max-width: 440px;
        }
        .hero-cta {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .btn-cta {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600; color: var(--white);
          background: var(--bark); border: none; cursor: pointer;
          padding: 14px 28px; border-radius: 12px;
          transition: all 0.25s; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(44,36,22,0.2);
        }
        .btn-cta:hover {
          background: var(--sage); transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(74,103,65,0.3);
        }
        .btn-cta-outline {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 500; color: var(--bark-mid);
          background: transparent; border: none; cursor: pointer;
          padding: 14px 0; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          transition: color 0.2s;
        }
        .btn-cta-outline:hover { color: var(--bark); }
        .btn-cta-outline svg { transition: transform 0.2s; }
        .btn-cta-outline:hover svg { transform: translateX(3px); }

        .hero-stats {
          display: flex; gap: 40px; margin-top: 48px;
          padding-top: 40px; border-top: 1px solid rgba(74,103,65,0.15);
        }
        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 32px; color: var(--bark); line-height: 1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 13px; color: var(--bark-mid); font-weight: 400;
        }

        /* ── MOCKUP ── */
        .hero-visual {
          position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .mockup-bg {
          position: absolute; inset: -40px;
          background: radial-gradient(ellipse at center, rgba(74,103,65,0.12) 0%, transparent 70%);
          border-radius: 50%;
        }
        .mockup-card {
          background: var(--white);
          border-radius: 20px;
          box-shadow: 0 24px 80px rgba(44,36,22,0.12), 0 4px 20px rgba(44,36,22,0.06);
          padding: 0; overflow: hidden;
          width: 100%; max-width: 420px;
          position: relative; z-index: 1;
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .mockup-topbar {
          background: var(--bark);
          padding: 14px 20px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .mockup-dots { display: flex; gap: 6px; }
        .mockup-dot {
          width: 10px; height: 10px; border-radius: 50%;
        }
        .mockup-title {
          font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.6);
          letter-spacing: 0.05em;
        }
        .mockup-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; }

        .chat-bubble-user {
          align-self: flex-end;
          background: var(--bark);
          color: white;
          padding: 12px 16px;
          border-radius: 16px 16px 4px 16px;
          font-size: 13px; line-height: 1.5;
          max-width: 85%;
        }
        .chat-bubble-ai {
          align-self: flex-start;
          display: flex; gap: 10px; align-items: flex-start;
          max-width: 90%;
        }
        .ai-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--sage-pale);
          border: 1px solid rgba(74,103,65,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px;
        }
        .ai-bubble-text {
          background: var(--cream);
          border: 1px solid rgba(74,103,65,0.12);
          padding: 12px 16px;
          border-radius: 4px 16px 16px 16px;
          font-size: 13px; line-height: 1.6;
          color: var(--bark);
        }
        .ai-bubble-text em { font-style: italic; color: var(--sage); }

        .mood-bar {
          background: var(--sage-pale);
          border: 1px solid rgba(74,103,65,0.15);
          border-radius: 12px; padding: 12px 14px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .mood-row {
          display: flex; align-items: center; gap: 8px;
        }
        .mood-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); }
        .mood-label { font-size: 11px; font-weight: 600; color: var(--sage); flex: 1; }
        .mood-track {
          flex: 2; height: 4px; background: rgba(74,103,65,0.15); border-radius: 99px;
          overflow: hidden;
        }
        .mood-fill { height: 100%; background: var(--gold); border-radius: 99px; width: 75%; }
        .mood-score { font-size: 11px; font-family: monospace; color: var(--bark-mid); }
        .mood-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .mood-tag {
          font-size: 10px; background: white;
          border: 1px solid rgba(74,103,65,0.2);
          color: var(--sage); padding: 3px 8px; border-radius: 100px;
        }

        .mockup-input {
          margin: 0 20px 20px;
          background: var(--cream);
          border: 1px solid rgba(74,103,65,0.2);
          border-radius: 12px;
          padding: 10px 14px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .mockup-input-text { font-size: 12px; color: rgba(44,36,22,0.35); }
        .mockup-send {
          width: 28px; height: 28px; border-radius: 8px;
          background: var(--bark);
          display: flex; align-items: center; justify-content: center;
        }

        /* floating badge */
        .float-badge {
          position: absolute; z-index: 2;
          background: white; border-radius: 12px;
          box-shadow: 0 8px 32px rgba(44,36,22,0.1);
          padding: 10px 14px;
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 500; color: var(--bark);
          animation: float2 5s 1s ease-in-out infinite;
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(-2deg); }
        }
        .float-badge-1 { top: -16px; right: -20px; }
        .float-badge-2 { bottom: 20px; left: -28px; animation-delay: 2s; }
        .float-badge-icon { font-size: 18px; }

        /* ── FEATURES ── */
        .features {
          padding: 80px 48px;
          max-width: 1200px; margin: 0 auto;
        }
        .section-label {
          font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--sage);
          margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Instrument Serif', serif;
          font-size: 42px; color: var(--bark); line-height: 1.15;
          margin-bottom: 56px; max-width: 520px;
        }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        .feature-card {
          background: white;
          border: 1px solid rgba(74,103,65,0.1);
          border-radius: 20px; padding: 28px;
          transition: all 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(44,36,22,0.08);
          border-color: rgba(74,103,65,0.25);
        }
        .feature-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--sage-pale);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; margin-bottom: 16px;
        }
        .feature-title {
          font-family: 'Instrument Serif', serif;
          font-size: 20px; color: var(--bark); margin-bottom: 8px;
        }
        .feature-desc {
          font-size: 14px; line-height: 1.65; color: var(--bark-mid); font-weight: 300;
        }

        /* ── CTA SECTION ── */
        .cta-section {
          margin: 0 48px 80px;
          background: var(--bark);
          border-radius: 28px;
          padding: 72px 64px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 40px; overflow: hidden; position: relative;
        }
        .cta-bg {
          position: absolute; right: -60px; top: -60px;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(74,103,65,0.3);
        }
        .cta-bg2 {
          position: absolute; right: 80px; bottom: -80px;
          width: 200px; height: 200px; border-radius: 50%;
          background: rgba(201,168,76,0.15);
        }
        .cta-text { position: relative; z-index: 1; }
        .cta-title {
          font-family: 'Instrument Serif', serif;
          font-size: 42px; color: white; line-height: 1.1; margin-bottom: 12px;
        }
        .cta-title em { font-style: italic; color: var(--gold-light); }
        .cta-subtitle { font-size: 15px; color: rgba(255,255,255,0.6); font-weight: 300; }
        .cta-action { position: relative; z-index: 1; flex-shrink: 0; }
        .btn-cta-white {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600; color: var(--bark);
          background: white; border: none; cursor: pointer;
          padding: 14px 28px; border-radius: 12px;
          transition: all 0.25s; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .btn-cta-white:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.25); }

        /* ── FOOTER ── */
        footer {
          padding: 32px 48px;
          border-top: 1px solid rgba(74,103,65,0.1);
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 16px; color: var(--bark-mid);
          display: flex; align-items: center; gap: 8px; text-decoration: none;
        }
        .footer-copy { font-size: 13px; color: rgba(92,79,58,0.5); }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .hero { grid-template-columns: 1fr; padding: 100px 24px 60px; gap: 48px; }
          .hero-title { font-size: 42px; }
          .features { padding: 60px 24px; }
          .features-grid { grid-template-columns: 1fr; }
          .cta-section { margin: 0 24px 60px; padding: 48px 32px; flex-direction: column; }
          .cta-title { font-size: 32px; }
          footer { padding: 24px; flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <div className="landing">
        {/* NAV */}
        <nav className="nav">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-dot">
              <img
                src="logo/logo-mindcheck.png"
                alt="MindCheck Logo"
                className="nav-logo-img"
              />
            </div>
            MindCheck
          </Link>
          <ul className="nav-links">
            <li>
              <a href="#fitur">Fitur</a>
            </li>
            <li>
              <a href="#cara-kerja">Cara Kerja</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
          <div className="nav-actions">
            <Link href="/login" className="btn-ghost">
              Masuk
            </Link>
            <Link href="/login" className="btn-primary">
              Mulai Gratis →
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="hero-badge-dot" />
              Gratis untuk semua pengguna Indonesia
            </div>
            <h1 className="hero-title">
              Kesehatan mentalmu <em>lebih terjaga</em> bersama AI.
            </h1>
            <p className="hero-desc">
              Curhat setiap hari, analisis mood otomatis, dan dapatkan
              rekomendasi aktivitas personal — semuanya dalam Bahasa Indonesia.
            </p>
            <div className="hero-cta">
              <Link href="/login" className="btn-cta">
                Coba MindCheck Gratis →
              </Link>
              <Link href="/dashboard" className="btn-cta-outline">
                Lihat cara kerjanya
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-num">AI</div>
                <div className="stat-label">Powered by Gemini</div>
              </div>
              <div>
                <div className="stat-num">100%</div>
                <div className="stat-label">Bahasa Indonesia</div>
              </div>
              <div>
                <div className="stat-num">Gratis</div>
                <div className="stat-label">Untuk semua</div>
              </div>
            </div>
          </div>

          {/* MOCKUP */}
          <div className="hero-visual">
            <div className="mockup-bg" />

            {/* floating badges */}
            <div className="float-badge float-badge-1">
              <span className="float-badge-icon">🌿</span>
              Mood hari ini: Tenang
            </div>
            <div className="float-badge float-badge-2">
              <span className="float-badge-icon">📈</span>
              +2 poin dari kemarin
            </div>

            <div className="mockup-card">
              <div className="mockup-topbar">
                <div className="mockup-dots">
                  <div
                    className="mockup-dot"
                    style={{ background: "#FF5F57" }}
                  />
                  <div
                    className="mockup-dot"
                    style={{ background: "#FEBC2E" }}
                  />
                  <div
                    className="mockup-dot"
                    style={{ background: "#28C840" }}
                  />
                </div>
                <span className="mockup-title">MindCheck · Curhat</span>
                <div style={{ width: 56 }} />
              </div>

              <div className="mockup-body">
                <div className="chat-bubble-user">
                  Hari ini aku ngerasa cemas soal presentasi besok 😟
                </div>

                <div className="chat-bubble-ai">
                  <div className="ai-avatar">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M17 8C8 10 5.9 16.17 3.82 19.88a1 1 0 001.69 1.06C7 19 9 17 12 17c4 0 7-3 7-7 0-2-1-4-2-2z"
                        fill="#4A6741"
                      />
                    </svg>
                  </div>
                  <div className="ai-bubble-text">
                    Wajar banget ngerasa begitu! Cemas sebelum presentasi adalah
                    tanda kamu peduli dengan hasilnya. Coba tarik napas dalam 4
                    hitungan — itu sudah terbukti bantu.{" "}
                    <em>Kamu sudah siap lebih dari yang kamu kira.</em>
                  </div>
                </div>

                <div className="mood-bar">
                  <div className="mood-row">
                    <div
                      className="mood-dot"
                      style={{ background: "#E8A04C" }}
                    />
                    <span className="mood-label">Cemas</span>
                    <div className="mood-track">
                      <div
                        className="mood-fill"
                        style={{ background: "#E8A04C", width: "60%" }}
                      />
                    </div>
                    <span className="mood-score">6/10</span>
                  </div>
                  <div className="mood-tags">
                    <span className="mood-tag">Tarik napas 4-7-8</span>
                    <span className="mood-tag">Visualisasi sukses</span>
                    <span className="mood-tag">Tidur cukup</span>
                  </div>
                </div>
              </div>

              <div className="mockup-input">
                <span className="mockup-input-text">
                  Ceritakan perasaanmu hari ini...
                </span>
                <div className="mockup-send">
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19V5m0 0l-7 7m7-7l7 7"
                      style={{
                        transform: "rotate(90deg)",
                        transformOrigin: "center",
                      }}
                    />
                    <line
                      x1="5"
                      y1="12"
                      x2="19"
                      y2="12"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features" id="fitur">
          <div className="section-label">Fitur Utama</div>
          <h2 className="section-title">
            Semua yang kamu butuhkan untuk jaga mental
          </h2>
          <div className="features-grid">
            {[
              {
                icon: "💬",
                title: "Curhat Tanpa Judgement",
                desc: "AI yang mendengarkan dengan empati, memberi respons hangat dalam Bahasa Indonesia yang natural dan tidak menghakimi.",
              },
              {
                icon: "📊",
                title: "Analisis Mood Otomatis",
                desc: "Setiap sesi chat dianalisis dan diberi skor mood 1–10 secara otomatis. Pantau tren emosi kamu sepanjang minggu.",
              },
              {
                icon: "🌱",
                title: "Rekomendasi Aktivitas",
                desc: "Berdasarkan kondisi mood kamu, AI memberikan 2–3 aktivitas personal yang relevan untuk membantu kamu merasa lebih baik.",
              },
              {
                icon: "📈",
                title: "Grafik Mood Mingguan",
                desc: "Visualisasi perubahan mood kamu dalam 7 hari terakhir. Kenali pola emosi dan jadwal yang mempengaruhi kesehatan mentalmu.",
              },
              {
                icon: "🔒",
                title: "Privasi Terjaga",
                desc: "Login dengan akun Google kamu. Riwayat percakapan tersimpan aman dan hanya bisa diakses oleh kamu sendiri.",
              },
              {
                icon: "✨",
                title: "Gratis Selamanya",
                desc: "MindCheck dibuat untuk semua orang. Tidak ada biaya tersembunyi, tidak ada batas sesi. Kesehatan mental adalah hak semua orang.",
              },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-bg" />
          <div className="cta-bg2" />
          <div className="cta-text">
            <h2 className="cta-title">
              Mulai hari ini,
              <br />
              <em>gratis selamanya.</em>
            </h2>
            <p className="cta-subtitle">
              Tidak perlu kartu kredit. Cukup akun Google kamu.
            </p>
          </div>
          <div className="cta-action">
            <Link href="/login" className="btn-cta-white">
              Mulai Sekarang →
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <Link href="/" className="footer-logo">
            <div className="nav-logo-dot" style={{ width: 22, height: 22 }}>
              <img
                src="/logo/logo_mindcheck.png"
                alt="MindCheck Logo"
                style={{ width: "14px", height: "14px", objectFit: "contain" }}
              />
            </div>
            MindCheck
          </Link>
          <p className="footer-copy">
            © 2026 MindCheck · Dibuat untuk #JuaraVibeCoding
          </p>
        </footer>
      </div>
    </>
  );
}
