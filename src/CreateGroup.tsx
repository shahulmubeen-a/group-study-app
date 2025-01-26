import React, { useState } from 'react'
import { Check, X } from 'lucide-react'

interface CreateGroupProps {
  onCreate: (group: Group) => void
}

export default function CreateGroup({ onCreate }: CreateGroupProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [limit, setLimit] = useState(2)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Group name is required')
      return
    }
    if (limit < 2 || limit > 15) {
      setError('Group limit must be between 2 and 15')
      return
    }

    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description,
      limit,
      messages: []
    }
    localStorage.setItem('groups', JSON.stringify([newGroup]))
    onCreate(newGroup)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Member Limit (2-15)</label>
          <input
            type="number"
            min={2}
            max={15}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => onCreate({ id: '', name: '', description: '', limit: 2, messages: [] })}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <X className="h-5 w-5 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            <Check className="h-5 w-5 mr-2" />
            Create Group
          </button>
        </div>
      </form>
    </div>
  )
}

interface Group {
  id: string
  name: string
  description: string
  limit: number
  messages: Message[]
}

interface Message {
  id: string
  text: string
  timestamp: number
}
