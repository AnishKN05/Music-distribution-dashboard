'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function UploadTrack() {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    releaseDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Simple auth guard
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, []);

  const genres = [
    'Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical',
    'Country', 'R&B', 'Reggae', 'Blues', 'Folk', 'Punk', 'Metal',
    'Alternative', 'Indie', 'Lo-Fi', 'House', 'Techno', 'Ambient'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => { window.location.href = '/'; }, 1200);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to upload track');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Track Uploaded Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload New Track</h1>
              <p className="text-gray-600 dark:text-gray-400">Add a new track to your distribution catalog</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">← Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4 text-red-800 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Track Title *</label>
                  <input id="title" name="title" required value={formData.title} onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"/>
                </div>

                <div>
                  <label htmlFor="artist" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Artist Name *</label>
                  <input id="artist" name="artist" required value={formData.artist} onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"/>
                </div>

                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Genre *</label>
                  <select id="genre" name="genre" required value={formData.genre} onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
                    <option value="">Select a genre</option>
                    {genres.map((g) => (<option key={g} value={g}>{g}</option>))}
                  </select>
                </div>

                <div>
                  <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Release Date *</label>
                  <input id="releaseDate" name="releaseDate" type="date" required value={formData.releaseDate} onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"/>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">File Upload (Mock)</h3>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <div className="text-gray-400 text-4xl mb-2">🎵</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">This is a mock upload form. No actual file upload is implemented.</p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Link href="/" className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</Link>
                <button type="submit" disabled={loading}
                  className="bg-indigo-600 py-2 px-4 rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                  {loading ? 'Uploading…' : 'Upload Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
