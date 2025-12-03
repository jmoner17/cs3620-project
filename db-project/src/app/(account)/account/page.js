/**
 * @file page.js
 * @brief Account component for displaying and managing user details.
 */

'use client'

import { useState, useEffect } from "react";
import { useSupabase } from "@/utils/supabase-provider";
import { useUser } from "@/utils/useClient";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Account component that manages and displays user details.
 * 
 * @returns {ReactNode} The rendered component.
 */
export default function Account() {
  const { supabase } = useSupabase();

  /** @var {string} mcUUID - Minecraft UUID of the user. */
  const [mcUUID, setMcUUID] = useState(null);

  /** @var {string} name - Minecraft username of the user. */
  const [name, setName] = useState(null);


  const { user, loading } = useUser(supabase);
  const router = useRouter();

  /**
   * Effect hook to fetch the user's profile when the user is authenticated.
   */
  useEffect(() => {
    async function fetchUserProfile() {
      if (user && !loading) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("first_name", "last_name")
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



  /**
   * Image loader function for fetching Minecraft avatars.
   * 
   * @param {Object} props - Loader properties.
   * @param {string} props.src - The source UUID.
   * @param {number} props.width - Image width.
   * @param {number} props.quality - Image quality.
   * @returns {string} The image URL.
   */

  return (
    <main className="absolute inset-0 h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-primary dark:bg-dark-primary mx-auto" style={{ maxWidth: "500px" }}>
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-5xl font-bold text-text-color dark:text-dark-text-color mb-4 whitespace-pre">{name ? name : " "}</h1>
          <button
            onClick={() => router.push("/update-password")}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-text-color dark:text-dark-text-color bg-theme-color dark:bg-dark-theme-color hover:opacity-50 focus:outline-none mb-4"
          >
            Change Password
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut(); 
              router.push("/home");
            }}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-text-color dark:text-dark-text-color bg-red-500 hover:opacity-50 focus:outline-none mb-4"
          >
            Sign Out
          </button>
        </div>
      </div>
      
    </main>
  );
}