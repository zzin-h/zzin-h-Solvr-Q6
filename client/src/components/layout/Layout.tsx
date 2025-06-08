import React from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/sleep-entries" className="text-xl font-bold text-indigo-600">
              수면 트래커
            </Link>
            <div className="flex space-x-4">
              <Link to="/sleep-entries" className="text-gray-600 hover:text-gray-900">
                기록 목록
              </Link>
              <Link to="/sleep-entries/new" className="text-gray-600 hover:text-gray-900">
                새 기록
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
