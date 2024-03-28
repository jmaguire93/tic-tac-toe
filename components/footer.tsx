import React from 'react'

export default function Footer() {
  return (
    <footer className="py-3 bg-slate-200 w-full flex items-center justify-center border-t-2 border-black">
      <small className="text-xs text-gray-800">
        &copy; Built by <span className="underline">Josh</span>. Uses Next.js,
        Tailwind, hosted by vercel.
      </small>
    </footer>
  )
}
