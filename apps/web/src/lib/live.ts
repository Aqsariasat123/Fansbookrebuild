import { api } from './api';
import type {
  LiveCreatorCard,
  UpcomingLive,
  LiveFilterParams,
  ApiResponse,
} from '@fansbook/shared';

/* ─── Mock Data (Phase 0 fallback when backend is unavailable) ─── */
const MOCK_LIVE_SESSIONS: LiveCreatorCard[] = [
  {
    id: 'live-1',
    creatorId: '1',
    username: 'sophia_art',
    displayName: 'Sophia Martinez',
    avatar: '/images/creators/creator1.webp',
    category: 'Artist',
    viewerCount: 1243,
    title: 'Live Painting Session - Abstract Art',
    startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'live-2',
    creatorId: '6',
    username: 'chef_marco',
    displayName: 'Marco Rossi',
    avatar: '/images/creators/creator6.webp',
    category: 'Chef',
    viewerCount: 876,
    title: 'Making Fresh Pasta from Scratch',
    startedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'live-3',
    creatorId: '2',
    username: 'alex_fitness',
    displayName: 'Alex Thompson',
    avatar: '/images/creators/creator2.webp',
    category: 'Personal Trainer',
    viewerCount: 2100,
    title: 'HIIT Workout - 30 Min Fat Burn',
    startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'live-4',
    creatorId: '5',
    username: 'luna_music',
    displayName: 'Luna Park',
    avatar: '/images/creators/creator5.webp',
    category: 'Musician',
    viewerCount: 3450,
    title: 'Acoustic Set - New Songs Preview',
    startedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'live-5',
    creatorId: '7',
    username: 'emma_art',
    displayName: 'Emma Davis',
    avatar: '/images/creators/creator7.webp',
    category: 'Artist',
    viewerCount: 560,
    title: 'Watercolor Landscapes Tutorial',
    startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'live-6',
    creatorId: '4',
    username: 'jake_comedy',
    displayName: 'Jake Wilson',
    avatar: '/images/creators/creator4.webp',
    category: 'Comedian',
    viewerCount: 1890,
    title: 'Stand-Up Comedy Hour',
    startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

const MOCK_UPCOMING: UpcomingLive[] = [
  {
    id: 'upcoming-1',
    creatorId: '3',
    username: 'mia_model',
    avatar: '/images/creators/creator3.webp',
    title: 'Behind the Scenes - Fashion Week',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'upcoming-2',
    creatorId: '8',
    username: 'carlos_fitness',
    avatar: '/images/creators/creator8.webp',
    title: 'Morning Yoga Flow',
    scheduledAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'upcoming-3',
    creatorId: '5',
    username: 'luna_music',
    avatar: '/images/creators/creator5.webp',
    title: 'Piano Session - Fan Requests',
    scheduledAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  },
];

function filterMockSessions(params?: LiveFilterParams): LiveCreatorCard[] {
  let filtered = [...MOCK_LIVE_SESSIONS];

  if (params?.category) {
    filtered = filtered.filter((s) => s.category === params.category);
  }
  if (params?.sortBy === 'viewers') {
    filtered.sort((a, b) => b.viewerCount - a.viewerCount);
  } else if (params?.sortBy === 'newest') {
    filtered.sort((a, b) => {
      const aTime = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const bTime = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  return filtered;
}

/* ─── API Functions ─── */

export async function getLiveSessionsApi(
  params?: LiveFilterParams,
): Promise<LiveCreatorCard[]> {
  try {
    const query: Record<string, string> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '' && value !== null) {
          query[key] = String(value);
        }
      }
    }

    const { data } = await api.get<ApiResponse<LiveCreatorCard[]>>('/live', {
      params: query,
    });

    if (!data.data) throw new Error('Invalid response');
    return data.data;
  } catch {
    // Fallback to mock data when backend is unavailable (Phase 0)
    return filterMockSessions(params);
  }
}

export async function getUpcomingLivesApi(): Promise<UpcomingLive[]> {
  try {
    const { data } = await api.get<ApiResponse<UpcomingLive[]>>(
      '/live/upcoming',
    );

    if (!data.data) throw new Error('Invalid response');
    return data.data;
  } catch {
    // Fallback to mock data when backend is unavailable (Phase 0)
    return MOCK_UPCOMING;
  }
}
