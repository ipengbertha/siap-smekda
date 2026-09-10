import { Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    Megaphone,
    UserCircle2,
    LayoutList,
    SlidersHorizontal,
    Globe,
    ChevronDown,
    Inbox,
    ShieldAlert,
    Users,
    MessageSquare,
    MapPin,
    Tag,
    Cog,
    Settings,
    Bell,
    BarChart3,
    HelpCircle,
    ListChecks,
} from 'lucide-react';

// Item top-level (Dashboard, Sorotan Publik, Profil) — teks SELALU terang (tidak disamarkan),
// beda dari item di dalam grup yang defaultnya redup sampai aktif.
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

// Item di dalam grup — sama seperti NavItem lama: redup, terang cuma saat aktif.
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

// Grup accordion — header-nya SELALU terang (sesuai top-level lain), panah menunjukkan status buka/tutup.
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

export default function AdminSidebar({ current, actions, logoUrl }) {
    // Grup yang lagi berisi halaman aktif otomatis kebuka pas pertama render.
    const [openGroups, setOpenGroups] = useState({
        kelola: current('admin.reports.*') || current('admin.banned-words.*') || current('admin.users.*') || current('admin.responses.*') || current('admin.destinations.*') || current('admin.categories.*'),
        pengaturan: current('admin.system.settings') || current('admin.reports.settings') || current('notification-settings.index'),
        landing: current('admin.landing.*'),
    });

    const toggleGroup = (key) => {
        setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <div className="flex items-center gap-2 px-2 mb-8">
                <img src={logoUrl || '/images/SIAP-SMEKDA.png'} alt="Logo" className="h-9 w-auto" />
            </div>

            <div className="space-y-1 mb-2">
                <TopNavItem href={route('dashboard')} icon={LayoutDashboard} label="Dashboard" active={current('dashboard')} />
                <TopNavItem href={route('sorotan.index')} icon={Megaphone} label="Sorotan Publik" active={current('sorotan.*')} />
            </div>

            <NavGroupAccordion
                icon={LayoutList}
                label="Kelola Sistem"
                isOpen={openGroups.kelola}
                onToggle={() => toggleGroup('kelola')}
            >
                <SubNavItem href={route('admin.reports.index')} icon={Inbox} label="Kelola Aduan" active={current('admin.reports.index') || current('admin.reports.show')} />
                <SubNavItem href={route('admin.banned-words.index')} icon={ShieldAlert} label="Kelola Kata Terlarang" active={current('admin.banned-words.*')} />
                <SubNavItem href={route('admin.users.index')} icon={Users} label="Kelola Pengguna" active={current('admin.users.*')} />
                <SubNavItem href={route('admin.responses.index')} icon={MessageSquare} label="Kelola Tanggapan" active={current('admin.responses.*')} />
                <SubNavItem href={route('admin.destinations.index')} icon={MapPin} label="Kelola Tujuan" active={current('admin.destinations.*')} />
                <SubNavItem href={route('admin.categories.index')} icon={Tag} label="Kelola Kategori" active={current('admin.categories.*')} />
            </NavGroupAccordion>

            <NavGroupAccordion
                icon={SlidersHorizontal}
                label="Pengaturan Sistem"
                isOpen={openGroups.pengaturan}
                onToggle={() => toggleGroup('pengaturan')}
            >
                <SubNavItem href={route('admin.system.settings')} icon={Cog} label="Identitas & Logo" active={current('admin.system.settings')} />
                <SubNavItem href={route('admin.reports.settings')} icon={Settings} label="Pengaturan Aduan" active={current('admin.reports.settings')} />
                <SubNavItem href={route('notification-settings.index')} icon={Bell} label="Pengaturan Notifikasi" active={current('notification-settings.index')} />
                {/* Pengaturan Keamanan menyusul setelah halamannya dibuat */}
            </NavGroupAccordion>

            <NavGroupAccordion
                icon={Globe}
                label="Landing Page"
                isOpen={openGroups.landing}
                onToggle={() => toggleGroup('landing')}
            >
                <SubNavItem href={route('admin.landing.settings')} icon={Settings} label="Umum" active={current('admin.landing.settings')} />
                <SubNavItem href={route('admin.landing.stats')} icon={BarChart3} label="Statistik" active={current('admin.landing.stats')} />
                <SubNavItem href={route('admin.landing.faqs')} icon={HelpCircle} label="FAQ" active={current('admin.landing.faqs')} />
                <SubNavItem href={route('admin.landing.steps')} icon={ListChecks} label="Cara Kerja" active={current('admin.landing.steps')} />
            </NavGroupAccordion>

            <div className="mt-2">
                <TopNavItem href={route('profile.edit')} icon={UserCircle2} label="Profil" active={current('profile.edit')} />
            </div>

            {/* Slot aksi halaman — dulu di topbar, sekarang di bawah sidebar */}
            {actions && (
                <div className="mt-auto pt-4 border-t border-white/10">
                    {actions}
                </div>
            )}
        </>
    );
}