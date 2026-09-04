import { router, usePage } from '@inertiajs/react';
import { Bell, Inbox, CheckCheck, Megaphone } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';

export default function NotificationBell() {
    const { notifications } = usePage().props;

    // Kalau shared prop belum ada (mis. HandleInertiaRequests belum diupdate), jangan crash.
    const unreadCount = notifications?.unread_count ?? 0;
    const items = notifications?.items ?? [];

    const markRead = (id) => {
        router.patch(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const markAllRead = (e) => {
        e.preventDefault();
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    const handleItemClick = (item) => {
        if (!item.is_broadcast && !item.is_read) {
            markRead(item.id);
        }
        if (item.report_code) {
            router.visit(route('track.show', item.report_code));
        }
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button
                    type="button"
                    className="relative w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy hover:bg-navy/10 transition-colors"
                >
                    <Bell size={17} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-crimson text-white text-[10px] font-semibold flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </Dropdown.Trigger>

            {/* contentClasses GANTI total default ('py-1 bg-white'), bukan ditambah —
                jadi wajib disebutin ulang bg-white di sini, kalau nggak panelnya transparan.
                width="80" sengaja dipasang: Dropdown.jsx cuma ngenalin width="48" (jadi w-48,
                192px) — nilai lain diabaikan (widthClasses jadi kosong), tapi efeknya BAGUS
                buat kita: pembungkus absolute jadi auto shrink-to-fit ngikutin div w-80 di
                bawah, bukan keclip di 192px. Jangan dihapus / jangan ganti ke '48'. */}
            <Dropdown.Content width="80" contentClasses="bg-white p-0 overflow-hidden">
                <div className="w-80 max-w-[90vw]">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-navy/5">
                        <p className="font-semibold text-navy text-sm">Notifikasi</p>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="inline-flex items-center gap-1 text-xs font-medium text-crimson hover:text-crimson-dark transition-colors"
                            >
                                <CheckCheck size={13} /> Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-navy/5">
                        {items.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <Inbox className="mx-auto text-gray-200 mb-2" size={26} />
                                <p className="text-xs text-gray-400">Belum ada notifikasi.</p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-navy/[0.02] transition-colors ${
                                        !item.is_read ? 'bg-crimson/[0.03]' : ''
                                    }`}
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {item.is_broadcast ? (
                                            <Megaphone size={15} className="text-gold" />
                                        ) : (
                                            <span
                                                className={`block w-2 h-2 rounded-full mt-1.5 ${
                                                    item.is_read ? 'bg-gray-200' : 'bg-crimson'
                                                }`}
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`text-sm truncate ${item.is_read ? 'text-navy/70' : 'font-semibold text-navy'}`}>
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                            {item.message}
                                        </p>
                                        <p className="text-[11px] text-gray-400 mt-1">{item.created_at}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </Dropdown.Content>
        </Dropdown>
    );
}