"use client"

import { User, Settings, LogOut, Shield } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full p-4 space-y-6 pt-8">
      
      {/* Profile Header */}
      <div className="flex items-center gap-4 bg-card border border-border p-6 rounded-3xl shadow-sm">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shrink-0">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Batch of '25</p>
          <div className="flex items-center gap-1 mt-2 bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full w-fit">
            <Shield className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Verified IIML</span>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Account Settings</span>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 hover:bg-red-500/10 cursor-pointer transition-colors group">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-500 group-hover:text-red-600">Sign Out</span>
          </div>
        </div>
      </div>
      
    </div>
  )
}
