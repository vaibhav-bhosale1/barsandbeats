import { signIn } from 'next-auth/react'
import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-center'>
        <div>
            <h2>BarsandBeats</h2>
        </div>
        <div>
            <button onClick={()=>signIn()}> Signin</button>
        </div>

    </div>
  )
}

export default Header