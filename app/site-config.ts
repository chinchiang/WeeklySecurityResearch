export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-security-reading-hub.c7126b9d-e01d-4117-8141-f9231c5a6686.chatgpt.site";
export const sitePath = (path: string) => `${BASE_PATH}${path}`;
