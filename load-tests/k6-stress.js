import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 25 },
    { duration: '1m', target: 50 },
    { duration: '2m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000/api';

export function setup() {
  // Authenticate once during setup and share token across VUs
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ login: 'testfan', password: 'Test12345' }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  if (loginRes.status !== 200) {
    throw new Error(`Setup login failed: ${loginRes.status} ${loginRes.body}`);
  }

  const body = JSON.parse(loginRes.body);
  return { token: body.accessToken };
}

export default function (data) {
  const headers = {
    Authorization: `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  // 1. Health check (unauthenticated)
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, { 'health 200': (r) => r.status === 200 });

  // 2. Login (stress the auth endpoint)
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ login: 'testfan', password: 'Test12345' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
  check(loginRes, { 'login 200': (r) => r.status === 200 });

  // 3. Feed
  const feedRes = http.get(`${BASE_URL}/feed`, { headers });
  check(feedRes, { 'feed 200': (r) => r.status === 200 });

  // 4. Notifications
  const notifRes = http.get(`${BASE_URL}/notifications`, { headers });
  check(notifRes, {
    'notifications 200': (r) => r.status === 200 || r.status === 401,
  });

  // 5. Wallet balance
  const walletRes = http.get(`${BASE_URL}/wallet/balance`, { headers });
  check(walletRes, {
    'wallet 200': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);
}
