export {};

declare global {
    interface Window { logError: (message: string) => void; }
}