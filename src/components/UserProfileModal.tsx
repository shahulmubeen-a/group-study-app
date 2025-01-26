import React, { useState } from 'react'

interface UserProfileModalProps {
  onSave: (profile: UserProfile) => void
}

export default function UserProfileModal({ onSave }: UserProfileModalProps) {
  const [name, setName] = useState('')
  const [teachingInterest, setTeachingInterest] = useState('')
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!name.trim() || !teachingInterest.trim()) {
      setError('Please fill in all fields')
      return
    }
    
    const profile: UserProfile = {
      name,
      teachingInterest
    }
    localStorage.setItem('userProfile', JSON.stringify(profile))
    onSave(profile)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Set Up Your Profile</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">What you want to teach</label>
            <input
              type="text"
              value={teachingInterest}
              onChange={(e) => setTeachingInterest(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Your teaching interest"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export interface UserProfile {
  name: string
  teachingInterest: string
}
