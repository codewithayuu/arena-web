"use client";

import React, { useEffect, useState } from "react";
import { UserProfileData } from "@/lib/profile-data";
import SmoothButton from "@/components/smoothui/smooth-button";
import { GraduationCap, MapPin, Image } from "lucide-react";
import { X, User } from "@/components/animate-ui/icons";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onSaveProfile: (updatedProfile: UserProfileData) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [secondName, setSecondName] = useState(profile.secondName);
  const [bio, setBio] = useState(profile.personalDetails.bio);
  const [imageUrl, setImageUrl] = useState(profile.personalDetails.imageUrl);
  const [college, setCollege] = useState(profile.personalDetails.college);
  const [degree, setDegree] = useState(profile.personalDetails.degree);
  const [branch, setBranch] = useState(profile.personalDetails.branch);
  const [gradYear, setGradYear] = useState(profile.personalDetails.yearOfGraduation);
  const [country, setCountry] = useState(profile.personalDetails.country);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setFirstName(profile.firstName);
    setSecondName(profile.secondName);
    setBio(profile.personalDetails.bio);
    setImageUrl(profile.personalDetails.imageUrl);
    setCollege(profile.personalDetails.college);
    setDegree(profile.personalDetails.degree);
    setBranch(profile.personalDetails.branch);
    setGradYear(profile.personalDetails.yearOfGraduation);
    setCountry(profile.personalDetails.country);
    setSaveError("");
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfileData = {
      ...profile,
      firstName,
      secondName,
      personalDetails: {
        ...profile.personalDetails,
        bio,
        imageUrl,
        college,
        degree,
        branch,
        yearOfGraduation: Number(gradYear) || 2028,
        country,
      },
    };
    setIsSaving(true);
    setSaveError("");
    try {
      await onSaveProfile(updated);
      onClose();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Profile could not be saved");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[#ff1018]" />
            <span>Edit Profile Details</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff1018]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Last Name</label>
              <input
                type="text"
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff1018]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Bio / Headline</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff1018]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff1018]"
            />
          </div>

          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff4452] block">
              Education & Location
            </span>

            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff1018]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff1018]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff1018]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff1018]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff1018]"
                />
              </div>
            </div>
          </div>

          {saveError && <p role="alert" className="text-xs text-rose-400">{saveError}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
            <SmoothButton
              variant="outline"
              color="neutral"
              size="sm"
              type="button"
              onClick={onClose}
              className="rounded-xl border-zinc-800 bg-[#141418] text-zinc-300 hover:text-white"
            >
              Cancel
            </SmoothButton>
            <SmoothButton
              variant="solid"
              color="destructive"
              size="sm"
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold"
            >
              {isSaving ? "Saving…" : "Save Changes"}
            </SmoothButton>
          </div>
        </form>
      </div>
    </div>
  );
}
