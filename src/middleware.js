import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// In-memory rate limit store: key = userId or IP, value = { count, resetAt }
const rateLimitStore = new Map();

const AGENT_LIMIT = 10; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(key, isAdmin) {
    if (isAdmin) return true; // Admins have no limit

    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetAt) {
        rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return true;
    }

    if (record.count >= AGENT_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const isAdmin = token?.role === "admin";

        // RBAC: agents cannot access admin routes
        if (path.startsWith("/admin") && !isAdmin) {
            return NextResponse.redirect(new URL("/agent/dashboard", req.url));
        }

        // Rate limiting for API routes
        if (path.startsWith("/api/") && !path.startsWith("/api/auth/")) {
            const key = token?.id || req.ip || "anonymous";
            const allowed = checkRateLimit(key, isAdmin);

            if (!allowed) {
                return new NextResponse(
                    JSON.stringify({ error: "Too many requests. Please slow down." }),
                    {
                        status: 429,
                        headers: {
                            "Content-Type": "application/json",
                            "Retry-After": "60",
                        },
                    }
                );
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/admin/:path*",
        "/agent/:path*",
        "/api/lead/:path*",
        "/api/agents/:path*",
        "/api/analytics/:path*",
    ],
};
