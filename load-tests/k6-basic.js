import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api';

export default function () {
  // Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, { 'health 200': (r) => r.status === 200 });

  // Login and get token
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({ login: 'testfan', password: 'Test12345' }), { headers: { 'Content-Type': 'application/json' } });
  check(loginRes, { 'login 200': (r) => r.status === 200 });

  if (loginRes.status === 200) {
    const token = JSON.parse(loginRes.body).accessToken;
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Feed
    const feedRes = http.get(`${BASE_URL}/feed`, { headers });
    check(feedRes, { 'feed 200': (r) => r.status === 200 });

    // Explore
    const exploreRes = http.get(`${BASE_URL}/search?q=test`, { headers });
    check(exploreRes, { 'search 200': (r) => r.status === 200 });
  }

  sleep(1);
}
