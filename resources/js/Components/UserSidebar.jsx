import { Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    Megaphone,
    ListChecks,
    Search,
    Bell,
    ChevronDown,
} from 'lucide-react';

// Item top-level (Dashboard, Sorotan Publik) — teks SELALU terang, beda dari item dalam grup.
function TopNavItem({ href, icon: Icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition-colors ${
                active ? 'bg-white/15' : 'hover:bg-white/10'
            }`}
        >
            <Icon size={17} strokeWidth={2} />
            {label}
        </Link>
    );
}

// Item di dalam grup — redup, terang cuma saat aktif.
function SubNavItem({ href, icon: Icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 pl-4 text-sm font-medium transition-colors ${
                active ? 'bg-white/15 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'
            }`}
        >
            <Icon size={16} strokeWidth={2} />
            {label}
        </Link>
    );
}

function NavGroupAccordion({ icon: Icon, label, isOpen, onToggle, children }) {
    return (
        <div className="mb-1">
            <button
                type="button"
                onClick={onToggle}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition-colors ${
                    isOpen ? 'bg-white/10' : 'hover:bg-white/10'
                }`}
            >
                <Icon size={17} strokeWidth={2} />
                <span className="flex-1 text-left">{label}</span>
                <ChevronDown
                    size={15}
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && <div className="mt-1 space-y-1">{children}</div>}
        </div>
    );
}

export default function UserSidebar({ current }) {
    const [openGroups, setOpenGroups] = useState({
        laporan: current('reports.index') || current('track.*'),
        pengaturan: current('notification-settings.index'),
    });

    const toggleGroup = (key) => {
        setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <div className="flex items-center gap-2 px-2 mb-8">
                <img src="/images/SIAP-SMEKDA.png" alt="SIAP SMEKDA" className="h-9 w-auto" />
            </div>

            <div className="space-y-1 mb-2">
                <TopNavItem href={route('dashboard')} icon={LayoutDashboard} label="Dashboard" active={current('dashboard')} />
                <TopNavItem href={route('sorotan.index')} icon={Megaphone} label="Sorotan Publik" active={current('sorotan.*')} />
            </div>

            <NavGroupAccordion
                icon={ListChecks}
                label="Laporan"
                isOpen={openGroups.laporan}
                onToggle={() => toggleGroup('laporan')}
            >
                <SubNavItem href={route('reports.index')} icon={ListChecks} label="Laporan Saya" active={current('reports.index')} />
                {/* active hanya untuk halaman pencarian (track.index), BUKAN track.* —
                    supaya nggak ikut nyala saat masuk ke detail (track.show) lewat klik baris "Laporan Saya" */}
                <SubNavItem href={route('track.index')} icon={Search} label="Lacak Aduan Lain" active={current('track.index')} />
            </NavGroupAccordion>

            <NavGroupAccordion
                icon={Bell}
                label="Pengaturan"
                isOpen={openGroups.pengaturan}
                onToggle={() => toggleGroup('pengaturan')}
            >
                <SubNavItem href={route('notification-settings.index')} icon={Bell} label="Pengaturan Notifikasi" active={current('notification-settings.index')} />
            </NavGroupAccordion>
        </>
    );
}