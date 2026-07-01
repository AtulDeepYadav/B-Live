"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2, Camera, User, GraduationCap, FileText, EyeOff } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function OnboardingPage() {
  const [name, setName] = useState("")
  const [batchYear, setBatchYear] = useState("")
  const [bio, setBio] = useState("")
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('dating_profiles').update({
          full_name: name,
          batch_year: parseInt(batchYear),
          bio: bio,
          is_verified: true,
          // Ghost mode is true by default per schema, users can disable later
        }).eq('id', user.id)
      }
      
      // Navigate to the main app feed
      window.location.href = "/app"
    } catch (error) {
      console.warn("Supabase not fully setup or mocked error", error)
      window.location.href = "/app"
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      <ThemeToggle />
      
      {/* Decorative blurred blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl relative z-10">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Just the basics. You can fill out the rest later.
          </p>
        </div>

        {/* Ghost Mode Alert */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <EyeOff className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-primary">Ghost Mode Active</h3>
            <p className="text-xs text-primary/80 mt-1">
              Your profile is hidden for 48 hours. You can browse the dating pool and confession feed completely anonymously before going live.
            </p>
          </div>
        </div>

        <form onSubmit={handleComplete} className="space-y-4">
          
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
              <Camera className="w-8 h-8 mb-1 opacity-50" />
              <span className="text-[10px] uppercase font-semibold tracking-wider">Add Photo</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                type="number"
                required
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                placeholder="Batch Year (e.g. 2025)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <textarea
                required
                maxLength={100}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="One-line bio..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-foreground resize-none h-24"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !name || !batchYear || !bio}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Browsing"}
          </button>
        </form>
      </div>
    </div>
  )
}
