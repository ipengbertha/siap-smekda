import { Transition } from '@headlessui/react';
import { useForm, Link } from '@inertiajs/react';
import { useRef, useState, forwardRef } from 'react';
import { Eye, EyeOff, Check, X as XIcon } from 'lucide-react';

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
    'block w-full rounded-xl border-navy/10 bg-navy/[0.02] text-sm text-navy placeholder-gray-400 shadow-sm focus:border-crimson focus:ring-crimson/30 transition-colors pr-10';

// Input password dengan tombol toggle show/hide (ikon mata) terpasang di kanan field.
// Dibungkus forwardRef supaya ref (dipakai untuk auto-focus saat validasi gagal) tetap nyambung ke <input> asli.
const PasswordInput = forwardRef(function PasswordInput({ show, onToggle, ...props }, ref) {
    return (
        <div className="relative">
            <input ref={ref} {...props} type={show ? 'text' : 'password'} className={inputClass} />
            <button
                type="button"
                onClick={onToggle}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-navy/40 hover:text-navy/70 transition-colors"
                title={show ? 'Sembunyikan password' : 'Tampilkan password'}
            >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
});

// Daftar kriteria password (default ala Laravel Password::defaults()).
// Sesuaikan array ini kalau aturan validasi di backend berbeda.
const PASSWORD_CRITERIA = [
    { key: 'length', label: 'Minimal 8 karakter', test: (v) => v.length >= 8 },
    { key: 'upper', label: 'Ada huruf besar (A-Z)', test: (v) => /[A-Z]/.test(v) },
    { key: 'lower', label: 'Ada huruf kecil (a-z)', test: (v) => /[a-z]/.test(v) },
    { key: 'number', label: 'Ada angka (0-9)', test: (v) => /[0-9]/.test(v) },
    { key: 'symbol', label: 'Ada simbol (misal: ! @ # $ %)', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

// Checklist kriteria password, live update tiap ketikan. Hanya tampil begitu user mulai mengetik.
function PasswordCriteria({ value }) {
    if (!value) return null;

    return (
        <ul className="mt-2 space-y-1">
            {PASSWORD_CRITERIA.map(({ key, label, test }) => {
                const met = test(value);
                return (
                    <li
                        key={key}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                            met ? 'text-emerald-600' : 'text-navy/40'
                        }`}
                    >
                        {met ? <Check size={13} /> : <XIcon size={13} />}
                        {label}
                    </li>
                );
            })}
        </ul>
    );
}

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    // State visibilitas terpisah untuk masing-masing field, jadi toggle satu
    // tidak ikut membuka/menutup field yang lain.
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <SectionCard label="Ubah Password" dot="bg-gold">
            <p className="text-sm text-gray-500 mb-5">
                Pastikan pakai password yang panjang dan acak supaya akun anda tetap aman.
            </p>

            <form onSubmit={updatePassword} className="space-y-5">
                <Field label="Password saat ini" error={errors.current_password}>
                    <PasswordInput
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        show={showCurrent}
                        onToggle={() => setShowCurrent((v) => !v)}
                    />
                </Field>

                <Field label="Password baru" error={errors.password}>
                    <PasswordInput
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        show={showNew}
                        onToggle={() => setShowNew((v) => !v)}
                    />
                    <PasswordCriteria value={data.password} />
                </Field>

                <Field label="Konfirmasi password baru" error={errors.password_confirmation}>
                    <PasswordInput
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        show={showConfirm}
                        onToggle={() => setShowConfirm((v) => !v)}
                    />
                </Field>

                <div className="flex justify-end">
                    <Link
                        href={route('password.request')}
                        className="text-xs font-medium text-crimson hover:text-crimson-dark underline"
                    >
                        Lupa password?
                    </Link>
                </div>

                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 bg-crimson text-white text-sm font-semibold rounded-full hover:bg-crimson-dark transition-colors disabled:opacity-50"
                    >
                        Simpan Password
                    </button>
                    <button
                        type="button"
                        onClick={() => reset()}
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