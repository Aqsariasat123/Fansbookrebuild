import { api } from './api';
import type {
  CreatorCard,
  CreatorsFilterParams,
  CreatorFiltersResponse,
  PaginatedResponse,
  ApiResponse,
} from '@fansbook/shared';

/* ─── Mock Data (Phase 0 fallback when backend is unavailable) ─── */
const MOCK_CREATORS: CreatorCard[] = [
  {
    id: '1',
    username: 'sophia_art',
    displayName: 'Sophia Martinez',
    avatar: '/images/creators/creator1.webp',
    category: 'Artist',
    statusText: 'Creating digital masterpieces',
    country: 'United States',
    gender: 'Female',
    isVerified: true,
    isLive: true,
    isNew: false,
    price: 9.99,
    followersCount: 2450,
  },
  {
    id: '2',
    username: 'alex_fitness',
    displayName: 'Alex Thompson',
    avatar: '/images/creators/creator2.webp',
    category: 'Personal Trainer',
    statusText: 'Get fit with me!',
    country: 'United Kingdom',
    gender: 'Male',
    isVerified: true,
    isLive: false,
    isNew: false,
    price: 14.99,
    followersCount: 1820,
  },
  {
    id: '3',
    username: 'mia_model',
    displayName: 'Mia Chen',
    avatar: '/images/creators/creator3.webp',
    category: 'Model',
    statusText: 'Fashion & lifestyle',
    country: 'Canada',
    gender: 'Female',
    isVerified: true,
    isLive: false,
    isNew: false,
    price: 12.99,
    followersCount: 3100,
  },
  {
    id: '4',
    username: 'jake_comedy',
    displayName: 'Jake Wilson',
    avatar: '/images/creators/creator4.webp',
    category: 'Comedian',
    statusText: 'Making you laugh daily',
    country: 'United States',
    gender: 'Male',
    isVerified: false,
    isLive: false,
    isNew: true,
    price: 4.99,
    followersCount: 580,
  },
  {
    id: '5',
    username: 'luna_music',
    displayName: 'Luna Park',
    avatar: '/images/creators/creator5.webp',
    category: 'Musician',
    statusText: 'Singer-songwriter',
    country: 'South Korea',
    gender: 'Female',
    isVerified: true,
    isLive: false,
    isNew: false,
    price: 7.99,
    followersCount: 4200,
  },
  {
    id: '6',
    username: 'chef_marco',
    displayName: 'Marco Rossi',
    avatar: '/images/creators/creator6.webp',
    category: 'Chef',
    statusText: 'Italian cuisine secrets',
    country: 'Italy',
    gender: 'Male',
    isVerified: false,
    isLive: true,
    isNew: false,
    price: 19.99,
    followersCount: 950,
  },
  {
    id: '7',
    username: 'emma_art',
    displayName: 'Emma Davis',
    avatar: '/images/creators/creator7.webp',
    category: 'Artist',
    statusText: 'Watercolor & oil paintings',
    country: 'Australia',
    gender: 'Female',
    isVerified: true,
    isLive: false,
    isNew: false,
    price: 11.99,
    followersCount: 1670,
  },
  {
    id: '8',
    username: 'carlos_fitness',
    displayName: 'Carlos Rivera',
    avatar: '/images/creators/creator8.webp',
    category: 'Personal Trainer',
    statusText: 'Transform your body',
    country: 'Mexico',
    gender: 'Male',
    isVerified: false,
    isLive: false,
    isNew: true,
    price: null,
    followersCount: 320,
  },
];

const MOCK_FILTERS: CreatorFiltersResponse = {
  genders: ['Female', 'Male', 'Non-binary'],
  countries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Italy', 'South Korea', 'Mexico'],
  categories: ['Artist', 'Model', 'Personal Trainer', 'Comedian', 'Musician', 'Chef'],
  priceRange: { min: 0, max: 50 },
};

function filterMockCreators(params: CreatorsFilterParams): PaginatedResponse<CreatorCard> {
  let filtered = [...MOCK_CREATORS];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.displayName.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q)),
    );
  }
  if (params.gender) {
    filtered = filtered.filter((c) => c.gender === params.gender);
  }
  if (params.country) {
    filtered = filtered.filter((c) => c.country === params.country);
  }
  if (params.priceMin !== undefined) {
    filtered = filtered.filter((c) => c.price !== null && c.price >= params.priceMin!);
  }
  if (params.priceMax !== undefined && params.priceMax > 0) {
    filtered = filtered.filter((c) => c.price !== null && c.price <= params.priceMax!);
  }
  if (params.category) {
    filtered = filtered.filter((c) => c.category === params.category);
  }

  const page = params.page || 1;
  const limit = params.limit || 12;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total: filtered.length,
    page,
    limit,
    hasMore: start + limit < filtered.length,
  };
}

/* ─── API Functions ─── */

export async function getCreatorsApi(
  params: CreatorsFilterParams,
): Promise<PaginatedResponse<CreatorCard>> {
  try {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '' && value !== null) {
        query[key] = String(value);
      }
    }

    const { data } = await api.get<ApiResponse<PaginatedResponse<CreatorCard>>>(
      '/creators',
      { params: query },
    );

    if (!data.data) throw new Error('Invalid response');
    return data.data;
  } catch {
    // Fallback to mock data when backend is unavailable (Phase 0)
    return filterMockCreators(params);
  }
}

export async function getCreatorFiltersApi(): Promise<CreatorFiltersResponse> {
  try {
    const { data } = await api.get<ApiResponse<CreatorFiltersResponse>>(
      '/creators/filters',
    );

    if (!data.data) throw new Error('Invalid response');
    return data.data;
  } catch {
    // Fallback to mock data when backend is unavailable (Phase 0)
    return MOCK_FILTERS;
  }
}
