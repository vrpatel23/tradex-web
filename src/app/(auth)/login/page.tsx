// src/app/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import { isValidPhone } from "@/lib/utils";
import Link from "next/link";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const setupRecaptcha = () => {
    const w = window as unknown as Record<string, unknown>;
    if (!w.recaptchaVerifier) {
      w.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  const sendOtp = async () => {
    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      setupRecaptcha();
      const formattedPhone = "+91" + phone.replace(/\D/g, "").slice(-10);
      const w = window as unknown as Record<string, unknown>;
      const result = await signInWithPhoneNumber(auth, formattedPhone, w.recaptchaVerifier as RecaptchaVerifier);
      setConfirmation(result);
      setStep("otp");
      toast.success("OTP sent to +91 " + phone);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Failed to send OTP. Check your phone number.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmation || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const result = await confirmation.confirm(otp);
      const idToken = await result.user.getIdToken();
      const { data } = await authApi.login(idToken);
      setAuth(data.user, data.token);
      toast.success("Welcome to TradeX!");
      // Route based on user state
      if (data.isNewUser || !data.user.hasBusiness) {
        router.push("/onboarding");
      } else if (data.user.role === "SELLER" || data.user.role === "BOTH") {
        router.push("/seller/dashboard");
      } else {
        router.push("/buyer/dashboard");
      }
    } catch {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-900 mt-4">
            {step === "phone" ? "Sign in to TradeX" : "Verify your number"}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {step === "phone"
              ? "Enter your mobile number to continue"
              : "We sent an OTP to +91 " + phone}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-card p-6">
          {step === "phone" ? (
            <div className="space-y-4">
              <Input
                label="Mobile number"
                type="tel"
                prefix="+91"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                maxLength={10}
              />
              <Button fullWidth loading={loading} onClick={sendOtp} disabled={phone.length < 10}>
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">OTP</label>
                <input
                  type="tel"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
                  placeholder="● ● ● ● ● ●"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <Button fullWidth loading={loading} onClick={verifyOtp} disabled={otp.length !== 6}>
                Verify & Continue
              </Button>
              <button onClick={() => { setStep("phone"); setOtp(""); }}
                className="w-full text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
                Use a different number
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-neutral-400 text-center mt-6">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-neutral-600">Terms</Link> and{" "}
          <Link href="/privacy" className="underline hover:text-neutral-600">Privacy Policy</Link>
        </p>

        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
