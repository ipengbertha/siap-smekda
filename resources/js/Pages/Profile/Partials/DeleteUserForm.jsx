import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <div className="bg-navy/[0.03] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4 px-1">
                <span className="w-2 h-2 rounded-full bg-crimson" />
                <h3 className="text-sm font-semibold text-navy">Hapus Akun</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
                <p className="text-sm text-gray-500 mb-4">
                    Setelah akunmu dihapus, semua data terkait akan hilang permanen. Pastikan kamu
                    yakin sebelum melanjutkan.
                </p>

                <DangerButton onClick={() => setConfirmingUserDeletion(true)}>
                    Hapus Akun
                </DangerButton>

                <Modal show={confirmingUserDeletion} onClose={closeModal}>
                    <form onSubmit={deleteUser} className="p-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Yakin mau hapus akun kamu?
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            Semua data terkait akun ini akan hilang permanen. Masukkan password
                            untuk konfirmasi.
                        </p>

                        <div className="mt-6">
                            <InputLabel htmlFor="password" value="Password" className="sr-only" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-3/4"
                                isFocused
                                placeholder="Password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end">
                            <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                            <DangerButton className="ms-3" disabled={processing}>
                                Hapus Akun
                            </DangerButton>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
}