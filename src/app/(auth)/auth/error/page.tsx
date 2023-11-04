"use client"

import Image from "next/image"
import Link from "next/link"
import { redirect, useSearchParams } from "next/navigation"

import { ArrowLeft } from "lucide-react"

import Container from "@/components/container"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"

const errorTypes: { [key: string]: { message: string; icon?: string } } = {
  AccessDenied: {
    message: "Oops! This user account is blocked",
    icon: "calling-help",
  },
  AccessUnauthorized: {
    message: "Oops! Access Unauthorized",
    icon: "calling-help",
  },
  ConfirmEmail: { message: "Please confirm your email" },
  Default: { message: "Something went wrong!", icon: "crashed-error" },
}

export default function Error() {
  const searchParams = useSearchParams()
  const errorParam: string | null = searchParams.get("error") as string
  const errorMessage =
    errorParam && errorTypes[errorParam] ? errorTypes[errorParam] : errorTypes.Default

  if (errorParam === "ConfirmEmail") {
    redirect("/auth/confirm")
  }

  return (
    <Container>
      <div className="mt-20 flex flex-col items-center">
        <Logo />
        <Image
          alt="missing site"
          src={`/error/${errorMessage.icon}-gray.svg`}
          width={400}
          height={400}
          className="dark:hidden"
        />
        <Image
          alt="missing site"
          src={`/error/${errorMessage.icon}-white.svg`}
          width={400}
          height={400}
          className="hidden dark:block"
        />
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {errorMessage.message}
        </h2>
        <Button asChild variant="default" size="sm" className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </Container>
  )
}
