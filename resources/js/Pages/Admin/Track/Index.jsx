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
        <div className="min-h-screen bg-cream flex flex-col">
            <Head title="Lacak Aduan - SIAP SMEKDA" />

            <nav className="bg-navy">
                <div className="mx-auto max-w-3xl px-6 py-4">
                    <Link href={route('home')} className="text-white text-sm flex items-center gap-1.5 hover:text-marble-light transition w-fit">
                        <ArrowLeft size={16} /> Kembali ke Beranda
                    </Link>
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-navy">Lacak Aduan</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Masukkan kode aduan yang kamu terima untuk melihat status terkini.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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