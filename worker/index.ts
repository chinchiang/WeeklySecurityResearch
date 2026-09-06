/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

// Baseline security headers applied to every response. `script-src` AND
// `default-src` are deliberately absent: the React Server Components payload
// and the client bootstrap (`import("/assets/...")`) ship as inline scripts,
// and `default-src` is the fallback for `script-src`, so either directive
// without a nonce blocks hydration entirely. Moving to a nonce-based policy
// is tracked in README「安全基準」. The directives below add baseline
// protection without touching script execution.
const CONTENT_SECURITY_POLICY = [
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "img-src 'self' data: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
].join("; ");

function withSecurityHeaders(response: Response, isSecure: boolean): Response {
  const secured = new Response(response.body, response);

  secured.headers.set("x-content-type-options", "nosniff");
  secured.headers.set("x-frame-options", "DENY");
  secured.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  secured.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  // The image optimizer sets its own, stricter policy for image payloads.
  if (!secured.headers.has("content-security-policy")) {
    secured.headers.set("content-security-policy", CONTENT_SECURITY_POLICY);
  }
  if (isSecure) {
    secured.headers.set("strict-transport-security", "max-age=31536000; includeSubDomains");
  }

  return secured;
}

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const isSecure = url.protocol === "https:";

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const imageResponse = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(imageResponse, isSecure);
    }

    return withSecurityHeaders(await handler.fetch(request, env, ctx), isSecure);
  },
};

export default worker;
