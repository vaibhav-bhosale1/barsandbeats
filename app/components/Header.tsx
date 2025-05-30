"use client"
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

const Header = () => {
  const { data: session } = useSession(); // cleaner destructuring

  return (
    <div className='flex justify-center items-center gap-3'>
      <div>
        <h2>BarsandBeats</h2>
      </div>
      <div>
        {!session?.user && ( // show Signin if user is NOT logged in
          <Button onClick={() => signIn()}>Signin</Button>
        )}
        {session?.user && ( // show Signout if user IS logged in
          <Button onClick={() => signOut()}>Signout</Button>
        )}
      </div>
    </div>
  )
}

export default Header;
