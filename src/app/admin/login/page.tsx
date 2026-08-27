'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2, Tent } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });

            router.push('/admin/dashboard');
            router.refresh();
        } catch (err: any) {
            setError('Credenciais inválidas. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center px-5 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                        <Tent className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                    Ghost Camp Admin
                </h1>
                <p className="text-center text-sm text-slate-400 mb-10">
                    Acesso restrito à área de gestão
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-zinc-950 border border-zinc-800 py-8 sm:py-10 px-6 sm:px-10 rounded-3xl shadow-2xl">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-300 mb-2">
                                Email / Usuário
                            </label>
                            <input
                                id="admin-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3.5 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-base min-h-[48px]"
                                placeholder="admin@ghostcamp.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-300 mb-2">
                                Senha
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3.5 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-base min-h-[48px]"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="text-red-400 text-sm text-center font-medium bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-3 py-3.5 px-6 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/30 min-h-[52px] cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Autenticando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
