
export { default } from 'next-auth/middleware'
export const config = {
    matcher: [
        // "/",
        "/konsultasi/:path*",
        "/user/:path*",
        "/evidence/:path*",
        "/hama/:path*",
    ]
};