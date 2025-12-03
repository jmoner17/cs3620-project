'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/utils/supabase-provider";
import Link from "next/link";

export default function LinkDeviceForm() {
  const { supabase } = useSupabase();

  // Device input state variables
  const [deviceId, setDeviceId] = useState("");
  const [devicePassword, setDevicePassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Ensure the user is logged in before linking a device.
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      setMessage("You must be logged in to link a device.");
      setLoading(false);
      return;
    }

    try {
      // Get the current session to retrieve the access token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage("You must be logged in to link a device.");
        setLoading(false);
        return;
      }
      
      // Send the device link request to the API endpoint.
      const response = await fetch("/api/device/link-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          device_id: deviceId,
          device_password: devicePassword,
        }),
      });
      
      const result = await response.json();
      setMessage(result.message || result.error);

      //Redirect to the device page after a successful link
      if (result.message === "Device successfully linked to your account.") {
        router.push("/devices");
      }

    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main
      className=" inset-0 flex items-center justify-center bg-primary dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8 mx-auto"
      style={{ maxWidth: "31.25rem" }}
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-color dark:text-dark-text-color">
            Link Your Device
          </h2>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="relative rounded-md -space-y-px">
            <div className="relative flex items-center">
              <input
                id="deviceId"
                name="deviceId"
                type="text"
                autoComplete="off"
                required
                className="appearance-none relative block w-full pl-10 py-2 my-2 border border-accent dark:border-dark-accent placeholder-gray-500 text-primary dark:text-dark-primary rounded-md sm:text-sm"
                placeholder="Enter your device ID"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
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
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
              </svg>
            </div>
            <div className="relative flex items-center">
              <input
                id="devicePassword"
                name="devicePassword"
                type="text"
                autoComplete="off"
                required
                className="appearance-none relative block w-full pl-10 py-2 my-2 border border-accent dark:border-dark-accent placeholder-gray-500 text-primary dark:text-dark-primary rounded-md sm:text-sm"
                placeholder="Enter your device password"
                value={devicePassword}
                onChange={(e) => setDevicePassword(e.target.value)}
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
                <path d="M12 11V2a10 10 0 1 0 10 10h-2" />
              </svg>
            </div>
            {message && (
              <div className="flex items-center text-red-500 mt-2 text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                </svg>
                {message}
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
                "Link Device"
              )}
            </button>
          </div>
          <div className="flex items-center justify-center">
            <Link href="/devices" className="text-sm text-accent hover:text-accent-hover text-text-color dark:text-dark-text-color">
              Back to Devices
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

