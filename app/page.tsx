import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { GoalInputForm } from "@/components/GoalInputForm";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation - Fixed at top */}
      <nav className="w-full border-b border-gray-100 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            SMART Goals
          </div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>

      <SignedOut>
        {/* Hero Section */}
        <div className="pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Transform your goals into</span>
                <span className="block text-indigo-600">achievable actions</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Set SMART goals, track your progress, and achieve your dreams with our structured approach to goal setting.
              </p>
              <div className="mt-8">
                <SignInButton mode="modal">
                  <button className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105">
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Set Clear Goals",
                  description: "Transform vague aspirations into clear, actionable SMART goals"
                },
                {
                  title: "Track Progress",
                  description: "Monitor your daily achievements and build lasting habits"
                },
                {
                  title: "Stay Motivated",
                  description: "Watch your streak grow as you consistently achieve your goals"
                }
              ].map((feature, index) => (
                <div key={index} className="relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-indigo-50 p-3">
                      <CheckCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <GoalInputForm showHeader={false} showBanner={false} />
        </div>
      </SignedIn>
    </div>
  );
}




