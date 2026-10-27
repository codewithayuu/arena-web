export const MAIT_PROGRAMS = [
  "B.Tech — Computer Science and Engineering",
  "B.Tech — Computer Science and Engineering (Artificial Intelligence)",
  "B.Tech — Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
  "B.Tech — Computer Science and Engineering (Data Science)",
  "B.Tech — Computer Science and Technology",
  "B.Tech — Electronics and Communication Engineering",
  "B.Tech — Electronics and Communication (Advanced Communication Technology)",
  "B.Tech — Electronics Engineering (VLSI Design and Technology)",
  "B.Tech — Electrical and Electronics Engineering",
  "B.Tech — Information Technology",
  "B.Tech — Mechanical Engineering",
  "BBA",
  "MBA",
] as const;

export const STUDY_YEARS = [1, 2, 3, 4] as const;

export interface SignupProfileDraft {
  firstName: string;
  lastName: string;
  username: string;
  enrollmentNumber: string;
  institutionName: string;
  academicProgram: string;
  otherProgram: string;
  yearOfStudy: string;
  gender: string;
  mobileNumber: string;
}

export interface SignupProfileMetadata {
  firstName: string;
  lastName: string;
  username: string;
  enrollmentNumber: string;
  institutionName: string;
  academicProgram: string;
  yearOfStudy: number;
  gender: "male" | "female" | null;
  mobileNumber: string;
}

export interface SignupDetailsDraft {
  enrollmentNumber: string;
  institutionName: string;
  academicProgram: string;
  otherProgram: string;
  yearOfStudy: string;
  gender: string;
  mobileNumber: string;
}

export interface SignupProfileDetails {
  enrollmentNumber: string;
  institutionName: string;
  academicProgram: string;
  yearOfStudy: number;
  gender: "male" | "female" | null;
  mobileNumber: string;
}

export function normalizeInternationalMobile(value: string): string | null {
  const input = value.trim();
  if (!input || !/^\+[0-9().\-\s]+$/.test(input)) return null;
  const compact = input.replace(/[().\-\s]/g, "");
  return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : null;
}

export function signupDetailsValidationError(draft: SignupDetailsDraft): string | null {
  const selectedProgram = draft.academicProgram === "__other__" ? draft.otherProgram : draft.academicProgram;
  if (/[\u0000-\u001f\u007f]/.test(draft.enrollmentNumber) || /[\u0000-\u001f\u007f]/.test(draft.institutionName) || /[\u0000-\u001f\u007f]/.test(selectedProgram)) {
    return "Remove unsupported control characters from your details.";
  }
  if (!draft.enrollmentNumber.trim()) return "Enter your enrollment number.";
  if (draft.enrollmentNumber.trim().length > 80) return "Enrollment number must be 80 characters or fewer.";
  if (draft.institutionName.trim().length > 200) return "Institution name must be 200 characters or fewer.";
  const program = selectedProgram;
  if (!program.trim()) return "Choose or enter your branch/program.";
  if (program.trim().length > 120) return "Branch/program must be 120 characters or fewer.";
  if (!STUDY_YEARS.some((year) => String(year) === draft.yearOfStudy)) {
    return "Choose your current year of study.";
  }
  if (draft.gender && draft.gender !== "male" && draft.gender !== "female") {
    return "Choose Male, Female, or Prefer not to say.";
  }
  if (!normalizeInternationalMobile(draft.mobileNumber)) {
    return "Enter a valid mobile number with country code, such as +91 98765 43210.";
  }
  return null;
}

export function createSignupProfileDetails(draft: SignupDetailsDraft): SignupProfileDetails {
  const program = draft.academicProgram === "__other__" ? draft.otherProgram : draft.academicProgram;
  return {
    enrollmentNumber: draft.enrollmentNumber.trim(),
    institutionName: draft.institutionName.trim(),
    academicProgram: program.trim(),
    yearOfStudy: Number(draft.yearOfStudy),
    gender: draft.gender === "male" || draft.gender === "female" ? draft.gender : null,
    mobileNumber: normalizeInternationalMobile(draft.mobileNumber) ?? "",
  };
}

export function parseSignupProfileDetails(value: unknown): SignupProfileDetails | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const institutionCandidate = input.institutionName;
  const institutionName = typeof institutionCandidate === "string" ? institutionCandidate.trim() : "";
  const validationInput: SignupDetailsDraft = {
    enrollmentNumber: typeof input.enrollmentNumber === "string" ? input.enrollmentNumber : "",
    institutionName,
    academicProgram: typeof input.academicProgram === "string" ? input.academicProgram : "",
    otherProgram: "",
    yearOfStudy: typeof input.yearOfStudy === "number" ? String(input.yearOfStudy) : "",
    gender: input.gender === null ? "" : typeof input.gender === "string" ? input.gender : "",
    mobileNumber: typeof input.mobileNumber === "string" ? input.mobileNumber : "",
  };
  if (input.gender !== null && input.gender !== "male" && input.gender !== "female") return null;
  if (/[\u0000-\u001f\u007f]/.test(institutionName) || signupDetailsValidationError(validationInput)) return null;
  return createSignupProfileDetails(validationInput);
}

export function signupProfileValidationError(draft: SignupProfileDraft): string | null {
  if (!draft.firstName.trim()) return "Enter your first name.";
  if (draft.firstName.trim().length > 80) return "First name must be 80 characters or fewer.";
  if (!draft.lastName.trim()) return "Enter your last name.";
  if (draft.lastName.trim().length > 80) return "Last name must be 80 characters or fewer.";
  if (!draft.username.trim()) return "Choose a username.";
  if (draft.username.trim().length > 100) return "Username must be 100 characters or fewer.";
  return signupDetailsValidationError(draft);
}

export function createSignupProfileMetadata(draft: SignupProfileDraft): SignupProfileMetadata {
  return {
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
    username: draft.username.trim(),
    ...createSignupProfileDetails(draft),
  };
}

export function parseSignupProfileMetadata(value: unknown): SignupProfileMetadata | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const stringValue = (key: string, maxLength: number) => {
    const candidate = input[key];
    if (typeof candidate !== "string") return null;
    const cleaned = candidate.trim();
    if (!cleaned || cleaned.length > maxLength || /[\u0000-\u001f\u007f]/.test(cleaned)) return null;
    return cleaned;
  };

  const firstName = stringValue("firstName", 80);
  const lastName = stringValue("lastName", 80);
  const username = stringValue("username", 100);
  const enrollmentNumber = stringValue("enrollmentNumber", 80);
  const academicProgram = stringValue("academicProgram", 120);
  const details = parseSignupProfileDetails({
    enrollmentNumber,
    institutionName: input.institutionName,
    academicProgram,
    yearOfStudy: input.yearOfStudy,
    gender: input.gender,
    mobileNumber: input.mobileNumber,
  });
  if (!firstName || !lastName || !username || !details) return null;

  return {
    firstName,
    lastName,
    username,
    ...details,
  };
}
