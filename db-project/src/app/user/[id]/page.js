'use client'

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSupabase } from '@/utils/supabase-provider';
import Image from 'next/image';

export default function User() {
  const { supabase } = useSupabase();
  const pathname = usePathname();
  const id = pathname ? pathname.split('/').pop() : null;
  const [MC, setMC] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    if (MC) {
      const { data, error } = await supabase
        .from("profiles")
        .select("mc_uuid, staff_info")
        .eq("mc_uuid", MC)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        setProfile(data);
      }
    }
  };

  useEffect(() => {
    const getMC = async () => {
      const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${id}`);
      if (response.status !== 204) {
        const data = await response.json();
        setMC(data?.uuid);
      }
      setIsLoading(false);
    }

    getMC();
  }, [id]);

  useEffect(() => {
    fetchUserProfile();
  }, [MC, supabase]);

  const imageLoader = ({ src, width, quality }) => 
    MC ? `https://visage.surgeplay.com/full/512/${src}?w=${width}&q=${quality || 100}` : null;

  const displayContent = () => {
    if(isLoading) return id;
    if(MC) return id;
    return 'Error: User Not Found';
  }

  return (
    <main className="relative flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-text-color dark:text-dark-text-color m-20">
        {displayContent()}
      </h1>
      <div className="bg-primary dark:bg-dark-primary w-full">
        <div className="transition-all duration-300 slide-in-left opacity-100 container relative mx-auto flex flex-col items-center justify-center pt-10" style={{ height: "37.5rem" }}>
          {profile && <Image
            loader={imageLoader}
            src={`${MC}`}
            alt="Minecraft Profile"
            priority
            width="0"
            height="0"
            sizes="100vw"
            quality={100}
            className="h-82 w-64 object-contain"
          />}
          <div className="text-primary mb-4">
            <p className="text-lg text-gray-700 dark:text-gray-400 whitespace-pre">{profile?.staff_info?.title?.toUpperCase() || " "}</p>
          </div>
        </div>
      </div>
    </main>
  );
}