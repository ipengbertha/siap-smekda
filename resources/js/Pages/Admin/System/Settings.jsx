import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { CheckCircle2, Upload, X, ImageOff } from 'lucide-react';

function SectionCard({ label, dot, description, children }) {
    return (
        <div className="bg-navy/[0.03] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4 px-1">
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <h3 className="text-sm font-semibold text-navy">{label}</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
                {description && <p className="text-sm text-gray-500 mb-5">{description}</p>}
                {children}
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-navy/70 mb-1.5">{label}</label>
            {children}
            {error && <p className="mt-1.5 text-xs text-crimson">{error}</p>}
        </div>
    );
}

const inputClass =
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors';

// Uploader gambar generik dipakai untuk Logo SIAP, Logo Sekolah, dan Favicon.
// previewUrl: URL yang sedang tampil (bisa dari file baru yang dipilih, atau file lama dari server).
function ImageUploader({ label, hint, previewUrl, onFileSelect, onRemove, error, shape = 'square' }) {
    const inputRef = useRef(null);

    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

    return (
        <div>
            <p className="text-sm font-medium text-navy mb-1.5">{label}</p>
            <div className="flex items-center gap-4">
                <div
                    className={`w-16 h-16 shrink-0 ${shapeClass} bg-navy/5 border border-navy/10 overflow-hidden flex items-center justify-center`}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt={label} className="w-full h-full object-contain" />
                    ) : (
                        <ImageOff size={20} className="text-navy/25" />
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-gray-400">{hint}</p>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-navy/70 hover:text-navy transition-colors"
                        >
                            <Upload size={12} /> {previewUrl ? 'Ganti' : 'Upload'}
                        </button>
                        {previewUrl && (
                            <button
                                type="button"
                                onClick={onRemove}
                                className="inline-flex items-center gap-1 text-xs font-medium text-crimson hover:text-crimson-dark transition-colors"
                            >
                                <X size={12} /> Hapus
                            </button>
                        )}
                    </div>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && onFileSelect(e.target.files[0])}
                    className="hidden"
                />
            </div>
            {error && <p className="mt-1.5 text-xs text-crimson">{error}</p>}
        </div>
    );
}

