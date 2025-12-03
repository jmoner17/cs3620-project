'use client'

import React, { useState, useEffect } from "react";
import { useSupabase } from "@/utils/supabase-provider";
import { useRouter } from 'next/navigation';
import { useUser } from "@/utils/useClient";
import Image from 'next/image';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}


export default function Home() {
  const { user } = useUser();

  // Show a loading indicator while the user data is being fetched
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.first_name}</h1>
    </div>
  );
}