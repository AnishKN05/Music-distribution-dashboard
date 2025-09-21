'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import type { Track } from '@/lib/mockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function TrackDetails({ params }: { params: { id: string } }) {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch(`/api/tracks/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch track');
        const data: Track = await res.json();
        setTrack(data);
      } catch (e) {
        console.error(e);
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTrack();
  }, [params.id]);

  // Build a mock monthly time series from release date to current month
  const chartData = useMemo(() => {
    if (!track) return [] as Array<{ month: string; streams: number; revenue: number }>;

    const release = new Date(track.releaseDate);
    const now = new Date();

    // Generate up to 12 months including current month
    const months: Date[] = [];
    const cursor = new Date(release.getFullYear(), release.getMonth(), 1);
    while (cursor <= now && months.length < 12) {
      months.push(new Date(cursor));
      cursor.setMonth(cursor.getMonth() + 1);
    }
    if (months.length === 0) months.push(new Date(now.getFullYear(), now.getMonth(), 1));

    // Create a rising curve that sums to totals
    const n = months.length;
    const weights = Array.from({ length: n }, (_, i) => (i + 1));
    const sumWeights = weights.reduce((a, b) => a + b, 0);
    const monthlyStreams = weights.map((w) => (track.streams * w) / sumWeights);
    const monthlyRevenue = weights.map((w) => (track.revenue * w) / sumWeights);

    // Format data for recharts
    return months.map((d, i) => {
      const label = d.toLocaleString(undefined, { month: 'short', year: '2-digit' });
      return {
        month: label,
        streams: Math.round(monthlyStreams[i]),
        revenue: Number(monthlyRevenue[i].toFixed(2)),
      };
    });
  }, [track]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  if (!track)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Track not found</h1>
                <p className="text-gray-600 dark:text-gray-400">The requested track does not exist.</p>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link href="/" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">← Back to Dashboard</Link>
              </div>
            </div>
          </div>
        </header>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Track Details</h1>
              <p className="text-gray-600 dark:text-gray-400">View detailed information about this track</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">← Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{track.title}</h2>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  track.status === 'Published' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                  track.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>{track.status}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Track Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Artist</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{track.artist}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Genre</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{track.genre}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Release Date</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{new Date(track.releaseDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track ID</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">#{track.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Over Time</h3>
                    <div className="h-64 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-600">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 16, right: 24, bottom: 8, left: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
                          <XAxis dataKey="month" stroke="#6b7280" tickMargin={8} />
                          <YAxis yAxisId="left" stroke="#6b7280" tickFormatter={(v) => v.toLocaleString()} />
                          <YAxis yAxisId="right" orientation="right" stroke="#6b7280" tickFormatter={(v) => `$${v}`} />
                          <Tooltip
                            formatter={(value: any, name: string) =>
                              name === 'Streams' ? [Number(value).toLocaleString(), name] : [`$${Number(value).toFixed(2)}`, name]
                            }
                          />
                          <Legend />
                          <Line yAxisId="left" type="monotone" dataKey="streams" name="Streams" stroke="#4f46e5" strokeWidth={2} dot={{ r: 2 }} />
                          <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Streams</p>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{track.streams.toLocaleString()}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">${track.revenue.toFixed(2)}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-600 rounded-lg p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Revenue per Stream</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">${track.streams > 0 ? (track.revenue / track.streams).toFixed(4) : '0.0000'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
