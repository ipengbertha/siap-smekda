import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isAdmin = user.role === 'admin';

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>

                                {/* MENU ADMIN — cuma tampil kalau role admin */}
                                {isAdmin && (
                                    <div className="relative flex items-center">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className={
                                                            (route().current('admin.landing.*')
                                                                ? 'border-indigo-400 text-gray-900'
                                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700') +
                                                            ' inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none'
                                                        }
                                                    >
                                                        Landing Page

                                                        <svg
                                                            className="-me-0.5 ms-1.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link href={route('admin.landing.settings')}>
                                                    Pengaturan Umum
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.landing.stats')}>
                                                    Statistik
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.landing.faqs')}>
                                                    FAQ
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.landing.steps')}>
                                                    Cara Kerja
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                )}

                                {/* MENU KELOLA — cuma tampil kalau role admin */}
                                {isAdmin && (
                                    <div className="relative flex items-center">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className={
                                                            (route().current('admin.reports.*') ||
                                                            route().current('admin.responses.*') ||
                                                            route().current('admin.categories.*') ||
                                                            route().current('admin.destinations.*') ||
                                                            route().current('admin.banned-words.*') ||
                                                            route().current('admin.users.*')
                                                                ? 'border-indigo-400 text-gray-900'
                                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700') +
                                                            ' inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none'
                                                        }
                                                    >
                                                        Kelola

                                                        <svg
                                                            className="-me-0.5 ms-1.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link href={route('admin.reports.index')}>
                                                    Kelola Aduan
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.responses.index')}>
                                                    Kelola Tanggapan
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.categories.index')}>
                                                    Kelola Kategori
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.destinations.index')}>
                                                    Kelola Tujuan
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.banned-words.index')}>
                                                    Kata Terlarang
                                                </Dropdown.Link>
                                                <Dropdown.Link href={route('admin.users.index')}>
                                                    Kelola User
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        {/* MENU ADMIN (mobile) — cuma tampil kalau role admin */}
                        {isAdmin && (
                            <>
                                <div className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Landing Page
                                </div>
                                <ResponsiveNavLink
                                    href={route('admin.landing.settings')}
                                    active={route().current('admin.landing.settings')}
                                >
                                    Pengaturan Umum
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.landing.stats')}
                                    active={route().current('admin.landing.stats')}
                                >
                                    Statistik
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.landing.faqs')}
                                    active={route().current('admin.landing.faqs')}
                                >
                                    FAQ
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.landing.steps')}
                                    active={route().current('admin.landing.steps')}
                                >
                                    Cara Kerja
                                </ResponsiveNavLink>

                                <div className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Kelola
                                </div>
                                <ResponsiveNavLink
                                    href={route('admin.reports.index')}
                                    active={route().current('admin.reports.*')}
                                >
                                    Kelola Aduan
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.responses.index')}
                                    active={route().current('admin.responses.*')}
                                >
                                    Kelola Tanggapan
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.categories.index')}
                                    active={route().current('admin.categories.*')}
                                >
                                    Kelola Kategori
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.destinations.index')}
                                    active={route().current('admin.destinations.*')}
                                >
                                    Kelola Tujuan
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.banned-words.index')}
                                    active={route().current('admin.banned-words.*')}
                                >
                                    Kata Terlarang
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.users.index')}
                                    active={route().current('admin.users.*')}
                                >
                                    Kelola User
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}