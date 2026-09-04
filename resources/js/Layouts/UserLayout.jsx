import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import NotificationBell from '@/Components/NotificationBell';
import {
    LayoutDashboard,
    ListChecks,
    Search,
    Menu,
    X,
    ChevronDown,
    Mail,
    Phone,
    MapPin,
    Link2,
} from 'lucide-react';

function NavGroup({ label, children }) {
    return (
        <div className="mb-6">
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                {label}
            </p>
            <div className="space-y-1">{children}</div>
        </div>
    );
}

function NavItem({ href, icon: Icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? 'bg-white/15 text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'
            }`}
        >
            <Icon size={17} strokeWidth={2} />
            {label}
        </Link>
    );
}

function SidebarContent({ current, actions }) {
    return (
        <>
            <div className="flex items-center gap-2 px-2 mb-8">
                <img src="/images/SIAP-SMEKDA.png" alt="SIAP SMEKDA" className="h-9 w-auto" />
            </div>

            <NavGroup label="Menu">
                <NavItem href={route('dashboard')} icon={LayoutDashboard} label="Dashboard" active={current('dashboard')} />
                <NavItem href={route('reports.index')} icon={ListChecks} label="Laporan Saya" active={current('reports.index')} />
                {/* active hanya untuk halaman pencarian (track.index), BUKAN track.* —
                    supaya nggak ikut nyala saat masuk ke detail (track.show) lewat klik baris "Laporan Saya" */}
                <NavItem href={route('track.index')} icon={Search} label="Lacak Aduan Lain" active={current('track.index')} />
            </NavGroup>

            {/* Slot aksi halaman — CTA utama "Buat Aduan" */}
            {actions && (
                <div className="mt-auto pt-4 border-t border-white/10">
                    {actions}
                </div>
            )}
        </>
    );
}

function AccountControl({ user }) {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button type="button" className="flex items-center gap-2.5 rounded-full pl-1.5 pr-3 py-1.5 hover:bg-navy/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center font-semibold text-sm shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden sm:block min-w-0">
                        <p className="text-sm font-medium text-navy truncate leading-none">{user.name}</p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <ChevronDown size={14} className="text-gray-300 shrink-0" />
                </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                <Dropdown.Link href={route('logout')} method="post" as="button">
                    Log Out
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
}

function UserFooter() {
    return (
        <div className="bg-gradient-to-br from-navy via-navy-light to-navy px-6 sm:px-12 py-12">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid md:grid-cols-2 gap-10 pb-10 border-b border-white/10">
                    <div>
                        <img src="/images/SIAP-SMEKDA.png" alt="SIAP SMEKDA" className="h-10 w-auto mb-4" />
                        <p className="text-sm text-white/50 max-w-xs leading-relaxed">
                            Sistem Informasi Aspirasi &amp; Pengaduan &mdash; menjembatani suara warga sekolah menuju perubahan nyata.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Kontak</h4>
                        <div className="space-y-3 text-sm text-white/50">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-gold shrink-0" />
                                <span>info@smekda.sch.id</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-gold shrink-0" />
                                <span>(0517) 21XXX</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                                <span>Jl. Pendidikan No. 1, Daha Selatan, Hulu Sungai Selatan, Kalimantan Selatan</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                    <p className="text-xs text-white/40">
                        &copy; {new Date().getFullYear()} SIAP SMEKDA &mdash; SMK Negeri 1 Daha Selatan.
                    </p>
                    <div className="flex items-center gap-3">
                        <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors">
                            <Link2 size={15} />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors">
                            <Link2 size={15} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UserLayout({ title, subtitle, headerAction, showSearch = true, children }) {
    const user = usePage().props.auth.user;
    const current = (pattern) => route().current(pattern);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
        <div className="min-h-screen bg-crimson p-3 sm:p-6">
            <div className="mx-auto max-w-[1400px] rounded-[28px] bg-gradient-to-br from-white via-white to-[#fff3b0] border border-white shadow-[0_8px_40px_rgba(17,1,46,0.08)] flex min-h-[calc(100vh-3rem)] overflow-hidden">
                {/* Sidebar — desktop */}
                <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-white/10 bg-gradient-to-b from-navy via-navy-light to-navy p-4 relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-30%] w-56 h-56 bg-crimson/25 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] left-[-20%] w-48 h-48 bg-gold/15 rounded-full blur-[80px] pointer-events-none" />
                    <div className="relative flex flex-col flex-1">
                        <SidebarContent current={current} />
                    </div>
                </aside>

                {/* Sidebar — mobile drawer */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div className="absolute inset-0 bg-navy/40" onClick={() => setMobileOpen(false)} />
                        <aside className="absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-navy via-navy-light to-navy p-4 flex flex-col shadow-xl overflow-hidden">
                            <div className="absolute top-[-20%] right-[-30%] w-56 h-56 bg-crimson/25 rounded-full blur-[80px] pointer-events-none" />
                            <button onClick={() => setMobileOpen(false)} className="relative self-end p-2 text-white/50 hover:text-white">
                                <X size={20} />
                            </button>
                            <div className="relative flex flex-col flex-1">
                                <SidebarContent current={current} />
                            </div>
                        </aside>
                    </div>
                )}

                {/* Main column */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Topbar */}
                    <div className="flex items-center gap-4 px-5 sm:px-8 py-5 border-b border-navy/5">
                        <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 text-navy">
                            <Menu size={22} />
                        </button>

                        <div className="min-w-0">
                            <p className="text-xs text-gray-400">Selamat datang,</p>
                            <h1 className="font-sans font-bold text-lg text-navy truncate">{user.name}</h1>
                        </div>

                        {showSearch && (
                            <div className="hidden md:flex items-center gap-2 bg-navy/5 rounded-full px-4 py-2 w-72 ml-4">
                                <Search size={15} className="text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Cari kode aduan..."
                                    className="flex-1 border-0 bg-transparent focus:ring-0 text-sm text-navy placeholder-gray-400 p-0"
                                />
                            </div>
                        )}

                        <div className="ml-auto flex items-center gap-3">
                            <NotificationBell />
                            <AccountControl user={user} />
                        </div>
                    </div>

                    {/* Page heading + content */}
                    <div className="flex-1 px-5 sm:px-8 py-6 overflow-y-auto">
                        {(title || subtitle || headerAction) && (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    {title && <h2 className="font-sans font-extrabold text-2xl text-navy">{title}</h2>}
                                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                                </div>
                                {headerAction && <div className="shrink-0">{headerAction}</div>}
                            </div>
                        )}
                        {children}
                    </div>

                    {/* Footer — dalam card */}
                    <div className="px-5 sm:px-8 py-4 border-t border-navy/5 text-center">
                        <p className="text-xs text-navy/40">
                            &copy; {new Date().getFullYear()} SIAP SMEKDA &middot; Dashboard
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <UserFooter />
        </>
    );
}