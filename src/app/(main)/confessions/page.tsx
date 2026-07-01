"use client"

import { useState } from "react"
import { Send, Loader2, ShieldAlert } from "lucide-react"

type Confession = {
  id: string
  content: string
  reactions: Record<string, number>
  timeAgo: string
}

const MOCK_CONFESSIONS: Confession[] = [
  {
    id: "1",
    content: "The marketing prof spent 45 minutes today explaining a framework that ChatGPT explained to me in 2 sentences. I'm paying 20L for this.",
    reactions: { "Felt This": 42, "Tea ☕": 12 },
    timeAgo: "2h ago"
  },
  {
    id: "2",
    content: "To the guy who always raises his hand at 5:58 PM: We all hate you.",
    reactions: { "This Is Real": 89, "F*** That": 4 },
    timeAgo: "4h ago"
  },
  {
    id: "3",
    content: "I genuinely feel like I'm the only one here who doesn't know what they want to do after graduation. Everyone seems so sorted.",
    reactions: { "Sending Strength": 56, "Felt This": 102 },
    timeAgo: "1d ago"
  }
]

const REACTIONS = ["Felt This", "Tea ☕", "This Is Real", "Hot Take", "Sending Strength", "F*** That"]

export default function ConfessionsPage() {
  const [feed, setFeed] = useState<Confession[]>(MOCK_CONFESSIONS)
  const [newPost, setNewPost] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() || newPost.length > 280) return
    
    setIsPosting(true)
    
    // Simulate LLM Triage delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real app, if it fails LLM check it goes to queue.
    // For now, we mock success.
    const post: Confession = {
      id: Date.now().toString(),
      content: newPost,
      reactions: {},
      timeAgo: "Just now"
    }
    
    setFeed([post, ...feed])
    setNewPost("")
    setIsPosting(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Create Post Section */}
      <div className="p-4 bg-background border-b border-border sticky top-16 z-30">
        <form onSubmit={handlePost} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
           <textarea
             placeholder="Got a confession? (Anonymous & Encrypted)..."
             value={newPost}
             onChange={(e) => setNewPost(e.target.value)}
             maxLength={280}
             className="w-full bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[80px]"
           />
           <div className="flex items-center justify-between mt-2 border-t border-border pt-2">
             <div className="text-xs flex items-center gap-1 text-muted-foreground">
                <ShieldAlert className="w-3 h-3 text-primary" />
                <span className={newPost.length > 250 ? "text-red-500" : ""}>
                  {newPost.length}/280
                </span>
             </div>
             <button
               type="submit"
               disabled={!newPost.trim() || isPosting}
               className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3 h-3" /> Post</>}
             </button>
           </div>
        </form>
      </div>

      {/* Feed Section */}
      <div className="flex-1 p-4 space-y-4">
        {feed.map((post) => (
          <div key={post.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
               <div className="flex flex-wrap gap-2">
                 {/* Existing Reactions */}
                 {Object.entries(post.reactions).map(([reaction, count]) => (
                   <button key={reaction} className="bg-muted hover:bg-muted/80 text-muted-foreground text-xs px-2.5 py-1 rounded-full font-medium transition-colors">
                     {reaction} {count}
                   </button>
                 ))}
                 
                 {/* Add Reaction Button (Mock) */}
                 <button className="bg-transparent border border-border hover:bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full font-medium transition-colors">
                   + React
                 </button>
               </div>
               <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                 {post.timeAgo}
               </span>
            </div>
          </div>
        ))}
        
        <div className="py-8 text-center text-xs text-muted-foreground">
          No more confessions. You've reached the end.
        </div>
      </div>
    </div>
  )
}
