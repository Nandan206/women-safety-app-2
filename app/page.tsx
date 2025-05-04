import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function Home() {
  const cookieStore = cookies()
  const isAuthenticated = cookieStore.has("auth-token")

  if (!isAuthenticated) {
    redirect("/auth/login")
  } else {
    redirect("/dashboard")
  }
}
