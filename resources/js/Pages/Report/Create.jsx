import { useState } from 'react';
import { useForm as useInertiaForm, Head } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import UserLayout from '@/Layouts/UserLayout';
import { reportSchema } from '@/Schemas/reportSchema';
import { Upload, X, FileText, Send, AlertTriangle, Lightbulb } from 'lucide-react';

function SectionCard({ label, dot, children }) {
    return (
        <div className="bg-navy/[0.03] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4 px-1">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <h3 className="text-sm font-semibold text-navy">{label}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">{children}</div>
        </div>
    );
}

function Field({ label, required, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-navy/70 mb-1.5">
                {label} {required && <span className="text-crimson">*</span>}
            </label>
            {children}
            {error && <p className="mt-1.5 text-xs text-crimson">{error}</p>}
        </div>
    );
}

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

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
        <UserLayout
            title="Buat Laporan"
            subtitle="Sampaikan aduan atau aspirasi kamu untuk sekolah."
        >
            <Head title="Buat Laporan" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
                {/* JENIS & KATEGORI */}
                <SectionCard label="Detail Laporan" dot="bg-crimson">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-navy/70 mb-2">
                                Apa yang ingin kamu sampaikan?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'aduan', label: 'Aduan', icon: AlertTriangle },
                                    { value: 'aspirasi', label: 'Aspirasi', icon: Lightbulb },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            setSelectedType(option.value);
                                            setValue('type', option.value);
                                            setData('type', option.value);
                                        }}
                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                                            selectedType === option.value
                                                ? 'border-crimson bg-crimson/10 text-crimson'
                                                : 'border-navy/10 text-navy/50 hover:border-navy/20'
                                        }`}
                                    >
                                        <option.icon size={16} />
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Field label="Kategori" required error={errors.category_id?.message || inertiaErrors.category_id}>
                            <select
                                {...register('category_id')}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Pilih kategori...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Judul" required error={errors.title?.message || inertiaErrors.title}>
                            <input
                                type="text"
                                {...register('title')}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Contoh: Lampu kelas mati"
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Isi Laporan" required error={errors.description?.message || inertiaErrors.description}>
                            <textarea
                                {...register('description')}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={5}
                                placeholder="Jelaskan detail laporanmu di sini..."
                                className={inputClass}
                            />
                        </Field>
                    </div>
                </SectionCard>

                {/* LAMPIRAN */}
                <SectionCard label="Lampiran (opsional, maks 5 file)" dot="bg-gold">
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-navy/10 rounded-xl py-6 cursor-pointer hover:border-crimson/40 hover:bg-crimson/[0.02] transition-colors">
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
                                    className="flex items-center justify-between gap-3 bg-navy/[0.03] rounded-xl px-3.5 py-2.5 text-sm"
                                >
                                    <span className="flex items-center gap-2 min-w-0 text-navy">
                                        <FileText size={15} className="text-navy/40 shrink-0" />
                                        <span className="truncate">{file.name}</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(index)}
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-navy/40 hover:bg-crimson/10 hover:text-crimson transition-colors shrink-0"
                                    >
                                        <X size={14} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </SectionCard>

                {/* IDENTITAS */}
                <SectionCard label="Identitas" dot="bg-purple">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <label
                            className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                                !isAnonymous ? 'border-crimson bg-crimson/10 text-crimson' : 'border-navy/10 text-navy/60 hover:border-navy/20'
                            }`}
                        >
                            <input
                                type="radio"
                                checked={!isAnonymous}
                                onChange={() => setIsAnonymous(false)}
                                className="text-crimson focus:ring-crimson/30"
                            />
                            Kirim dengan identitas
                        </label>
                        <label
                            className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                                isAnonymous ? 'border-crimson bg-crimson/10 text-crimson' : 'border-navy/10 text-navy/60 hover:border-navy/20'
                            }`}
                        >
                            <input
                                type="radio"
                                checked={isAnonymous}
                                onChange={() => setIsAnonymous(true)}
                                className="text-crimson focus:ring-crimson/30"
                            />
                            Kirim secara anonim
                        </label>
                    </div>
                </SectionCard>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full inline-flex items-center justify-center gap-2 bg-crimson text-white font-semibold py-3 rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                >
                    <Send size={16} />
                    {processing ? 'Mengirim...' : 'Kirim Laporan'}
                </button>
            </form>
        </UserLayout>
    );
}