'use client'

import GoBackButton from "@/components/BackButton"
import SubBackground from "@/components/SubBackground"

export default function Layout({ children }) {
  return (
    <>
      <SubBackground />
      <GoBackButton />
      {children}
    </>
  )
}