# 🌿 MindCheck — AI Mental Health Check-in

Aplikasi check-in kesehatan mental harian dengan AI yang empati, dibangun untuk #JuaraVibeCoding.

## ✨ Fitur
- 💬 Chat dengan AI yang empatik dan tidak menghakimi
- 📊 Analisis mood otomatis setiap sesi (skor 1–10)
- 📈 Grafik mood mingguan
- 💡 Rekomendasi aktivitas personal
- 🗂️ Riwayat check-in tersimpan lokal

## 🛠️ Stack Teknologi
- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS**
- **Gemini 2.0 Flash** via `@google/generative-ai`
- **Recharts** untuk visualisasi mood
- **Docker** + **Google Cloud Run** untuk deployment

---

## 🚀 Jalankan Lokal

### 1. Clone & Install
```bash
git clone <repo-url>
cd mindcheck
npm install
```

### 2. Setup API Key
```bash
cp .env.local.example .env.local
```
Buka `.env.local` dan isi `GEMINI_API_KEY` kamu.

Dapatkan API key gratis di: https://aistudio.google.com/app/apikey

### 3. Jalankan
```bash
npm run dev
```
Buka http://localhost:3000

---

## ☁️ Deploy ke Google Cloud Run

### Prasyarat
- Google Cloud account dengan billing aktif
- Cloud Run + Artifact Registry + Cloud Build API sudah diaktifkan
- `gcloud` CLI sudah terinstall dan login

### Langkah Deploy

```bash
# 1. Set project
gcloud config set project YOUR_PROJECT_ID

# 2. Build dan push image ke Artifact Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/mindcheck

# 3. Deploy ke Cloud Run
gcloud run deploy mindcheck \
  --image gcr.io/YOUR_PROJECT_ID/mindcheck \
  --platform managed \
  --region asia-southeast2 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_api_key_here \
  --port 3000
```

Setelah selesai, kamu akan mendapat URL publik seperti:
`https://mindcheck-xxxxx-et.a.run.app`

---

## 📦 Struktur Proyek
```
mindcheck/
├── app/
│   ├── api/chat/route.ts     # Gemini API handler
│   ├── globals.css           # Global styles
│   ├── layout.tsx
│   └── page.tsx              # Main app
├── components/
│   └── MoodChart.tsx         # Grafik mood (Recharts)
├── lib/
│   ├── gemini.ts             # Gemini config & helpers
│   └── types.ts              # TypeScript types
├── Dockerfile
└── .env.local.example
```

---

## 🏆 Tips untuk Judging #JuaraVibeCoding

1. **Demo Video (LinkedIn)**: Tunjukkan flow lengkap — input teks → analisis mood → grafik
2. **Hashtag**: Wajib pakai `#JuaraVibeCoding`
3. **Uniqueness**: Highlight fitur mood scoring + aktivitas rekomendasi sebagai "wow factor"
