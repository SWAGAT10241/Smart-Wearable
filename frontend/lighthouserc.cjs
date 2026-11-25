module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm run preview --port 4173',
      startServerReadyPattern: 'Local:',
      url: ['http://localhost:4173/'],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --headless --disable-gpu',
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.70 }],
        'categories:accessibility': ['error', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.80 }],
        // Allow PWA and HTTPS warnings in local CI preview
        'is-on-https': 'off',
        'service-worker': 'off',
        'apple-touch-icon': 'off',
        'maskable-icon': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
