'use client'

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSupabase } from "@/utils/supabase-provider";
import { useUser } from "@/utils/useClient";

export default function UpdatePassword() {
  const { supabase } = useSupabase();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { user, loading } = useUser(supabase);

  useEffect(() => {
    async function fetchUserProfile() {
      if (user && !loading) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("mc_uuid")
          .eq("id", user.id)
          .single();
  
        if (error) {
          console.error("Error fetching profile:", error.message);
        } else {
          setMcUUID(profile.mc_uuid);
        }
      } else if (!user && !loading) {
        router.push("/login");
      }
    }
  
    fetchUserProfile();
  }, [user, loading, supabase]);

  useEffect(() => {
    const passwordRequirements = {
      minLength: 8,
      hasUppercase: true,
      hasLowercase: true,
      hasNumber: true,
      hasSpecialChar: true,
    };
    const isPasswordValid = validatePassword(newPassword, passwordRequirements);
    if (!isPasswordValid) {
      setMessage("Password does not meet the requirements.");
    } else {
      setMessage("");
    }
  }, [newPassword]);

  const validatePassword = (password, requirements) => {
    const regex = new RegExp(
      `^(?=.*[a-z])${requirements.hasUppercase ? "(?=.*[A-Z])" : ""}${requirements.hasNumber ? "(?=.*[0-9])" : ""
      }${requirements.hasSpecialChar ? "(?=.*[^A-Za-z0-9])" : ""}.{${requirements.minLength},}$`
    );
    return regex.test(password);
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setMessage("");
      const { user, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setMessage("Password has been updated.");
      router.push("/account");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePassword();
  };

  const handleReset = () => {
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  return (
    <main className="absolute inset-0 h-screen flex items-center justify-center bg-primary dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8 mx-auto" style={{ maxWidth: "31.25rem" }}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-color dark:text-dark-text-color">Update your password</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} onReset={handleReset}>
          <div className="relative rounded-md -space-y-px">
            <label htmlFor="new-password" className="relative sr-only text-text-color dark:text-dark-text-color">New Password</label>
            <div className="relative flex items-center justify-center">
              <input
                id="new-password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full pl-10 py-2 my-2 border border-accent dark:border-dark-accent placeholder-gray-500 text-primary dark:text-dark-primary rounded-md sm:text-sm"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-label="New Password"
                autoFocus
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="20"
                height="20"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              {/* Password strength indicator or visibility toggle can be added here */}
            </div>
            <label htmlFor="confirm-password" className="relative sr-only text-text-color dark:text-dark-text-color">Confirm New Password</label>
            <div className="relative flex items-center justify-center">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full pl-10 py-2 my-2 border border-accent dark:border-dark-accent placeholder-gray-500 text-primary dark:text-dark-primary rounded-md sm:text-sm"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm New Password"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="20"
                height="20"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              {/* Password visibility toggle can be added here */}
            </div>
            {message && (
              <div className="flex items-center text-red-500 mt-2 text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" /></svg>
                {message}
              </div>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-text-color dark:text-dark-text-color bg-theme-color dark:bg-dark-theme-color hover:opacity-50 focus:outline-none"
            >
              Update password
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
