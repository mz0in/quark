import { notFound } from "next/navigation"

import prismadb from "@/utils/prismadb"

import Container from "@/components/container"
import { CopyButtonData } from "@/components/copy-clipboard-button"
import { Separator } from "@/components/ui/separator"

import DeleteUserModal from "./_components/delete-user-modal"
import UserForm from "./_components/user-form"

export default async function UserView({ params }: { params: { user_id: string } }) {
  const getUser = async () => {
    if (params.user_id === "new-user") {
      return null
    } else {
      const user = await prismadb.user.findUnique({ where: { id: params.user_id } })

      if (!user) {
        return notFound()
      }

      return user
    }
  }

  const user = await getUser()

  const title = user ? "Edit user" : "Create user"
  const description = user ? `ID: ${user.id}` : "Add a new user"

  return (
    <>
      <Container>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <div className="flex items-center justify-start">
              <p className="text-muted-foreground">{description}</p>
              {user?.id && <CopyButtonData textToCopy={user.id} />}
            </div>
          </div>
          {user && <DeleteUserModal user={user} />}
        </div>
        <Separator className="my-6" />
        <UserForm user={user} />
      </Container>
    </>
  )
}
