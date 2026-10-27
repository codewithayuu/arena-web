import { afterEach, expect, mock, test } from "bun:test";

mock.module("server-only", () => ({}));
const { ensureClerkProfileData } = await import("@/lib/clerk-profile.server");

const originalFetch = globalThis.fetch;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalSupabaseUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = originalSupabaseUrl;
  if (originalServiceRoleKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  else process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceRoleKey;
  mock.restore();
});

test("provisions only missing Clerk-linked profile and details rows", async () => {
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-service-key";
  const requests = [];
  let profileReadCount = 0;
  let detailsReadCount = 0;
  const profile = { id: "11111111-1111-8111-8111-111111111111", handle: "user_0123456789abcdef01234567", display_name: "Asha Das" };
  const details = {
    first_name: "Asha",
    second_name: "Das",
    bio: "",
    country: "",
    college: "",
    degree: "",
    branch: "",
    image_url: "https://images.example/asha.png",
    year_of_graduation: 0,
    job_preference: 0,
  };

  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : null;
    requests.push({ url, method: init?.method ?? "GET", body });
    if (url.pathname.endsWith("/profiles") && init?.method === "GET") {
      profileReadCount += 1;
      return Response.json(profileReadCount === 1 ? [] : [profile]);
    }
    if (url.pathname.endsWith("/profile_details") && init?.method === "GET") {
      detailsReadCount += 1;
      return Response.json(detailsReadCount === 1 ? [] : [details]);
    }
    if (init?.method === "POST") return new Response(null, { status: 201 });
    return new Response("unexpected request", { status: 500 });
  };

  const result = await ensureClerkProfileData({
    id: "user_synthetic-profile-1",
    firstName: "Asha",
    lastName: "Das",
    imageUrl: "https://images.example/asha.png",
  });

  expect(result).toEqual({ profile, details });
  const profileInsert = requests.find((request) => request.url.pathname.endsWith("/profiles") && request.method === "POST");
  const detailsInsert = requests.find((request) => request.url.pathname.endsWith("/profile_details") && request.method === "POST");
  expect(profileInsert?.body).toMatchObject({ clerk_user_id: "user_synthetic-profile-1", display_name: "Asha Das" });
  expect(detailsInsert?.body).toMatchObject({ profile_id: profile.id, first_name: "Asha", second_name: "Das", image_url: "https://images.example/asha.png" });
  expect(profileInsert?.url.searchParams.get("on_conflict")).toBe("clerk_user_id");
  expect(detailsInsert?.url.searchParams.get("on_conflict")).toBe("profile_id");
  expect(profileInsert?.body).not.toHaveProperty("password");
});

test("preserves existing profile details instead of overwriting them from Clerk", async () => {
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-service-key";
  const profile = { id: "22222222-2222-8222-8222-222222222222", handle: "member_public_handle", display_name: "Asha Das" };
  const details = {
    first_name: "Asha",
    second_name: "Das",
    bio: "A user-entered profile bio",
    country: "India",
    college: "Mindflare University",
    degree: "BSc",
    branch: "Computer Science",
    image_url: "https://images.example/custom.png",
    year_of_graduation: 2027,
    job_preference: 2,
  };
  const writes = [];

  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    if (init?.method === "POST") writes.push(url.pathname);
    if (url.pathname.endsWith("/profiles")) return Response.json([profile]);
    if (url.pathname.endsWith("/profile_details")) return Response.json([details]);
    return new Response("unexpected request", { status: 500 });
  };

  const result = await ensureClerkProfileData({
    id: "user_synthetic-profile-2",
    firstName: "Asha",
    lastName: "Different",
    imageUrl: "https://images.example/new-clerk-avatar.png",
  });

  expect(result.profile).toEqual(profile);
  expect(result.details).toEqual(details);
  expect(writes).toEqual([]);
});

test("links an unassigned legacy Supabase profile UUID without creating a duplicate profile", async () => {
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-service-key";
  const profileId = "33333333-3333-8333-8333-333333333333";
  const clerkId = "user_synthetic-profile-3";
  const profile = {
    id: profileId,
    handle: "member_legacy_handle",
    display_name: "Asha Das",
    clerk_user_id: clerkId,
  };
  const details = {
    first_name: "Asha", second_name: "Das", bio: "", country: "", college: "",
    degree: "", branch: "", image_url: "", year_of_graduation: 0, job_preference: 0,
  };
  const requests = [];
  let linked = false;

  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : null;
    requests.push({ url, method: init?.method ?? "GET", body });
    if (url.pathname.endsWith("/profiles") && init?.method === "GET") {
      if (url.searchParams.has("clerk_user_id")) return Response.json(linked ? [profile] : []);
      if (url.searchParams.has("id")) return Response.json([{ ...profile, clerk_user_id: null }]);
    }
    if (url.pathname.endsWith("/profiles") && init?.method === "PATCH") {
      linked = body?.clerk_user_id === clerkId;
      return new Response(null, { status: 204 });
    }
    if (url.pathname.endsWith("/profile_details")) return Response.json([details]);
    return new Response("unexpected request", { status: 500 });
  };

  const result = await ensureClerkProfileData({
    id: clerkId,
    externalId: profileId,
    firstName: "Asha",
    lastName: "Das",
  });

  expect(result).toEqual({ profile, details });
  const link = requests.find((request) => request.url.pathname.endsWith("/profiles") && request.method === "PATCH");
  expect(link?.url.searchParams.get("clerk_user_id")).toBe("is.null");
  expect(link?.body).toEqual({ clerk_user_id: clerkId });
  expect(requests.filter((request) => request.url.pathname.endsWith("/profiles") && request.method === "POST")).toHaveLength(0);
});

