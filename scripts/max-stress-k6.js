import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    max_throughput: {
      executor: "ramping-vus",
      startVUs: 10,
      stages: [
        { duration: "5s", target: 50 },   // Warm-up ramp to 50 concurrent users
        { duration: "15s", target: 200 }, // Full throttle: 200 concurrent users slamming the 4 cores
        { duration: "5s", target: 0 },    // Cool down
      ],
      gracefulRampDown: "2s",
    },
  },
  thresholds: {
    // 95% of requests must complete under 10ms on local M2
    http_req_duration: ["p(95)<10"],
    // Error rate must remain under 0.1%
    http_req_failed: ["rate<0.001"],
  },
};

const URL = __ENV.API_URL || "http://localhost:3000/api/health";

export default function () {
  // Pure throughput: no artificial delay / no sleep()
  const res = http.get(URL);
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}
