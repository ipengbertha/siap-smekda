import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const statusStyles = {
    terkirim: 'bg-gray-100 text-gray-700',
    diverifikasi: 'bg-blue-100 text-blue-700',
    diproses: 'bg-yellow-100 text-yellow-700',
    ditindaklanjuti: 'bg-purple-100 text-purple-700',
    selesai: 'bg-green-100 text-green-700',
    ditolak: 'bg-red-100 text-red-700',
};

export default function Index({ reports }) {
    return (
        <AuthenticatedLayout>
            <Head title="Aduan Saya" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Laporan Saya
                            </h1>
                            <p className="text-sm text-gray-500">
                                Daftar aduan & aspirasi yang sudah kamu kirim.
                            </p>
                        </div>
                        <Link
                            href={route('reports.create')}
                            className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            + Buat Laporan
                        </Link>
                    </div>

                    {reports.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                            Belum ada laporan yang kamu kirim.
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm divide-y">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-xs text-gray-400 font-mono mb-1">
                                            {report.code}
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {report.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {report.category?.name}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                                            statusStyles[report.status] ||
                                            'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        {report.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 