test("provisions new profile using Clerk username as public handle", async () => {
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-service-key";
  const requests = [];
  let profileReadCount = 0;
  const profile = { id: "44444444-4444-8444-8444-444444444444", handle: "greatayush1", display_name: "Ayush Jha" };
  const details = {
    first_name: "Ayush", second_name: "Jha", bio: "", country: "", college: "",
    degree: "", branch: "", image_url: "", year_of_graduation: 0, job_preference: 0,
  };

  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : null;
    requests.push({ url, method: init?.method ?? "GET", body });
    if (url.pathname.endsWith("/profiles") && init?.method === "GET") {
      profileReadCount += 1;
      return Response.json(profileReadCount === 1 ? [] : [profile]);
    }
    if (url.pathname.endsWith("/profile_details") && init?.method === "GET") {
      return Response.json([details]);
    }
    if (init?.method === "POST") return new Response(null, { status: 201 });
    return new Response("unexpected request", { status: 500 });
  };

  const result = await ensureClerkProfileData({
    id: "user_ayush-clerk-1",
    firstName: "Ayush",
    lastName: "Jha",
    username: "greatayush1",
  });

  expect(result.profile.handle).toBe("greatayush1");
  const profileInsert = requests.find((request) => request.url.pathname.endsWith("/profiles") && request.method === "POST");
  expect(profileInsert?.body).toMatchObject({
    clerk_user_id: "user_ayush-clerk-1",
    handle: "greatayush1",
    display_name: "Ayush Jha",
  });
});

test("automatically upgrades synthetic user_hash handle to Clerk username for existing user", async () => {
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-service-key";
  const requests = [];
  const existingProfile = { id: "55555555-5555-8555-8555-555555555555", handle: "user_fc372e45c851408f97689f35", display_name: "Ayush Jha" };
  const details = {
    first_name: "Ayush", second_name: "Jha", bio: "", country: "", college: "",
    degree: "", branch: "", image_url: "", year_of_graduation: 0, job_preference: 0,
  };

  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : null;
    requests.push({ url, method: init?.method ?? "GET", body });
    if (url.pathname.endsWith("/profiles") && init?.method === "GET") {
      return Response.json([existingProfile]);
    }
    if (url.pathname.endsWith("/profile_details") && init?.method === "GET") {
      return Response.json([details]);
    }
    if (url.pathname.endsWith("/profiles") && init?.method === "PATCH") {
      return new Response(null, { status: 204 });
    }
    return new Response("unexpected request", { status: 500 });
  };

  const result = await ensureClerkProfileData({
    id: "user_ayush-clerk-2",
    firstName: "Ayush",
    lastName: "Jha",
    username: "greatayush1",
  });

  expect(result.profile.handle).toBe("greatayush1");
  const handlePatch = requests.find((request) => request.url.pathname.endsWith("/profiles") && request.method === "PATCH");
  expect(handlePatch?.body).toEqual({ handle: "greatayush1" });
});

test("falls back college and branch to institution_name and academic_program when unset", async () => {
  process.env.SUPABASE_URL = "https://supabase.example";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-only-service-key";
  const existingProfile = { id: "66666666-6666-8666-8666-666666666666", handle: "greatayush1", display_name: "Ayush Jha" };
  const details = {
    first_name: "Ayush", second_name: "Jha", bio: "", country: "", college: "",
    degree: "", branch: "", image_url: "", year_of_graduation: 0, job_preference: 0,
    institution_name: "Maharaja Agrasen Institute of Technology",
    academic_program: "B.Tech — Information Technology",
    year_of_study: 2,
  };

  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("/profiles") && init?.method === "GET") {
      return Response.json([existingProfile]);
    }
    if (url.pathname.endsWith("/profile_details") && init?.method === "GET") {
      return Response.json([details]);
    }
    return new Response("unexpected request", { status: 500 });
  };

  const result = await ensureClerkProfileData({
    id: "user_ayush-clerk-3",
    firstName: "Ayush",
    lastName: "Jha",
    username: "greatayush1",
  });

  expect(result.details.college).toBe("Maharaja Agrasen Institute of Technology");
  expect(result.details.branch).toBe("B.Tech — Information Technology");
});

