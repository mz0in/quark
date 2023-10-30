"use server"

import { getServerAuthSession } from "@/lib/auth"
import prismadb from "@/utils/prismadb"

type DataResult<T> = {
  success: boolean
  errors?: { [P in keyof T]?: string[] }
  message?: String
}

interface IRole {
  id: number
  name: string
  description: string
}

export async function editRole({
  id,
  name,
  description,
}: IRole): Promise<DataResult<IRole>> {
  try {
    const session = await getServerAuthSession()
    const errors: { name: string[]; description: string[] } = {
      name: [],
      description: [],
    }
    const roleAlreadyExists = await prismadb.role.findUnique({
      where: { name, NOT: { id } },
    })
    if (roleAlreadyExists) {
      errors.name.push(`A role with the name ${name} already exists.`)
    }

    if (errors.name.length || errors.description.length) {
      return { success: false, errors }
    }

    await prismadb.role.update({ where: { id }, data: { name, description } })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
