"use client"

import { useState } from "react"
import { Heart, X, Info, Sparkles } from "lucide-react"

// Mock data for Phase 0
const MOCK_PROFILES = [
  {
    id: "1",
    name: "Priya",
    batchYear: 2025,
    bio: "Consulting hopeful. Weekend hiker. Will debate you on marketing strategy.",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
    score: 82,
    reasons: ["You both prioritize deep work over hustle culture", "You're both weekend hikers"]
  },
  {
    id: "2",
    name: "Rahul",
    batchYear: 2026,
    bio: "Fin-bro trying to read more fiction. Coffee addict.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    score: 75,
    reasons: ["Shared interest in literary fiction", "Similar communication directness"]
  },
  {
    id: "3",
    name: "Sneha",
    batchYear: 2025,
    bio: "Ex-startup founder. Probably at the library or finding the best street food.",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
    score: 91,
    reasons: ["High alignment on ambition and career goals", "Both love discovering local food"]
  }
]

export default function DatingPage() {
  const [profiles, setProfiles] = useState(MOCK_PROFILES)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const currentProfile = profiles[currentIndex]

  const handleSwipe = (direction: 'left' | 'right') => {
    // In a real app, this would send an API request to Supabase
    // is_right_swipe = direction === 'right'
    if (currentIndex < profiles.length) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-32 px-4 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">You're all caught up!</h2>
        <p className="text-muted-foreground">
          You've seen all verified profiles in your cohort. Check back later or unlock Global Mode.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-4 relative pt-8">
      {/* Cards Container */}
      <div className="relative w-full aspect-[3/4] max-h-[600px] bg-card rounded-3xl shadow-xl border border-border overflow-hidden">
        
        {/* Photo Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
          style={{ backgroundImage: `url(${currentProfile.photoUrl})` }}
        />
        
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white flex flex-col justify-end h-full pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
             <h2 className="text-3xl font-bold tracking-tight">{currentProfile.name}</h2>
             <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-md border border-white/10">
               Batch '{currentProfile.batchYear.toString().slice(-2)}
             </span>
          </div>
          
          <p className="text-sm text-white/90 mb-4 line-clamp-2">
            {currentProfile.bio}
          </p>

          {/* Compatibility Score */}
          <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 mt-auto mb-4 pointer-events-auto">
             <div className="flex items-center gap-2 mb-2">
               <div className="bg-primary px-2 py-1 rounded-lg">
                 <span className="font-bold text-sm text-white">{currentProfile.score}% Match</span>
               </div>
               <Info className="w-4 h-4 text-white/60 ml-auto" />
             </div>
             <ul className="space-y-1">
               {currentProfile.reasons.map((reason, idx) => (
                 <li key={idx} className="text-xs text-white/80 flex items-start gap-1.5">
                   <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                   <span>{reason}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <button 
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-card shadow-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-110 transition-all"
        >
          <X className="w-8 h-8" />
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-primary-foreground hover:bg-primary/90 hover:scale-110 transition-all"
        >
          <Heart className="w-8 h-8 fill-primary-foreground" />
        </button>
      </div>
    </div>
  )
}
