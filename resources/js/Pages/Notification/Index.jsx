import UserLayout from '@/Layouts/UserLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Bell, Inbox, CheckCheck, Megaphone } from 'lucide-react';

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap gap-1.5 justify-center py-2">
            {links.map((link, i) => (
                <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true, preserveState: true })}
                    className={`min-w-[2.25rem] px-3 py-1.5 text-sm rounded-full transition-colors ${
                        link.active
                            ? 'bg-crimson text-white'
                            : 'bg-navy/5 text-navy/60 hover:bg-navy/10'
                    } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

export default function Index({ notifications }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';
    const Layout = isAdmin ? AdminLayout : UserLayout;

    const items = notifications.data ?? [];
    const hasUnread = items.some((item) => !item.is_broadcast && !item.is_read);

    const markRead = (id) => {
        router.patch(route('notifications.read', id), {}, { preserveScroll: true });
    };

    const markAllRead = () => {
        router.post(route('notifications.read-all'), {}, { preserveScroll: true });
    };

    const handleItemClick = (item) => {
        if (!item.is_broadcast && !item.is_read) {
            markRead(item.id);
        }
        if (isAdmin && item.report_id) {
            router.visit(route('admin.reports.show', item.report_id));
        } else if (item.report_code) {
            router.visit(route('track.show', item.report_code));
        }
    };

    return (
        <Layout title="Notifikasi" subtitle="Semua pemberitahuan yang pernah kamu terima.">
            <Head title="Notifikasi" />

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-navy/5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center text-navy">
                            <Bell size={16} />
                        </div>
                        <p className="font-semibold text-navy text-sm">
                            {notifications.total} notifikasi
                        </p>
                    </div>
                    {hasUnread && (
                        <button
                            onClick={markAllRead}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-crimson hover:text-crimson-dark transition-colors"
                        >
                            <CheckCheck size={15} /> Tandai semua dibaca
                        </button>
                    )}
                </div>

                <div className="divide-y divide-navy/5">
                    {items.length === 0 ? (
                        <div className="px-5 py-16 text-center">
                            <Inbox className="mx-auto text-gray-200 mb-3" size={32} />
                            <p className="text-sm text-gray-400">Belum ada notifikasi.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className={`w-full text-left px-5 py-4 flex gap-3.5 hover:bg-navy/[0.02] transition-colors ${
                                    !item.is_read ? 'bg-crimson/[0.03]' : ''
                                }`}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {item.is_broadcast ? (
                                        <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center">
                                            <Megaphone size={15} className="text-[#8a6d00]" />
                                        </div>
                                    ) : (
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                                item.is_read ? 'bg-navy/5' : 'bg-crimson/10'
                                            }`}
                                        >
                                            <Bell size={15} className={item.is_read ? 'text-navy/30' : 'text-crimson'} />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm ${item.is_read ? 'text-navy/70' : 'font-semibold text-navy'}`}>
                                            {item.title}
                                        </p>
                                        {!item.is_read && !item.is_broadcast && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-crimson shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{item.message}</p>
                                    <p className="text-xs text-gray-400 mt-1.5">{item.created_at}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            <Pagination links={notifications.links} />
        </Layout>
    );
}
