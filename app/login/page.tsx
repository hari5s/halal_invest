"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Mail, ShieldCheck, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

type Step = "form" | "sent";
type Method = "email" | "google";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
      <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
      <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
      <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
    </svg>
  );
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isVerifyMode = searchParams.get("verify") === "1";

  const [step, setStep] = useState<Step>(isVerifyMode ? "sent" : "form");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isVerifyMode) setStep("sent");
  }, [isVerifyMode]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Veuillez entrer une adresse email valide.");
      return;
    }
    setError("");
    setLoading(true);

    const res = await signIn("email", {
      email,
      redirect: false,
      callbackUrl: "/",
    });

    setLoading(false);

    if (res?.error) {
      setError("Une erreur est survenue. Vérifiez votre email et réessayez.");
    } else {
      setStep("sent");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070a0f] p-4">

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />
        <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-emerald-400/[0.04] blur-[100px]" />
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.3) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Card ── */}
      <div className="relative w-full max-w-[420px]">

        {/* Logo + brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="mb-6 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 font-black text-sm text-black shadow-lg shadow-emerald-500/20">
              EI
            </div>
            <span className="text-lg font-semibold text-white">Ethiq Invest</span>
          </Link>

          {step === "form" ? (
            <>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">Connexion / Inscription à Ethiq</h2>
              <p className="mt-2 text-sm text-zinc-400">Plateforme premium d'analyse d'actions</p>
              <p className="mt-1.5 text-sm text-zinc-400">
                Connectez-vous à votre espace premium
              </p>
            </>
          ) : (
            <>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Vérifiez vos emails</h1>
              <p className="mt-1.5 text-sm text-zinc-400">
                Un lien de connexion a été envoyé à
              </p>
              <p className="mt-1 text-sm font-semibold text-emerald-400">{email || "votre adresse email"}</p>
            </>
          )}
        </div>

        {/* Glass card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="p-8">
            {step === "form" ? (
              <div className="space-y-5">

                {/* Google button */}
                <button
                  id="btn-google"
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.98] disabled:opacity-60"
                >
                  {googleLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continuer avec Google
                </button>

                {/* Divider */}
                <div className="relative flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-xs font-medium text-zinc-600">OU PAR EMAIL</span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                {/* Email form */}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
                    >
                      Adresse email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="vous@exemple.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-emerald-500/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-emerald-500/30"
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-xs text-rose-400">{error}</p>
                    )}
                  </div>

                  <button
                    id="btn-email"
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        Recevoir un lien de connexion
                      </>
                    )}
                  </button>
                </form>

                {/* Footer note */}
                <p className="text-center text-[11px] leading-5 text-zinc-600">
                  Pas de mot de passe — nous vous envoyons un lien sécurisé.
                  <br />
                  En continuant, vous acceptez nos{" "}
                  <span className="text-zinc-500 hover:text-zinc-300 cursor-pointer">CGU</span>.
                </p>
              </div>
            ) : (
              /* ── Email sent confirmation ── */
              <div className="space-y-6 text-center">
                <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] p-5">
                  <p className="text-sm leading-6 text-zinc-300">
                    Cliquez sur le lien dans l&apos;email pour accéder instantanément
                    à votre espace. Le lien expire dans{" "}
                    <span className="font-semibold text-white">24 heures</span>.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-zinc-600">
                  <p>Pas reçu ? Vérifiez vos spams.</p>
                </div>

                <button
                  onClick={() => { setStep("form"); setEmail(""); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] py-3 text-sm text-zinc-400 transition hover:border-white/10 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Utiliser une autre adresse
                </button>
              </div>
            )}
          </div>

          {/* Security strip */}
          <div className="flex items-center justify-center gap-2 border-t border-white/[0.06] bg-white/[0.02] px-8 py-3">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/60" />
            <span className="text-[11px] text-zinc-600">
              Connexion sécurisée · Données chiffrées
            </span>
          </div>
        </div>

        {/* Back to app */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-600 transition hover:text-zinc-300"
          >
            ← Retour à l&apos;application
          </Link>
        </div>
      </div>
    </div>
  );
}
