import { useState } from 'react';
import { useForm as useInertiaForm, Head } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { reportSchema } from '@/Schemas/reportSchema';
import { Upload, X } from 'lucide-react';

export default function Create({ categories }) {
    const [selectedType, setSelectedType] = useState('aduan');
    const [attachments, setAttachments] = useState([]);
    const [isAnonymous, setIsAnonymous] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            type: 'aduan',
            is_anonymous: false,
        },
    });

    // Inertia punya form helper sendiri buat handle submit + file upload + error dari backend
    const { data, setData, post, processing, errors: inertiaErrors } = useInertiaForm({
        type: 'aduan',
        category_id: '',
        title: '',
        description: '',
        is_anonymous: false,
        attachments: [],
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + attachments.length > 5) {
            alert('Maksimal 5 lampiran.');
            return;
        }
        const newAttachments = [...attachments, ...files];
        setAttachments(newAttachments);
        setData('attachments', newAttachments);
    };

    const removeAttachment = (index) => {
        const newAttachments = attachments.filter((_, i) => i !== index);
        setAttachments(newAttachments);
        setData('attachments', newAttachments);
    };

    const onSubmit = (formData) => {
        setData({
            ...data,
            ...formData,
            is_anonymous: isAnonymous,
        });

        post(route('reports.store'), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Buat Laporan" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Buat Laporan
                        </h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Sampaikan aduan atau aspirasi kamu untuk sekolah.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Jenis Laporan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apa yang ingin kamu sampaikan?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'aduan', label: '🚨 Aduan' },
                                        { value: 'aspirasi', label: '💡 Aspirasi' },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                setSelectedType(option.value);
                                                setValue('type', option.value);
                                                setData('type', option.value);
                                            }}
                                            className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition ${
                                                selectedType === option.value
                                                    ? 'border-red-500 bg-red-50 text-red-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori *
                                </label>
                                <select
                                    {...register('category_id')}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                >
                                    <option value="">Pilih kategori...</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {(errors.category_id || inertiaErrors.category_id) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.category_id?.message || inertiaErrors.category_id}
                                    </p>
                                )}
                            </div>

                            {/* Judul */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Judul *
                                </label>
                                <input
                                    type="text"
                                    {...register('title')}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Contoh: Lampu kelas mati"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                />
                                {(errors.title || inertiaErrors.title) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title?.message || inertiaErrors.title}
                                    </p>
                                )}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Isi Laporan *
                                </label>
                                <textarea
                                    {...register('description')}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={5}
                                    placeholder="Jelaskan detail laporanmu di sini..."
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                />
                                {(errors.description || inertiaErrors.description) && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description?.message || inertiaErrors.description}
                                    </p>
                                )}
                            </div>

                            {/* Lampiran */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Lampiran (opsional, maks 5 file)
                                </label>
                                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-6 cursor-pointer hover:border-red-400 transition">
                                    <Upload size={18} className="text-gray-400" />
                                    <span className="text-sm text-gray-500">
                                        Klik untuk upload foto/video
                                    </span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/mp4,video/quicktime"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>

                                {attachments.length > 0 && (
                                    <ul className="mt-3 space-y-2">
                                        {attachments.map((file, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm"
                                            >
                                                <span className="truncate">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(index)}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Identitas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Identitas
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            checked={!isAnonymous}
                                            onChange={() => setIsAnonymous(false)}
                                        />
                                        Kirim dengan identitas
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="radio"
                                            checked={isAnonymous}
                                            onChange={() => setIsAnonymous(true)}
                                        />
                                        Kirim secara anonim
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Laporan'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}