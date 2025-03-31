import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
    resolve: {
        alias: {
            'govuk': resolve(__dirname, 'node_modules/govuk-frontend/dist/govuk'),
        },
    },
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
