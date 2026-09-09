import { Link, useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useRef, useState } from 'react';
import { Camera, X, User as UserIcon } from 'lucide-react';

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

export default function ProfileInfoForm({ mustVerifyEmail, status, user }) {
    const fileInput = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, reset, processing, errors, recentlySuccessful } = useForm({
        _method: 'patch',
        name: user.name ?? '',
        username: user.username ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        photo: null,
        remove_photo: false,
    });

    const currentPhotoUrl = user.photo ? `/storage/${user.photo}` : null;

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData((prev) => ({ ...prev, photo: file, remove_photo: false }));
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleRemovePhoto = () => {
        setData((prev) => ({ ...prev, photo: null, remove_photo: true }));
        setPhotoPreview(null);
        if (fileInput.current) fileInput.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        // Wajib pakai post() (bukan patch()) + _method: 'patch' di data (sudah ada di useForm di atas).
        // Alasan: kalau file ikut dikirim, request harus benar-benar POST (multipart/form-data).
        // PHP tidak otomatis parse body multipart untuk request dengan method asli PUT/PATCH,
        // jadi field lain (name, username, dll) akan kebaca kosong meski sudah diisi di form,
        // dan validasi 'required' di backend akan gagal walau field sebenarnya sudah terisi.
        // forceFormData memastikan Inertia selalu kirim sebagai FormData, bukan JSON.
        post(route('profile.update'), { forceFormData: true });
    };

    const handleCancel = () => {
        reset();
        setPhotoPreview(null);
        if (fileInput.current) fileInput.current.value = '';
    };

    const displayPhoto = photoPreview ?? currentPhotoUrl;

    return (
        <SectionCard label="Informasi Profil" dot="bg-crimson">
            <form onSubmit={submit} className="space-y-5">
                {/* FOTO PROFIL */}
                <div className="flex items-center gap-4">
                    <div className="relative shrink-0 w-16 h-16">
                        <button
                            type="button"
                            onClick={() => fileInput.current?.click()}
                            className="w-16 h-16 rounded-full bg-navy/5 overflow-hidden border border-navy/10 flex items-center justify-center"
                            title="Ganti foto"
                        >
                            {displayPhoto ? (
                                <img src={displayPhoto} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={24} className="text-navy/30" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInput.current?.click()}
                            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-crimson text-white flex items-center justify-center shadow ring-2 ring-white hover:bg-crimson-dark transition-colors"
                            title="Ganti foto"
                        >
                            <Camera size={12} />
                        </button>
                        <input
                            ref={fileInput}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-navy">Foto profil</p>
                        <p className="text-xs text-gray-400 mb-1.5">JPG/PNG, maks 2MB.</p>
                        {displayPhoto && (
                            <button
                                type="button"
                                onClick={handleRemovePhoto}
                                className="inline-flex items-center gap-1 text-xs font-medium text-crimson hover:text-crimson-dark transition-colors"
                            >
                                <X size={12} /> Hapus foto
                            </button>
                        )}
                    </div>
                </div>
                {errors.photo && <p className="text-xs text-crimson -mt-3">{errors.photo}</p>}

                <Field label="Nama" error={errors.name}>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={inputClass}
                        autoComplete="name"
                        required
                    />
                </Field>

                <Field label="Username" error={errors.username}>
                    <input
                        type="text"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        className={inputClass}
                        autoComplete="username"
                        required
                    />
                </Field>

                <Field label="Email" error={errors.email}>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={inputClass}
                        autoComplete="username"
                        required
                    />
                </Field>

                <Field label="Nomor telepon" error={errors.phone}>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className={inputClass}
                        autoComplete="tel"
                        placeholder="08xxxxxxxxxx"
                        required
                    />
                </Field>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-gold/10 rounded-xl p-3.5 text-sm text-navy/70">
                        Email kamu belum diverifikasi.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-medium text-crimson hover:text-crimson-dark underline"
                        >
                            Kirim ulang email verifikasi
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-1.5 text-emerald-600 font-medium">
                                Link verifikasi baru sudah dikirim ke emailmu.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                    >
                        Simpan Perubahan
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 bg-white text-navy text-sm font-semibold rounded-full border border-navy/40 hover:bg-navy/5 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <span className="text-sm text-emerald-600 font-medium">Tersimpan.</span>
                    </Transition>
                </div>
            </form>
        </SectionCard>
    );
}