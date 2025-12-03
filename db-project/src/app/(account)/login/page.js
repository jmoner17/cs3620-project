/**
 * @file page.js
 * @brief Sign-in form component for user authentication.
 */

'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/utils/supabase-provider";
import Link from "next/link";
import HCaptcha from '@hcaptcha/react-hcaptcha';

/**
 * SignInForm component for user authentication.
 * 
 * @returns {ReactNode} The rendered sign-in form component.
 */
export default function SignInForm() {
  const { supabase } = useSupabase();

  /** @var {string} email - Email input from the user. */
  const [email, setEmail] = useState("");

  /** @var {string} password - Password input from the user. */
  const [password, setPassword] = useState("");

  /** @var {string} error - Error message for display. */
  const [error, setError] = useState("");

  /** @var {boolean} loading - State indicating if authentication is in progress. */
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  
  /** @var {string} captchaToken - Token from the captcha verification. */
  const [captchaToken, setCaptchaToken] = useState();

  const captcha = useRef();

  /**
   * Signs in the user using their email and password.
   * 
   * @param {string} email - Email of the user.
   * @param {string} password - Password of the user.
   * @returns {string|null} Error message or null if successful.
   */
  const signInWithEmail = async (email, password) => {
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return null;
    } catch (error) {
      return error.message;
    }
  };

  /**
   * Validates the provided email.
   * 
   * @param {string} email - Email to validate.
   * @returns {boolean} True if email is valid, false otherwise.
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validates the provided password.
   * 
   * @param {string} password - Password to validate.
   * @returns {boolean} True if password is valid, false otherwise.
   */
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  /**
   * Handles the form submission for user authentication.
   * 
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!captchaToken) {
      setError("Please complete the captcha.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please provide a valid email address.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Please provide a valid password.");
      setLoading(false);
      return;
    }

    try {
      const error = await signInWithEmail(email, password);

      if (error) {
        throw new Error("Invalid email or password.");
      }

      router.push("/home");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };


  useEffect(() => {
    async function fetchUser() {
    /*
        setError(
        "Unfortunately, authentication is only available to staff at the moment."
      );
    */
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        router.push("/home");
      }
    }
    fetchUser();
  }, [supabase, router]);

  return (
    <main
      className="absolute inset-0 flex items-center justify-center bg-primary dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8 mx-auto"
      style={{ maxWidth: "31.25rem" }}
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-color dark:text-dark-text-color">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="relative rounded-md -space-y-px">
            <label
              htmlFor="email-address"
              className="relative sr-only text-text-color dark:text-dark-text-color"
            >
              Email address
            </label>
            <div className="relative flex items-center jestify-center">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full pl-10 py-2 my-2 border border-accent dark:border-dark-accent placeholder-gray-500 text-primary dark:text-dark-primary rounded-md sm:text-sm"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>

            <div className="relative flex items-center justify-between w-full">
              <label
                htmlFor="password"
                className="relative text-text-color dark:text-dark-text-color"
              >
                Password
              </label>
              <Link
                href="/reset-password"
                rel="prefetch"
                className="text-sm text-accent hover:text-accent-hover"
              >
                Forgot your password?
              </Link>
            </div>
            <div className="relative flex items-center justify-center">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full pl-10 py-2 my-2 border border-accent dark:border-dark-accent placeholder-gray-500 text-primary dark:text-dark-primary rounded-md sm:text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
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
            </div>
            {error && (
              <div className="flex items-center text-red-500 mt-2 text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-text-color dark:text-dark-text-color bg-theme-color dark:bg-dark-theme-color hover:opacity-50 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2">Loading...</span>
                  <svg
                    className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
          <div className="flex items-center justify-start">
            <HCaptcha
              ref={captcha}
              sitekey="5aae81c8-f287-4089-8834-13ffa125290a"
              onVerify={(token) => {
                setCaptchaToken(token)
              }}
            />
          </div>
        </form>
      </div>
    </main>
  );
}