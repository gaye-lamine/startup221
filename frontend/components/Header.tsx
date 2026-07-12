import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Brand Logo and Navigation Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-bold text-brand-active tracking-tight flex items-center gap-1">
            <span>Startup221</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 h-16">
            <Link
              href="/"
              className="text-sm font-semibold text-brand-active border-b-2 border-brand-active h-full flex items-center px-1"
            >
              Directory
            </Link>
            <a
              href="#"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center px-1"
            >
              About
            </a>
            <Link
              href="/for-investors"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center px-1"
            >
              For Investors
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center px-1"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Side: CTA Actions */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Login
          </a>
          <Link
            href="/register"
            className="text-sm font-medium bg-brand-active text-white px-5 py-2.5 rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
}
