export type TrackStatus = 'Published' | 'Pending' | 'Draft';

export type Track = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  releaseDate: string; // ISO date string
  streams: number;
  revenue: number;
  status: TrackStatus;
};

let tracks: Track[] = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'DJ Cool',
    genre: 'Electronic',
    releaseDate: '2023-06-15',
    streams: 150000,
    revenue: 1500.5,
    status: 'Published',
  },
  {
    id: '2',
    title: 'Midnight Blues',
    artist: 'Jazz Master',
    genre: 'Jazz',
    releaseDate: '2023-07-01',
    streams: 75000,
    revenue: 750.25,
    status: 'Published',
  },
  {
    id: '3',
    title: 'Rock Anthem',
    artist: 'The Rockers',
    genre: 'Rock',
    releaseDate: '2023-08-10',
    streams: 200000,
    revenue: 2000.75,
    status: 'Pending',
  },
  {
    id: '4',
    title: 'Chill Beats',
    artist: 'Lo-Fi Master',
    genre: 'Lo-Fi',
    releaseDate: '2023-09-05',
    streams: 50000,
    revenue: 500.0,
    status: 'Draft',
  },
];

export function getTracks(): Track[] {
  return tracks;
}

export function getTrackById(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function addTrack(input: Pick<Track, 'title' | 'artist' | 'genre' | 'releaseDate'>): Track {
  const newTrack: Track = {
    id: (tracks.length + 1).toString(),
    streams: 0,
    revenue: 0,
    status: 'Draft',
    ...input,
  };
  tracks = [...tracks, newTrack];
  return newTrack;
}
