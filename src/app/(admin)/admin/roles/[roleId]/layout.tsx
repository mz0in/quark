import { notFound } from "next/navigation"

import prismadb from "@/utils/prismadb"

import { PageHeader } from "@/components/page-header"

import DeleteRoleModal from "./_components/delete-role-modal"
import { SidebarNav } from "./_components/sidebar-nav"

const getSideBarNavItems = (id: number) => {
  const baseHref = `/admin/roles/${id}`

  return [
    {
      title: "Settings",
      href: baseHref,
      type: "parent",
    },
    {
      title: "Permissions",
      href: `${baseHref}/permissions`,
      type: "child",
    },
    {
      title: "Users",
      href: `${baseHref}/users`,
      type: "child",
    },
  ]
}

interface SettingsLayoutProps {
  children: React.ReactNode
  params: { roleId: string }
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const sidebarNavItems = getSideBarNavItems(Number(params.roleId))

  const getRole = async () => {
    const id = Number(params.roleId)

    if (!id) {
      return notFound()
    }

    const role = await prismadb.role.findUnique({
      where: { id },
    })

    if (!role) {
      return notFound()
    }

    return role
  }

  const role = await getRole()

  const title = `Edit role ${role.name}`
  const description = `ID: ${role.id}`
  const copy = String(`${role.id}`)
  const linkBack = "/admin/roles"

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        linkBack={linkBack}
        copy={copy}
        action={<DeleteRoleModal role={role} />}
      />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </>
  )
}
