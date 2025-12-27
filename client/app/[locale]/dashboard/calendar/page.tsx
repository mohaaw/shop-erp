import { getCalendarEventsAction } from '@/app/actions/calendar-actions';
import { GlobalCalendar } from '@/components/calendar/global-calendar';

import { getTranslations } from 'next-intl/server';

export default async function CalendarPage() {
    const events = await getCalendarEventsAction();
    const t = await getTranslations('Common');

    return (
        <div className="flex flex-col h-full space-y-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{t('calendar')}</h2>
                <p className="text-muted-foreground">
                    View and manage tasks, leaves, and project deadlines.
                </p>
            </div>
            <div className="flex-1">
                <GlobalCalendar events={events} />
            </div>
        </div>
    );
}
