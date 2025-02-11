export type DataResult<T> = {
  success: boolean
  errors?: { [P in keyof T]?: string[] }
  message?: String
}

export type NavItem = {
  title: string
  href: string
  type: "parent" | "child"
}

export interface ITools {
  label: string
  value?: string
  href: string
}
