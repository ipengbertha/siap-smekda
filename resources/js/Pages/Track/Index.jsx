import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';

export default function TrackIndex() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!code.trim()) {
            setError('Masukkan kode aduan terlebih dahulu.');
            return;
        }
        router.get(route('track.show', code.trim().toUpperCase()), {}, {
            onError: () => setError('Kode aduan tidak ditemukan. Periksa kembali kode yang kamu masukkan.'),
        });
    };

    return (
        <div className="min-h-screen bg-[#faf9fc] flex flex-col relative overflow-hidden">
            <Head title="Lacak Aduan - SIAP SMEKDA" />

            {/* Aksen gradasi blur halus di background, konsisten dengan warna brand */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-24 -right-16 w-80 h-80 bg-crimson/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 -left-20 w-72 h-72 bg-purple/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-15%] right-1/4 w-72 h-72 bg-gold/10 rounded-full blur-[100px]" />
            </div>

            <nav className="bg-navy">
                <div className="mx-auto max-w-3xl px-6 py-4">
                    <Link
                        href={route('home')}
                        className="inline-flex items-center gap-1.5 text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors w-fit"
                    >
                        <ArrowLeft size={15} /> Kembali ke Beranda
                    </Link>
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-crimson/10 text-crimson mb-4">
                            <Search size={22} />
                        </div>
                        <h1 className="text-2xl font-bold text-navy">Lacak Aduan</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Masukkan kode aduan yang kamu terima untuk melihat status terkini.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl border border-navy/5 p-6 shadow-[0_10px_40px_-15px_rgba(17,1,46,0.2)]"
                    >
                        <label className="block text-sm font-medium text-navy mb-2">
                            Kode Aduan
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError('');
                            }}
                            placeholder="ADU-2026-00123"
                            className="w-full rounded-lg border-gray-300 uppercase focus:border-crimson focus:ring-crimson"
                            autoFocus
                        />
                        {error && (
                            <p className="text-sm text-crimson mt-2">{error}</p>
                        )}
                        <button
                            type="submit"
                            className="w-full mt-4 bg-crimson text-white font-medium py-3 rounded-lg hover:bg-crimson-dark transition flex items-center justify-center gap-2"
                        >
                            <Search size={18} /> Lacak Sekarang
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}