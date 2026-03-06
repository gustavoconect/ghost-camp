import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('__session')?.value;
    const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login');
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

    // Protegendo rotas que não sejam a página de login
    if (isAdminPage && !isAuthPage) {
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Se estiver na página de login e já tiver sessão, joga pro dashboard
    if (isAuthPage && session) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
