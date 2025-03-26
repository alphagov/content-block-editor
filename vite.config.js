import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        setupFiles: ['./vitest.setup.ts'],
        environment: 'jsdom',
        deps: {
            inline: ['vitest-canvas-mock'],
        },
        threads: false,
        environmentOptions: {
            jsdom: {
                resources: 'usable',
            },
        },
        alias: [
            {
                find: /^monaco-editor$/,
                replacement:
                    __dirname + "/node_modules/monaco-editor/esm/vs/editor/editor.api",
            },
        ]
    }
})
