"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { buildAuthModeHref, safePostAuthUrl } from "@/lib/auth-redirect";

export interface ModernLoginSignupProps {
  initialMode?: "login" | "signup";
  onModeChange?: (mode: "login" | "signup") => void;
  brandName?: string;
  logo?: React.ReactNode;
  onSuccess?: () => void;
}

function getPostAuthUrl() {
  if (typeof window === "undefined") return "/";
  const params = new URL(window.location.href).searchParams;
  const requested = params.get("redirect_url") || params.get("redirectUrl") || params.get("next");
  return safePostAuthUrl(requested, window.location.origin);
}

export default function ModernLoginSignup({
  initialMode = "login",
  onModeChange,
  brandName = "Mindflare Arena",
  logo,
  onSuccess,
}: ModernLoginSignupProps = {}) {
  const router = useRouter();
  const clerk = useClerk();
  const [isLogin, setIsLogin] = useState(initialMode === "login");

  // Form states
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLogin(initialMode === "login");
    setError(null);
    setShowPasswordField(false);
    setShowPasswordText(false);
    setPendingVerification(false);
    setIsAdult(false);
  }, [initialMode]);

  const handleToggleMode = (mode: "login" | "signup") => {
    setError(null);
    setShowPasswordField(false);
    setShowPasswordText(false);
    setPendingVerification(false);
    setIsAdult(false);
    setIsLogin(mode === "login");
    if (onModeChange) {
      onModeChange(mode);
    } else {
      router.push(buildAuthModeHref(mode, getPostAuthUrl()));
    }
  };

  const finishAuthentication = async (sessionId: string) => {
    await clerk.setActive({ session: sessionId });
    onSuccess?.();
    router.replace(getPostAuthUrl());
    router.refresh();
  };

  const handleGoogleAuth = async () => {
    setError(null);
    if (!isLogin && !isAdult) {
      setError("Confirm that you are 18 or older to create an account.");
      return;
    }
    setIsLoading(true);
    try {
      if (!clerk.loaded || !clerk.client) {
        throw new Error("Authentication service is loading. Please wait a moment.");
      }

      if (isLogin) {
        await clerk.client.signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: getPostAuthUrl(),
        });
      } else {
        await clerk.client.signUp.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: getPostAuthUrl(),
        });
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Google sign-in failed. Please try again.";
      setError(msg);
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isLogin && !pendingVerification && !isAdult) {
      setError("Confirm that you are 18 or older to create an account.");
      return;
    }
    setIsLoading(true);

    try {
      if (!clerk.loaded || !clerk.client) {
        throw new Error("Authentication service is loading. Please wait a moment.");
      }

      if (isLogin) {
        // Sign In Flow
        if (pendingVerification) {
          const completeSignIn = await clerk.client.signIn.attemptFirstFactor({
            strategy: "email_code",
            code: code.trim(),
          });
          if (completeSignIn.status === "complete" && completeSignIn.createdSessionId) {
            await finishAuthentication(completeSignIn.createdSessionId);
            return;
          } else {
            setError("Sign in incomplete. Please check your verification code.");
            setIsLoading(false);
            return;
          }
        }

        if (showPasswordField) {
          const completeSignIn = await clerk.client.signIn.attemptFirstFactor({
            strategy: "password",
            password,
          });
          if (completeSignIn.status === "complete" && completeSignIn.createdSessionId) {
            await finishAuthentication(completeSignIn.createdSessionId);
            return;
          } else {
            setError("Sign in incomplete. Please check your password.");
            setIsLoading(false);
            return;
          }
        }

        // Initial submission with identifier
        const signInAttempt = await clerk.client.signIn.create({
          identifier: email.trim(),
        });

        if (signInAttempt.status === "complete" && signInAttempt.createdSessionId) {
          await finishAuthentication(signInAttempt.createdSessionId);
          return;
        }

        const passwordFactor = signInAttempt.supportedFirstFactors?.find(
          (f: any) => f.strategy === "password"
        );
        if (passwordFactor) {
          setShowPasswordField(true);
          setIsLoading(false);
          return;
        }

        const emailCodeFactor = signInAttempt.supportedFirstFactors?.find(
          (f: any) => f.strategy === "email_code"
        );
        if (emailCodeFactor && "emailAddressId" in emailCodeFactor) {
          await clerk.client.signIn.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: (emailCodeFactor as any).emailAddressId,
          });
          setPendingVerification(true);
          setIsLoading(false);
          return;
        }

        // Fallback: prompt for password
        setShowPasswordField(true);
      } else {
        // Sign Up Flow
        if (pendingVerification) {
          const completeSignUp = await clerk.client.signUp.attemptEmailAddressVerification({
            code: code.trim(),
          });
          if (completeSignUp.status === "complete" && completeSignUp.createdSessionId) {
            await finishAuthentication(completeSignUp.createdSessionId);
            return;
          } else {
            setError("Verification incomplete. Please check your code.");
            setIsLoading(false);
            return;
          }
        }

        if (!showPasswordField) {
          setShowPasswordField(true);
          setIsLoading(false);
          return;
        }

        const [firstName, ...rest] = fullName.trim().split(" ");
        const lastName = rest.join(" ");

        const signUpAttempt = await clerk.client.signUp.create({
          emailAddress: email.trim(),
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          password,
        });

        if (signUpAttempt.status === "complete" && signUpAttempt.createdSessionId) {
          await finishAuthentication(signUpAttempt.createdSessionId);
          return;
        }

        await clerk.client.signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingVerification(true);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Authentication failed. Please verify your details or use Google login.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gl-auth-stage">
      {/* Background Lighting & Cinematic Atmosphere */}
      <div className="gl-auth-stage-backdrop" aria-hidden="true" />
      <div className="gl-auth-stage-grid" aria-hidden="true" />

      {/* Top Left Navigation Pill */}
      <Link href="/" className="gl-back-link" title="Return to Home">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Arena</span>
      </Link>

      {/* Glass Card Panel Wrap */}
      <div className="gl-panel-wrap">
        <section className="gl-panel">
          {/* Header */}
          <header className="gl-head">
            <div className="gl-logo-row">
              <Link href="/" aria-label={`${brandName} — home`} className="gl-logo">
                <div className="gl-logo-tile">
                  {logo || (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/images/mindflare_m_logo.svg"
                      alt={brandName}
                      className="gl-logo-img"
                    />
                  )}
                </div>
              </Link>
            </div>

            <h1 className="gl-title gl-title-gradient">
              <span>
                {pendingVerification
                  ? "Verify your email"
                  : isLogin
                  ? "Welcome back"
                  : "Create your account"}
              </span>
            </h1>

            <p className="gl-sub">
              {pendingVerification
                ? "Enter the verification code sent to your email."
                : isLogin
                ? "Sign in to your Mindflare account."
                : "Join the arena and test your competitive edge."}
            </p>
          </header>

          {/* Body */}
          <div className="gl-body">
            {/* Error Banner */}
            {error && (
              <div className="gl-error-banner" role="alert">
                {error}
              </div>
            )}

            {!pendingVerification && (
              <>
                {/* Google OAuth Action Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="gl-google-btn"
                  aria-busy={isLoading}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
                    />
                    <path
                      fill="#34A853"
                      d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-3.33Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="gl-divider" role="separator">
                  <span className="gl-divider-line gl-divider-line-left" />
                  <span>or with email</span>
                  <span className="gl-divider-line gl-divider-line-right" />
                </div>
              </>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="gl-form" noValidate>
              {pendingVerification ? (
                /* Verification Code View */
                <div className="gl-field">
                  <div className="gl-label-row">
                    <label htmlFor="auth-code" className="gl-label">
                      Verification code
                    </label>
                  </div>
                  <input
                    id="auth-code"
                    className="gl-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              ) : (
                /* Standard Credentials Fields */
                <>
                  {!isLogin && (
                    <div className="gl-field">
                      <div className="gl-label-row">
                        <label htmlFor="auth-name" className="gl-label">
                          Full name
                        </label>
                      </div>
                      <input
                        id="auth-name"
                        className="gl-input"
                        type="text"
                        placeholder="Ada Lovelace"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <div className="gl-field">
                    <div className="gl-label-row">
                      <label htmlFor="auth-email" className="gl-label">
                        Email address
                      </label>
                    </div>
                    <input
                      id="auth-email"
                      className="gl-input"
                      type="email"
                      inputMode="email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {showPasswordField && (
                    <div className="gl-field">
                      <div className="gl-label-row">
                        <label htmlFor="auth-password" className="gl-label">
                          Password
                        </label>
                        {isLogin && (
                          <Link href="/terms" className="gl-aside-link">
                            Forgot password?
                          </Link>
                        )}
                      </div>
                      <div className="gl-password-wrap">
                        <input
                          id="auth-password"
                          className="gl-input"
                          type={showPasswordText ? "text" : "password"}
                          placeholder={isLogin ? "Your password" : "Create a password"}
                          autoComplete={isLogin ? "current-password" : "new-password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoFocus
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          className="gl-password-toggle"
                          aria-label={showPasswordText ? "Hide password" : "Show password"}
                          onClick={() => setShowPasswordText(!showPasswordText)}
                          tabIndex={-1}
                        >
                          {showPasswordText ? (
                            /* Eye slashed */
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                              <path
                                d="M2 2l14 14M7.4 7.4a2.4 2.4 0 0 0 3.2 3.2M14.6 12.3C13.5 13.5 11.5 14.5 9 14.5 4 14.5 1.5 9 1.5 9a14.7 14.7 0 0 1 3.4-3.8M9 3.5c2.5 0 4.5 1 5.6 2.2 1.3 1.5 1.9 3.3 1.9 3.3a14.6 14.6 0 0 1-2.1 2.9"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            /* Eye open */
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                              <path
                                d="M1.5 9s2.5-5.5 7.5-5.5S16.5 9 16.5 9 14 14.5 9 14.5 1.5 9 1.5 9Z"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isLogin && (
                    <label className="gl-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isAdult}
                        onChange={(e) => setIsAdult(e.target.checked)}
                        required
                        disabled={isLoading}
                      />
                      <span>I confirm that I am 18 years of age or older.</span>
                    </label>
                  )}
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="gl-submit-btn"
                aria-busy={isLoading}
              >
                <span>
                  {isLoading
                    ? "Please wait..."
                    : pendingVerification
                    ? "Verify & Continue"
                    : isLogin
                    ? showPasswordField
                      ? "Sign in"
                      : "Continue"
                    : showPasswordField
                    ? "Create account"
                    : "Continue"}
                </span>
              </button>
            </form>

            {/* Toggle Login / Sign Up */}
            <p className="gl-foot">
              {isLogin ? (
                <>
                  New to {brandName}?{" "}
                  <button
                    type="button"
                    onClick={() => handleToggleMode("signup")}
                    className="gl-foot-link"
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleToggleMode("login")}
                    className="gl-foot-link"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>

            {/* Legal Notice */}
            <div className="gl-legal">
              By proceeding, you agree to our{" "}
              <Link href="/terms">Terms of Service</Link> and{" "}
              <Link href="/privacy">Privacy Policy</Link>.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export { ModernLoginSignup };
