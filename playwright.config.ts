import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',

    fullyParallel: false,

    workers: 1,

    reporter: 'list',

    use: {
        baseURL: 'http://127.0.0.1:5173',
        trace: 'retain-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],

    webServer: [
        {
            command: 'npm run start:test',
            url: 'http://127.0.0.1:4000/health',
            reuseExistingServer: false,
            timeout: 30_000,
        },
        {
            command: 'npm run dev -- --host 127.0.0.1',
            cwd: './frontend',
            url: 'http://127.0.0.1:5173',
            reuseExistingServer: false,
            timeout: 30_000,
        },
    ],
});
