"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { buildAuthModeHref, safePostAuthUrl } from "@/lib/auth-redirect";
import {
  createSignupProfileMetadata,
  MAIT_PROGRAMS,
  signupProfileValidationError,
  type SignupProfileDraft,
} from "@/lib/signup-profile";

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

function getSsoRedirectOptions() {
  const redirectUrl = getPostAuthUrl();
  const callbackUrl = new URL("/sso-callback", window.location.origin);
  callbackUrl.searchParams.set("redirect_url", redirectUrl);

  return {
    redirectUrl,
    redirectCallbackUrl: `${callbackUrl.pathname}${callbackUrl.search}`,
  };
}

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") return fallback;

  const candidate = error as {
    errors?: Array<{ longMessage?: string; message?: string }>;
    longMessage?: string;
    message?: string;
  };

  return (
    candidate.errors?.[0]?.longMessage ||
    candidate.errors?.[0]?.message ||
    candidate.longMessage ||
    candidate.message ||
    fallback
  );
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
  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpFetchStatus } = useSignUp();
  const [isLogin, setIsLogin] = useState(initialMode === "login");

  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [academicProgram, setAcademicProgram] = useState("");
  const [otherProgram, setOtherProgram] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSyncPending, setSignupSyncPending] = useState(false);
  const [postAuthTarget, setPostAuthTarget] = useState("/");
  const isAuthPending =
    isLoading || signInFetchStatus === "fetching" || signUpFetchStatus === "fetching";
  const signUpGlobalError = signUpErrors.global
    ?.map((item) => item.longMessage || item.message)
    .filter(Boolean)
    .join(" ");
  const visibleError = error || (!isLogin ? signUpGlobalError : null);
  const needsUsername =
    !isLogin &&
    signUp.status === "missing_requirements" &&
    signUp.missingFields.includes("username");
  const signupDraft: SignupProfileDraft = {
    firstName,
    lastName,
    username,
    enrollmentNumber,
    institutionName,
    academicProgram,
    otherProgram,
    yearOfStudy,
    gender,
    mobileNumber,
  };

  const resetSignupFields = React.useCallback(() => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setEnrollmentNumber("");
    setInstitutionName("");
    setAcademicProgram("");
    setOtherProgram("");
    setYearOfStudy("");
    setGender("");
    setMobileNumber("");
  }, []);

  useEffect(() => {
    setIsLogin(initialMode === "login");
    setError(null);
    setShowPasswordField(false);
    setShowPasswordText(false);
    setPendingVerification(false);
    setIsAdult(false);
    setEmail("");
    setPassword("");
    resetSignupFields();
  }, [initialMode, resetSignupFields]);

  useEffect(() => {
    if (isLogin || firstName || lastName || username || enrollmentNumber || mobileNumber) return;
    const metadata = signUp.unsafeMetadata as { mindflareSignupProfile?: unknown } | undefined;
    const profile = metadata?.mindflareSignupProfile;
    if (!profile || typeof profile !== "object" || Array.isArray(profile)) return;
    const values = profile as Record<string, unknown>;
    const text = (key: string) => typeof values[key] === "string" ? values[key] as string : "";
    const program = text("academicProgram");

    setFirstName(text("firstName"));
    setLastName(text("lastName"));
    setUsername(text("username"));
    setEnrollmentNumber(text("enrollmentNumber"));
    setInstitutionName(text("institutionName"));
    setAcademicProgram(MAIT_PROGRAMS.includes(program as (typeof MAIT_PROGRAMS)[number]) ? program : program ? "__other__" : "");
    setOtherProgram(MAIT_PROGRAMS.includes(program as (typeof MAIT_PROGRAMS)[number]) ? "" : program);
    setYearOfStudy(typeof values.yearOfStudy === "number" ? String(values.yearOfStudy) : "");
    setGender(values.gender === "male" || values.gender === "female" ? values.gender : "");
    setMobileNumber(text("mobileNumber"));
  }, [academicProgram, enrollmentNumber, firstName, isLogin, lastName, mobileNumber, signUp.unsafeMetadata, username]);

  const handleToggleMode = (mode: "login" | "signup") => {
    setError(null);
    setShowPasswordField(false);
    setShowPasswordText(false);
    setPendingVerification(false);
    setIsAdult(false);
    resetSignupFields();
    setEmail("");
    setPassword("");
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

  const navigateAfterAuth = (target: string) => {
    setSignupSyncPending(false);
    onSuccess?.();
    if (target.startsWith("http")) {
      window.location.href = target;
      return;
    }
    router.replace(target);
    router.refresh();
  };

  const finishSignUp = async () => {
    let target = getPostAuthUrl();
    const { error: finalizeError } = await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        target = decorateUrl(getPostAuthUrl());
      },
    });
    if (finalizeError) throw finalizeError;

    setPostAuthTarget(target);
    try {
      const response = await fetch("/api/profile/signup", {
        method: "POST",
        headers: { accept: "application/json" },
      });
      if (response.ok) {
        navigateAfterAuth(target);
        return;
      }
    } catch {
      // Account creation already completed. Preserve the session and expose a
      // retry path if the network cannot reach the profile sync endpoint.
    }

    setSignupSyncPending(true);
    setError("Your account was created, but we could not confirm the profile save. Retry the sync or continue while the webhook retries it.");
  };

  const retrySignupProfileSync = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile/signup", {
        method: "POST",
        headers: { accept: "application/json" },
      });
      if (!response.ok) {
        setError("The profile save is still pending. Please retry in a moment.");
        return;
      }
      navigateAfterAuth(postAuthTarget);
    } catch {
      setError("The profile save is still pending. Please retry in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    let signupProfile: ReturnType<typeof createSignupProfileMetadata> | null = null;
    if (!isLogin) {
      const validationError = signupProfileValidationError(signupDraft);
      if (validationError) {
        setError(validationError);
        return;
      }
      if (!isAdult) {
        setError("Confirm that you are 18 or older to create an account.");
        return;
      }
      signupProfile = createSignupProfileMetadata(signupDraft);
    }
    setIsLoading(true);
    try {
      if (!clerk.loaded) {
        throw new Error("Authentication service is loading. Please wait a moment.");
      }

      const redirectOptions = getSsoRedirectOptions();
      if (isLogin) {
        const { error: ssoError } = await signIn.sso({
          strategy: "oauth_google",
          ...redirectOptions,
        });
        if (ssoError) throw ssoError;
      } else {
        const { error: ssoError } = await signUp.sso({
          strategy: "oauth_google",
          firstName: signupProfile?.firstName,
          lastName: signupProfile?.lastName,
          unsafeMetadata: signupProfile ? { mindflareSignupProfile: signupProfile } : undefined,
          ...redirectOptions,
        });
        if (ssoError) throw ssoError;
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err, "Google sign-in failed. Please try again."));
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isLogin && !pendingVerification) {
      const validationError = signupProfileValidationError(signupDraft);
      if (validationError) {
        setError(validationError);
        return;
      }
      if (!isAdult) {
        setError("Confirm that you are 18 or older to create an account.");
        return;
      }
      if (!needsUsername && !email.trim()) {
        setError("Enter your email address to continue with email, or choose Google below.");
        return;
      }
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
          const { error: verificationError } = await signUp.verifications.verifyEmailCode({
            code: code.trim(),
          });
          if (verificationError) throw verificationError;

          if (signUp.status === "complete") {
            await finishSignUp();
            return;
          }

          if (signUp.missingFields?.includes("protect_check")) {
            setError("Complete the security check to continue. If it did not appear, refresh and try again.");
          } else {
            setError("Verification incomplete. Please check your code.");
          }
          return;
        }

        if (needsUsername) {
          const validationError = signupProfileValidationError(signupDraft);
          if (validationError) {
            setError(validationError);
            return;
          }
          if (!isAdult) {
            setError("Confirm that you are 18 or older to create an account.");
            return;
          }

          const normalizedUsername = username.trim();
          if (!normalizedUsername) {
            setError("Choose a username to finish creating your account.");
            return;
          }

          const { error: updateError } = await signUp.update({
            username: normalizedUsername,
            unsafeMetadata: { mindflareSignupProfile: createSignupProfileMetadata(signupDraft) },
          });
          if (updateError) throw updateError;

          const updatedSignUpStatus: string = signUp.status;
          if (updatedSignUpStatus === "complete") {
            await finishSignUp();
            return;
          }

          if (signUp.missingFields?.includes("protect_check")) {
            setError("Complete the security check to continue. If it did not appear, refresh and try again.");
          } else if (signUp.missingFields?.includes("username")) {
            setError("That username could not be accepted. Please choose another.");
          } else {
            setError("Your account needs additional information before it can be created.");
          }
          return;
        }

        if (!showPasswordField) {
          setShowPasswordField(true);
          setIsLoading(false);
          return;
        }

        const signupProfile = createSignupProfileMetadata(signupDraft);

        const { error: passwordError } = await signUp.password({
          emailAddress: email.trim(),
          password,
          username: signupProfile.username,
          firstName: signupProfile.firstName,
          lastName: signupProfile.lastName,
          unsafeMetadata: { mindflareSignupProfile: signupProfile },
        });
        if (passwordError) throw passwordError;

        if (signUp.status === "complete") {
          await finishSignUp();
          return;
        }

        const { error: emailCodeError } = await signUp.verifications.sendEmailCode();
        if (emailCodeError) throw emailCodeError;

        if (
          signUp.status === "missing_requirements" &&
          signUp.unverifiedFields.includes("email_address") &&
          signUp.missingFields.length === 0
        ) {
          setPendingVerification(true);
          return;
        }

        if (signUp.missingFields?.includes("protect_check")) {
          setError("Complete the security check to continue. If it did not appear, refresh and try again.");
        } else {
          setError("Your account needs additional information before it can be created.");
        }
      }
    } catch (err: any) {
      setError(
        getAuthErrorMessage(
          err,
          "Authentication failed. Please verify your details or use Google login.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const googleAuthOption = (
    <>
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={isAuthPending}
        className="gl-google-btn"
        aria-busy={isAuthPending}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
          <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-3.33Z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
        </svg>
        <span>Continue with Google</span>
      </button>
      <div className="gl-divider" role="separator">
        <span className="gl-divider-line gl-divider-line-left" />
        <span>or with email</span>
        <span className="gl-divider-line gl-divider-line-right" />
      </div>
    </>
  );

  return (
    <div className={`gl-auth-stage${!isLogin ? " gl-auth-stage-signup" : ""}`}>
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
      <div className={`gl-panel-wrap${!isLogin ? " gl-panel-wrap-signup" : ""}`}>
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
                {signupSyncPending
                  ? "Save your profile"
                  : pendingVerification
                  ? "Verify your email"
                  : needsUsername
                  ? "Finish your account"
                  : isLogin
                  ? "Welcome back"
                  : "Create your account"}
              </span>
            </h1>

            <p className="gl-sub">
              {signupSyncPending
                ? "Your account is ready; we are confirming your profile details."
                : pendingVerification
                ? "Enter the verification code sent to your email."
                : needsUsername
                ? "Choose a username to finish creating your account."
                : isLogin
                ? "Sign in to your Mindflare account."
                : "Join the arena and test your competitive edge."}
            </p>
          </header>

          {/* Body */}
          <div className="gl-body">
            {/* Error Banner */}
            {visibleError && (
              <div className="gl-error-banner" role="alert">
                {visibleError}
              </div>
            )}

            {signupSyncPending && (
              <div className="gl-signup-sync-status" role="status">
                <p>Your account is active. The signup webhook also retries this save in the background.</p>
                <button type="button" className="gl-submit-btn" onClick={retrySignupProfileSync} disabled={isAuthPending} aria-busy={isAuthPending}>
                  {isAuthPending ? "Retrying profile save…" : "Retry profile save"}
                </button>
                <button type="button" className="gl-foot-link" onClick={() => navigateAfterAuth(postAuthTarget)}>
                  Continue to Mindflare
                </button>
              </div>
            )}

            {!signupSyncPending && isLogin && !pendingVerification && googleAuthOption}

            {/* Email Form */}
            {!signupSyncPending && <form onSubmit={handleEmailSubmit} className="gl-form" noValidate>
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
                    disabled={isAuthPending}
                  />
                </div>
              ) : isLogin ? (
                <>
                  <div className="gl-field">
                    <div className="gl-label-row">
                      <label htmlFor="auth-email" className="gl-label">Email address</label>
                    </div>
                    <input
                      id="auth-email"
                      className="gl-input"
                      type="email"
                      inputMode="email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      disabled={isAuthPending}
                    />
                  </div>
                  {showPasswordField && (
                    <div className="gl-field">
                      <div className="gl-label-row">
                        <label htmlFor="auth-password" className="gl-label">Password</label>
                        <Link href="/terms" className="gl-aside-link">Forgot password?</Link>
                      </div>
                      <div className="gl-password-wrap">
                        <input
                          id="auth-password"
                          className="gl-input"
                          type={showPasswordText ? "text" : "password"}
                          placeholder="Your password"
                          autoComplete="current-password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          required
                          autoFocus
                          disabled={isAuthPending}
                        />
                        <button
                          type="button"
                          className="gl-password-toggle"
                          aria-label={showPasswordText ? "Hide password" : "Show password"}
                          onClick={() => setShowPasswordText(!showPasswordText)}
                          tabIndex={-1}
                        >
                          {showPasswordText ? (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                              <path d="M2 2l14 14M7.4 7.4a2.4 2.4 0 0 0 3.2 3.2M14.6 12.3C13.5 13.5 11.5 14.5 9 14.5 4 14.5 1.5 9 1.5 9a14.7 14.7 0 0 1 3.4-3.8M9 3.5c2.5 0 4.5 1 5.6 2.2 1.3 1.5 1.9 3.3 1.9 3.3a14.6 14.6 0 0 1-2.1 2.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                              <path d="M1.5 9s2.5-5.5 7.5-5.5S16.5 9 16.5 9 14 14.5 9 14.5 1.5 9 1.5 9Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              <circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <section className="gl-signup-section" aria-labelledby="signup-profile-heading">
                    <h2 id="signup-profile-heading" className="gl-signup-heading">Profile information</h2>
                    <div className="gl-signup-grid">
                      <div className="gl-field">
                        <label htmlFor="auth-first-name" className="gl-label">First name</label>
                        <input id="auth-first-name" className="gl-input" type="text" autoComplete="given-name" maxLength={80} value={firstName} onChange={(event) => setFirstName(event.target.value)} required disabled={isAuthPending} />
                      </div>
                      <div className="gl-field">
                        <label htmlFor="auth-last-name" className="gl-label">Last name</label>
                        <input id="auth-last-name" className="gl-input" type="text" autoComplete="family-name" maxLength={80} value={lastName} onChange={(event) => setLastName(event.target.value)} required disabled={isAuthPending} />
                      </div>
                      <div className="gl-field">
                        <label htmlFor="auth-username" className="gl-label">Username</label>
                        <input id="auth-username" className="gl-input" type="text" autoComplete="username" maxLength={100} placeholder="Choose a username" value={username} onChange={(event) => setUsername(event.target.value)} required disabled={isAuthPending} />
                      </div>
                      <div className="gl-field">
                        <label htmlFor="auth-mobile" className="gl-label">Mobile number (with country code)</label>
                        <input id="auth-mobile" className="gl-input" type="tel" autoComplete="tel" inputMode="tel" maxLength={32} placeholder="+91 98765 43210" value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value)} required disabled={isAuthPending} aria-describedby="auth-mobile-note" />
                        <p id="auth-mobile-note" className="gl-field-hint">Saved as contact information; SMS verification is not enabled.</p>
                      </div>
                      <div className="gl-field">
                        <label htmlFor="auth-enrollment" className="gl-label">Enrollment number</label>
                        <input id="auth-enrollment" className="gl-input" type="text" autoComplete="off" maxLength={80} value={enrollmentNumber} onChange={(event) => setEnrollmentNumber(event.target.value)} required disabled={isAuthPending} />
                      </div>
                      <div className="gl-field">
                        <label htmlFor="auth-institution" className="gl-label">Institution <span className="gl-optional">optional</span></label>
                        <input id="auth-institution" className="gl-input" type="text" autoComplete="organization" maxLength={200} placeholder="Maharaja Agrasen Institute of Technology" value={institutionName} onChange={(event) => setInstitutionName(event.target.value)} disabled={isAuthPending} />
                      </div>
                      <div className="gl-field">
                        <label htmlFor="auth-program" className="gl-label">Branch / program</label>
                        <select id="auth-program" className="gl-input" value={academicProgram} onChange={(event) => setAcademicProgram(event.target.value)} required disabled={isAuthPending}>
                          <option value="">Select a branch or program</option>
                          {MAIT_PROGRAMS.map((program) => <option key={program} value={program}>{program}</option>)}
                          <option value="__other__">Other / not listed</option>
                        </select>
                      </div>
                      <div className="gl-field">
                        <label htmlFor="auth-year" className="gl-label">Current year of study</label>
                        <select id="auth-year" className="gl-input" value={yearOfStudy} onChange={(event) => setYearOfStudy(event.target.value)} required disabled={isAuthPending}>
                          <option value="">Select year</option>
                          {[1, 2, 3, 4, 5, 6].map((year) => <option key={year} value={year}>{year}{year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th"} year</option>)}
                        </select>
                      </div>
                      {academicProgram === "__other__" && (
                        <div className="gl-field">
                          <label htmlFor="auth-other-program" className="gl-label">Enter your branch / program</label>
                          <input id="auth-other-program" className="gl-input" type="text" maxLength={120} value={otherProgram} onChange={(event) => setOtherProgram(event.target.value)} required disabled={isAuthPending} />
                        </div>
                      )}
                      <div className="gl-field">
                        <label htmlFor="auth-gender" className="gl-label">Gender <span className="gl-optional">optional</span></label>
                        <select id="auth-gender" className="gl-input" value={gender} onChange={(event) => setGender(event.target.value)} disabled={isAuthPending}>
                          <option value="">Prefer not to say</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                        </select>
                      </div>
                    </div>
                    <p className="gl-signup-note">Program and contact details are stored on your Mindflare profile. Gender is optional. Enrollment number, institution/program, year of study, mobile number, and gender are not shown on public profiles.</p>
                  </section>

                  {!needsUsername && (
                    <section className="gl-signup-section" aria-labelledby="signup-account-heading">
                      <h2 id="signup-account-heading" className="gl-signup-heading">Account access</h2>
                      <div className="gl-field">
                        <label htmlFor="auth-email" className="gl-label">Email address</label>
                        <input id="auth-email" className="gl-input" type="email" inputMode="email" placeholder="you@email.com" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isAuthPending} />
                      </div>
                      {showPasswordField && (
                        <div className="gl-field">
                          <div className="gl-label-row">
                            <label htmlFor="auth-password" className="gl-label">Create a password</label>
                          </div>
                          <div className="gl-password-wrap">
                            <input id="auth-password" className="gl-input" type={showPasswordText ? "text" : "password"} placeholder="Create a password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus disabled={isAuthPending} />
                            <button type="button" className="gl-password-toggle" aria-label={showPasswordText ? "Hide password" : "Show password"} onClick={() => setShowPasswordText(!showPasswordText)} tabIndex={-1}>
                              {showPasswordText ? (
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 2l14 14M7.4 7.4a2.4 2.4 0 0 0 3.2 3.2M14.6 12.3C13.5 13.5 11.5 14.5 9 14.5 4 14.5 1.5 9 1.5 9a14.7 14.7 0 0 1 3.4-3.8M9 3.5c2.5 0 4.5 1 5.6 2.2 1.3 1.5 1.9 3.3 1.9 3.3a14.6 14.6 0 0 1-2.1 2.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              ) : (
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M1.5 9s2.5-5.5 7.5-5.5S16.5 9 16.5 9 14 14.5 9 14.5 1.5 9 1.5 9Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4" /></svg>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  <label className="gl-checkbox-row">
                    <input type="checkbox" checked={isAdult} onChange={(event) => setIsAdult(event.target.checked)} required disabled={isAuthPending} />
                    <span>I confirm that I am 18 years of age or older.</span>
                  </label>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthPending}
                className="gl-submit-btn"
                aria-busy={isAuthPending}
              >
                <span>
                  {isAuthPending
                    ? "Please wait..."
                    : pendingVerification
                    ? "Verify & Continue"
                    : needsUsername
                    ? "Finish account"
                    : isLogin
                    ? showPasswordField
                      ? "Sign in"
                      : "Continue"
                    : showPasswordField
                    ? "Create account"
                    : "Continue with email"}
                </span>
              </button>
            </form>}

            {!signupSyncPending && !isLogin && !pendingVerification && !needsUsername && (
              <div className="gl-signup-google-option">
                <p>Prefer Google? Your profile details above are included with signup.</p>
                {googleAuthOption}
              </div>
            )}

            {/* Toggle Login / Sign Up */}
            {!signupSyncPending && !needsUsername && (
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
            )}

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
