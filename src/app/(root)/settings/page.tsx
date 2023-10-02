import { redirect } from "next/navigation"

import { getCurrentUser } from "@/actions/getCurrentUser"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"

import Container from "@/components/container"
import { Separator } from "@/components/ui/separator"

import DeleteAccount from "./deleteAccount-form"
import EmailForm from "./email-form"
import UsernameForm from "./username-form"

export default async function Settings() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login?callbackUrl=/settings")
  }
  const currentUser = await getCurrentUser()

  return (
    <>
      <Container>
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>
        <Separator className="my-6" />
        <div className="space-y-6">
          <UsernameForm username={currentUser?.username || ""} />
          <EmailForm email={currentUser?.email || ""} />
          <Separator />
          <DeleteAccount />
        </div>
      </Container>
    </>
  )
}
