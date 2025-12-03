'use client'

import { useSupabase } from "@/utils/supabase-provider";
import { useUser } from "@/utils/useClient";
import UserHeader from "@/components/UserHeader";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import Footer from "@/components/Footer";

export default function Layout({ children }) {
  const { supabase } = useSupabase();
  const { user, loading } = useUser(supabase);

  return (
    <>
      <UserHeader user={user} loading={loading} />
      <Navbar />
      {children}
    </>
  )
}