export default function Settings({ settings }) {
    // Preview lokal (blob URL) untuk masing-masing gambar yang baru dipilih user,
    // sebelum benar-benar diupload. null berarti "belum ganti, pakai yang lama/tidak ada".
    const [logoSiapPreview, setLogoSiapPreview] = useState(null);
    const [logoSekolahPreview, setLogoSekolahPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);

    const { data, setData, post, processing, errors, clearErrors, reset, recentlySuccessful } = useForm({
        _method: 'put',
        system_name: settings.system_name,
        school_name: settings.school_name,
        tagline: settings.tagline,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        school_address: settings.school_address,

        logo_siap: null,
        logo_sekolah: null,
        favicon: null,
        remove_logo_siap: false,
        remove_logo_sekolah: false,
        remove_favicon: false,
    });

    const submit = (e) => {
        e.preventDefault();
        // Sama seperti form profil: harus post() + _method spoof + forceFormData
        // karena ada file (logo/favicon) yang ikut dikirim bareng field teks lain.
        post(route('admin.system.settings.update'), { forceFormData: true });
    };

    const cancelChanges = () => {
        // Balikin semua field teks ke nilai awal (bawaan useForm.reset()).
        reset();
        clearErrors();
        // reset() bawaan Inertia nggak tahu soal preview blob URL kita,
        // jadi preview gambar yang sempat dipilih user harus dibersihkan manual.
        setLogoSiapPreview(null);
        setLogoSekolahPreview(null);
        setFaviconPreview(null);
    };

    const makeFileHandlers = (key, setPreview) => ({
        previewUrl: (key === 'logo_siap' && logoSiapPreview) ||
                    (key === 'logo_sekolah' && logoSekolahPreview) ||
                    (key === 'favicon' && faviconPreview) ||
                    settings[`${key}_url`] ||
                    null,
        onFileSelect: (file) => {
            setData((prev) => ({ ...prev, [key]: file, [`remove_${key}`]: false }));
            setPreview(URL.createObjectURL(file));
        },
        onRemove: () => {
            setData((prev) => ({ ...prev, [key]: null, [`remove_${key}`]: true }));
            setPreview(null);
        },
    });

    const logoSiapHandlers = makeFileHandlers('logo_siap', setLogoSiapPreview);
    const logoSekolahHandlers = makeFileHandlers('logo_sekolah', setLogoSekolahPreview);
    const faviconHandlers = makeFileHandlers('favicon', setFaviconPreview);

    return (
        <AdminLayout
            title="Pengaturan Sistem"
            subtitle="Identitas sistem: nama, logo, favicon, dan info kontak sekolah."
        >
            <Head title="Pengaturan Sistem" />

            <form onSubmit={submit} className="space-y-5 max-w-4xl">
                {/* SECTION: IDENTITAS */}
                <SectionCard label="Identitas Sistem" dot="bg-crimson">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Nama Sistem" error={errors.system_name}>
                            <input
                                type="text"
                                value={data.system_name}
                                onChange={(e) => setData('system_name', e.target.value)}
                                className={inputClass}
                                placeholder="SIAP SMEKDA"
                            />
                        </Field>

                        <Field label="Nama Sekolah" error={errors.school_name}>
                            <input
                                type="text"
                                value={data.school_name}
                                onChange={(e) => setData('school_name', e.target.value)}
                                className={inputClass}
                                placeholder="SMK Negeri 2 Surabaya"
                            />
                        </Field>

                        <div className="sm:col-span-2">
                            <Field label="Tagline" error={errors.tagline}>
                                <input
                                    type="text"
                                    value={data.tagline}
                                    onChange={(e) => setData('tagline', e.target.value)}
                                    className={inputClass}
                                    placeholder="Suarakan Aspirasimu, Wujudkan Perubahan."
                                />
                            </Field>
                        </div>
                    </div>
                </SectionCard>

                {/* SECTION: LOGO & FAVICON */}
                <SectionCard
                    label="Logo & Favicon"
                    dot="bg-gold"
                    description="Format JPG/PNG/SVG untuk logo, ICO/PNG untuk favicon. Maksimal 2MB per file."
                >
                    <div className="space-y-5">
                        <ImageUploader label="Logo SIAP" hint="DITAMPILKAN DI SIDEBAR & HEADER ADMIN. Format yang didukung: JPG, JPEG, PNG. Ukuran maksimal 2MB." {...logoSiapHandlers} error={errors.logo_siap} />
                        <ImageUploader label="Logo Sekolah" hint="DITAMPILKAN DI LANDING PAGE & FOOTER. Format yang didukung: JPG, JPEG, PNG. Ukuran maksimal 2MB." {...logoSekolahHandlers} error={errors.logo_sekolah} />
                        <ImageUploader label="Favicon" hint="IKON KECIL DI TAB BROWSER. Format yang didukung: ICO, PNG, JPG, JPEG, SVG. Ukuran maksimal 2MB." shape="circle" {...faviconHandlers} error={errors.favicon} />
                    </div>
                </SectionCard>

                {/* SECTION: KONTAK */}
                <SectionCard label="Kontak & Alamat" dot="bg-purple">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Email Kontak" error={errors.contact_email}>
                            <input
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                className={inputClass}
                                placeholder="info@sekolah.sch.id"
                            />
                        </Field>

                        <Field label="Nomor Kontak" error={errors.contact_phone}>
                            <input
                                type="text"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                                className={inputClass}
                                placeholder="(031) 5xxxxx"
                            />
                        </Field>

                        <div className="sm:col-span-2">
                            <Field label="Alamat Sekolah" error={errors.school_address}>
                                <textarea
                                    rows={2}
                                    value={data.school_address}
                                    onChange={(e) => setData('school_address', e.target.value)}
                                    className={inputClass}
                                />
                            </Field>
                        </div>
                    </div>
                </SectionCard>

                {/* SUBMIT */}
                <div className="flex items-center gap-4 bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                    >
                        Simpan Perubahan
                    </button>
                    <button
                        type="button"
                        onClick={cancelChanges}
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full border border-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        Batalkan Perubahan
                    </button>
                    {recentlySuccessful && (
                        <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                            <CheckCircle2 size={16} />
                            Tersimpan.
                        </span>
                    )}
                </div>
            </form>
        </AdminLayout>
    );
}