"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  createSignupProfileDetails,
  MAIT_PROGRAMS,
  parseSignupProfileDetails,
  signupDetailsValidationError,
  type SignupDetailsDraft,
} from "@/lib/signup-profile";

const EMPTY_DETAILS: SignupDetailsDraft = {
  enrollmentNumber: "",
  institutionName: "",
  academicProgram: "",
  otherProgram: "",
  yearOfStudy: "",
  gender: "",
  mobileNumber: "",
};

export function StudentDetailsSettings() {
  const [details, setDetails] = useState<SignupDetailsDraft>(EMPTY_DETAILS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch("/api/profile/account-details", { cache: "no-store", headers: { accept: "application/json" } })
      .then(async (response) => {
        if (!response.ok) throw new Error("load failed");
        const payload = await response.json() as { details?: unknown };
        const current = payload.details as Record<string, unknown> | undefined;
        if (!current || !active) return;
        const program = typeof current.academicProgram === "string" ? current.academicProgram : "";
        setDetails({
          enrollmentNumber: typeof current.enrollmentNumber === "string" ? current.enrollmentNumber : "",
          institutionName: typeof current.institutionName === "string" ? current.institutionName : "",
          academicProgram: MAIT_PROGRAMS.includes(program as (typeof MAIT_PROGRAMS)[number]) ? program : program ? "__other__" : "",
          otherProgram: MAIT_PROGRAMS.includes(program as (typeof MAIT_PROGRAMS)[number]) ? "" : program,
          yearOfStudy: typeof current.yearOfStudy === "number" ? String(current.yearOfStudy) : "",
          gender: current.gender === "male" || current.gender === "female" ? current.gender : "",
          mobileNumber: typeof current.mobileNumber === "string" ? current.mobileNumber : "",
        });
      })
      .catch(() => {
        if (active) setError("We could not load your student details. Please close this panel and try again.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const setField = <K extends keyof SignupDetailsDraft>(key: K, value: SignupDetailsDraft[K]) => {
    setDetails((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setError(null);
  };

  const saveDetails = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = signupDetailsValidationError(details);
    if (validationError) {
      setError(validationError);
      setSaved(false);
      return;
    }

    setError(null);
    setSaved(false);
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile/account-details", {
        method: "PATCH",
        headers: { accept: "application/json", "content-type": "application/json" },
        body: JSON.stringify(createSignupProfileDetails(details)),
      });
      if (!response.ok) throw new Error("save failed");
      setSaved(true);
    } catch {
      setError("Your details were not saved. Please check your connection and retry.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className="mf-account-details-status" role="status">Loading your private details…</p>;

  return (
    <div className="mf-account-details">
      <div className="mf-account-details-heading">
        <h2>Student details</h2>
        <p>Update the academic and contact details you provided during signup.</p>
      </div>

      <form onSubmit={saveDetails} noValidate>
        <div className="mf-account-details-grid">
          <label className="mf-account-details-field">
            <span>Enrollment number</span>
            <input autoComplete="off" maxLength={80} value={details.enrollmentNumber} onChange={(event) => setField("enrollmentNumber", event.target.value)} required disabled={isSaving} />
          </label>
          <label className="mf-account-details-field">
            <span>Institution <small>Optional</small></span>
            <input autoComplete="organization" maxLength={200} placeholder="Maharaja Agrasen Institute of Technology" value={details.institutionName} onChange={(event) => setField("institutionName", event.target.value)} disabled={isSaving} />
          </label>
          <label className="mf-account-details-field">
            <span>Branch / program</span>
            <select value={details.academicProgram} onChange={(event) => setField("academicProgram", event.target.value)} required disabled={isSaving}>
              <option value="">Select a branch or program</option>
              {MAIT_PROGRAMS.map((program) => <option key={program} value={program}>{program}</option>)}
              <option value="__other__">Other / not listed</option>
            </select>
          </label>
          {details.academicProgram === "__other__" && (
            <label className="mf-account-details-field">
              <span>Enter your branch / program</span>
              <input maxLength={120} value={details.otherProgram} onChange={(event) => setField("otherProgram", event.target.value)} required disabled={isSaving} />
            </label>
          )}
          <label className="mf-account-details-field">
            <span>Current year of study</span>
            <select value={details.yearOfStudy} onChange={(event) => setField("yearOfStudy", event.target.value)} required disabled={isSaving}>
              <option value="">Select year</option>
              {[1, 2, 3, 4, 5, 6].map((year) => <option key={year} value={year}>{year}{year === 1 ? "st" : year === 2 ? "nd" : year === 3 ? "rd" : "th"} year</option>)}
            </select>
          </label>
          <label className="mf-account-details-field">
            <span>Mobile number <small>Include country code</small></span>
            <input type="tel" inputMode="tel" autoComplete="tel" maxLength={32} placeholder="+91 98765 43210" value={details.mobileNumber} onChange={(event) => setField("mobileNumber", event.target.value)} required disabled={isSaving} />
          </label>
          <label className="mf-account-details-field">
            <span>Gender <small>Optional</small></span>
            <select value={details.gender} onChange={(event) => setField("gender", event.target.value)} disabled={isSaving}>
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </label>
        </div>

        <p className="mf-account-details-note">These details are private to your account. Enrollment and mobile numbers are self-reported; SMS verification is not enabled.</p>
        {error && <p className="mf-account-details-error" role="alert">{error}</p>}
        {saved && <p className="mf-account-details-success" role="status">Student details saved.</p>}
        <button className="mf-account-details-save" type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save student details"}
        </button>
      </form>
    </div>
  );
}
