import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import {
  Music,
  Users,
  Headphones,
  Zap,
  Heart,
  TrendingUp,
  Play,
  Volume2,
  Radio,
} from "lucide-react"
import Link from "next/link"
import Header from "./components/Header"

export default function MusicStreamingLanding() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-4xl">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-600 hover:bg-purple-200"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Now Live: Fan-Powered Music Streaming
                </Badge>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-600 via-teal-500 to-blue-400 bg-clip-text text-transparent">
                  Let Your Fans Choose
                  <br />
                  Your Stream Soundtrack
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl lg:text-2xl">
                  Connect with your audience like never before. Give your fans the power to curate your stream's music
                  in real-time and create unforgettable moments together.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-6 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Streaming
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-blue-200 hover:bg-purple-50">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Hero Image */}
              <div className="w-full max-w-5xl mt-12">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800 p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-400 rounded-full flex items-center justify-center">
                            <Radio className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">Live Stream</h3>
                            <p className="text-blue-200 text-sm">2,847 viewers</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                            <Music className="w-4 h-4 text-blue-300" />
                            <span className="text-white text-sm">Now Playing: "Midnight Vibes"</span>
                          </div>
                          <div className="text-blue-200 text-xs">Requested by @musiclover23</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Fan Requests
                        </h4>
                        <div className="space-y-2">
                          {[
                            { song: "Electric Dreams", user: "@synthwave_fan", votes: 23 },
                            { song: "Neon Nights", user: "@retrobeats", votes: 18 },
                            { song: "Digital Love", user: "@musicaddict", votes: 15 },
                          ].map((request, i) => (
                            <div key={i} className="bg-white/5 rounded-lg p-2 flex items-center justify-between">
                              <div>
                                <div className="text-white text-sm font-medium">{request.song}</div>
                                <div className="text-blue-300 text-xs">{request.user}</div>
                              </div>
                              <div className="flex items-center gap-1 text-teal-300">
                                <Heart className="w-3 h-3" />
                                <span className="text-xs">{request.votes}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Three simple steps to transform your streaming experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Cards Here (Start Stream, Fans Request Songs, Music Plays) */}
              {/* ... (already included above) */}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-teal-50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features That Rock</h2>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Everything you need to create an interactive music experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Cards Here (Real-time Voting, Queue Mgmt, Engagement, etc.) */}
              {/* ... (already included above) */}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-400">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Ready to Amplify Your Stream?
                </h2>
                <p className="max-w-[600px] mx-auto text-white/90 text-lg">
                  Join thousands of streamers who are turning their communities into collaborative DJs.
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-100 px-8 py-6 text-lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  See It In Action
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-blue-100 py-6 mt-auto">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2025 StreamTunes. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-800">Terms</Link>
            <Link href="/contact" className="hover:text-gray-800">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
