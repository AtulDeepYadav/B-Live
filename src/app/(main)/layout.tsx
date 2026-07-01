"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, MessageSquare, User, Flame } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const tabs = [
    {
      name: "Dating",
      href: "/dating",
      icon: Flame,
    },
    {
      name: "Confessions",
      href: "/confessions",
      icon: MessageSquare,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <ThemeToggle />
      
      {/* App Header */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <Heart className="w-6 h-6 text-primary fill-primary/20" />
           <span className="font-bold text-xl tracking-tight text-foreground">B-Live</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto min-h-[calc(100vh-8rem)]">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-background/90 backdrop-blur-xl border-t border-border z-50 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href)
            const Icon = tab.icon
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-6 h-6 transition-all ${isActive ? "scale-110" : ""}`} />
                <span className="text-[10px] font-medium">{tab.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
