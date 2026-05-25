"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect jika sudah login
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-[#4A6741] animate-pulse" />
      </div>
    );
  }

  // Jangan render form kalau sudah login
  if (user) return null;

  const handleGoogleLogin = async () => {
    setError("");
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login gagal";
      setError(msg.includes("popup-closed") ? "Popup ditutup. Coba lagi." : "Login Google gagal. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Email atau password salah.");
      } else if (code === "auth/invalid-email") {
        setError("Format email tidak valid.");
      } else if (code === "auth/too-many-requests") {
        setError("Terlalu banyak percobaan. Coba lagi nanti.");
      } else {
        setError("Login gagal. Periksa email dan password kamu.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#d4e0d4] shadow-sm p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/logo/logo-mindcheck.png"
            alt="MindCheck"
            className="w-16 h-16 object-contain mx-auto mb-3"
          />
          <h1 className="text-xl font-bold text-[#2C2416]">Masuk ke MindCheck</h1>
          <p className="text-[#5C4F3A] text-sm mt-1">Selamat datang kembali 👋</p>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 bg-white border border-[#d4e0d4] text-[#2C2416] px-4 py-3 rounded-xl font-medium hover:bg-[#F7F4EE] hover:border-[#a8c2a8] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isSubmitting ? "Memproses..." : "Masuk dengan Google"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#d4e0d4]" />
          <span className="text-xs text-[#a8c2a8] font-medium">atau</span>
          <div className="flex-1 h-px bg-[#d4e0d4]" />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#5C4F3A] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@email.com"
              required
              className="w-full px-3 py-2.5 rounded-xl border border-[#d4e0d4] text-sm text-[#2C2416] placeholder-[#a8c2a8] outline-none focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5C4F3A] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2.5 rounded-xl border border-[#d4e0d4] text-sm text-[#2C2416] placeholder-[#a8c2a8] outline-none focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/10 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2C2416] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#4A6741] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-xs text-[#a8c2a8] mt-5">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#4A6741] font-medium hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}