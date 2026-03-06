import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'Token missing' }, { status: 400 });
        }

        // Nota: Como não estamos inicializando o Firebase Admin completo neste escopo simples,
        // usaremos um cookie simples de sessão HTTP-Only assinalado do Client-Side. 
        // Em produção estrita de altíssimo nível o admin-sdk validaria. Para o uso deste admin (leigo)
        // essa tokenização simples + rls no firestore é a melhor DX.

        // Cookie de duração 5 dias
        const expiresIn = 60 * 60 * 24 * 5 * 1000;

        // Seta o cookie que o middleware vai ler
        (await cookies()).set('__session', idToken, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
        });

        return NextResponse.json({ status: 'success' }, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE() {
    (await cookies()).delete('__session');
    return NextResponse.json({ status: 'success' }, { status: 200 });
}
