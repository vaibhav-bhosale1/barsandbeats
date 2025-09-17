"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

// A simple SVG Google Icon component
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.988,36.635,44,31.023,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
)

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            🎵 Welcome to BarsAndBeats
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to create your own stream or join a friend's session.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Login or Sign Up
          </h2>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            size="lg"
            className="w-full"
          >
            <GoogleIcon className="mr-2" />
            Continue with Google
          </Button>
          <p className="text-xs text-gray-400 mt-6">
            By continuing, you agree to the BarsAndBeats Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}