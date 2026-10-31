module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm exec vite preview --host 127.0.0.1 --port 4173',
      startServerReadyPattern: 'Local:',
      url: [
        'http://127.0.0.1:4173/overview',
        'http://127.0.0.1:4173/appointments',
        'http://127.0.0.1:4173/medications',
        'http://127.0.0.1:4173/messages',
        'http://127.0.0.1:4173/health-records',
        'http://127.0.0.1:4173/care-team',
        'http://127.0.0.1:4173/preferences',
      ],
      numberOfRuns: 1,
      settings: {
        onlyCategories: ['accessibility'],
      },
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', {minScore: 0.9}],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports',
    },
  },
}
