import { SettingsSidebar } from './settings-sidebar';

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-8rem)]">
            {/* Sidebar Navigation */}
            <SettingsSidebar />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                <div className="bg-white dark:bg-secondary-900 rounded-xl border border-secondary-200 dark:border-secondary-800 shadow-sm p-6 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
