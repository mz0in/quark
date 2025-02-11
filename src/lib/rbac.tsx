"use server"

import { redirect } from "next/navigation"

import { getCurrentUser } from "@/actions/users/get-current-user"
import prismadb from "@/utils/prismadb"

type RolesCheck = { role: string; permission?: never }
type PermissionsCheck = { permission: string; role?: never }

type Opts = RolesCheck | PermissionsCheck

async function getUserRoles(userId: string) {
  const userRoles = await prismadb.userRole
    .findMany({
      where: { userId },
      select: {
        role: {
          select: {
            key: true,
          },
        },
      },
    })
    .then((userRoles) => userRoles.map((userRole) => userRole.role.key))

  return userRoles
}

async function getUserPermissions(userId: string) {
  const userPermissions = await prismadb.userRole
    .findMany({
      where: { userId },
      select: {
        role: {
          select: {
            permissions: {
              select: {
                permission: {
                  select: {
                    key: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    .then((userRoles) => userRoles.flatMap((userRole) => userRole.role.permissions))
    .then((permissions) => permissions.map((permission) => permission.permission.key))

  return userPermissions
}

async function hasRequiredPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (user) {
    const userPermissions = await getUserPermissions(user.id)
    return userPermissions.includes(permission)
  }
  return false
}

async function hasRequiredRole(role: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (user) {
    const userRoles = await getUserRoles(user.id)

    return userRoles.includes(role)
  }
  return false
}

export async function protectPage({ role, permission }: Opts) {
  if (role) {
    const hasRole = await hasRequiredRole(role)
    if (hasRole) return true
  }
  if (permission) {
    const hasPermission = await hasRequiredPermission(permission)
    if (hasPermission) return true
  }

  redirect("/auth/error/?error=AccessUnauthorized")
}

export async function ProtectComponent({
  children,
  requiredRole,
  requiredPermission,
  fallback,
}:
  | {
      children: React.ReactNode
      requiredRole: string
      requiredPermission?: never
      fallback?: React.ReactElement
    }
  | {
      children: React.ReactNode
      requiredRole?: never
      requiredPermission: string
      fallback?: React.ReactElement
    }) {
  if (requiredRole) {
    const hasRoles = await hasRequiredRole(requiredRole)
    if (hasRoles) {
      return <>{children}</>
    }
  }
  if (requiredPermission) {
    const hasPermission = await hasRequiredPermission(requiredPermission)
    if (hasPermission) {
      return <>{children}</>
    }
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return null
}

export async function has({ role, permission }: Opts): Promise<boolean> {
  if (role) {
    const hasRole = await hasRequiredRole(role)
    return hasRole
  }
  if (permission) {
    const hasPermission = await hasRequiredPermission(permission)
    return hasPermission
  }
  return false
}
