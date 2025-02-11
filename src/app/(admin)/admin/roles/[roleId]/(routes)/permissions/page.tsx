import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import { PageSection } from "@/components/page-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import AddPermissionButton from "./_components/add-permission-button"
import { columns } from "./_components/columns"

export default async function RolesAdminPermissionsPage({
  params,
}: {
  params: { roleId: string }
}) {
  await protectPage({ permission: "admin:all" })

  const { roleId } = params

  const data = await prismadb.role.findUnique({
    where: { id: Number(roleId) },
    include: { permissions: { include: { permission: true } } },
  })

  const dataPermissions = data?.permissions || []

  const title = "Permissions"
  const description = "Add permissions to this role"

  return (
    <>
      <PageSection
        title={title}
        description={description}
        action={<AddPermissionButton id={Number(roleId)} />}
      />
      <DataTable
        columns={columns}
        data={dataPermissions}
        searchField={"permission.name"}
      />
    </>
  )
}
