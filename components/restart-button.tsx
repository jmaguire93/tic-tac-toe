'use client'

import React from 'react'

export default function RestartButton() {
  return (
    <div className="m-4 text-center">
      <button
        onClick={() => window.location.reload()}
        className="bg-green-700 text-white rounded py-2 px-4"
      >
        Restart
      </button>
    </div>
  )
}
