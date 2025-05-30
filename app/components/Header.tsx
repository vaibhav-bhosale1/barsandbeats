"use client"
import { Button } from '@/components/ui/button'
import { Music } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { ThemeToggle } from "@/components/theme-toggle"
const Header = () => {
  const { data: session } = useSession(); 

  return (
    
            <header className="px-2 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
            <Music className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            StreamTunes
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-blue-600 transition-colors">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Pricing
            
          </Link>
       <ThemeToggle/>
       <div>
        {!session?.user && ( // show Signin if user is NOT logged in
          <Button onClick={() => signIn()}>Signin</Button>
        )}
        {session?.user && ( // show Signout if user IS logged in
          <Button onClick={() => signOut()}>Log Out</Button>
        )}
      </div>
        
        </nav>
      </header>    
  )
}

export default Header;
