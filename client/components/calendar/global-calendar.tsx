'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTheme } from 'next-themes';
import { CalendarEvent, updateEventDateAction } from '@/app/actions/calendar-actions';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar);

interface GlobalCalendarProps {
    events: CalendarEvent[];
}

export function GlobalCalendar({ events }: GlobalCalendarProps) {
    const { theme } = useTheme();
    const [, startTransition] = useTransition();

    const onEventDrop = async (args: { event: object, start: string | Date, end: string | Date }) => {
        const { event, start, end } = args;
        const calendarEvent = event as CalendarEvent;

        // Optimistic UI update could happen here if we had local state, 
        // but react-big-calendar is controlled via props usually or local state.
        // For simplicity, we just trigger server action and wait for revalidation.

        startTransition(async () => {
            const result = await updateEventDateAction(
                calendarEvent.id,
                calendarEvent.type,
                new Date(start),
                new Date(end)
            );

            if (result.success) {
                toast.success('Event rescheduled');
            } else {
                toast.error('Failed to reschedule event');
            }
        });
    };

    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = '#3b82f6'; // default blue
        if (event.type === 'leave') backgroundColor = '#ef4444'; // red
        if (event.type === 'project') backgroundColor = '#10b981'; // green
        if (event.type === 'task') backgroundColor = '#f59e0b'; // amber

        return {
            style: {
                backgroundColor,
                borderRadius: '6px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className={cn(
            "h-[calc(100vh-200px)] min-h-[600px] p-4 bg-card rounded-xl border shadow-sm",
            "[&_.rbc-toolbar]:mb-4 [&_.rbc-toolbar]:flex-wrap [&_.rbc-toolbar]:gap-2",
            "[&_.rbc-btn-group]:bg-secondary-100 dark:[&_.rbc-btn-group]:bg-secondary-800 [&_.rbc-btn-group]:rounded-lg [&_.rbc-btn-group]:p-1",
            "[&_.rbc-toolbar_button]:bg-transparent [&_.rbc-toolbar_button]:border-none [&_.rbc-toolbar_button]:text-sm [&_.rbc-toolbar_button]:px-3 [&_.rbc-toolbar_button]:py-1.5 [&_.rbc-toolbar_button]:rounded-md",
            "[&_.rbc-toolbar_button.rbc-active]:bg-background [&_.rbc-toolbar_button.rbc-active]:shadow-sm [&_.rbc-toolbar_button.rbc-active]:text-foreground",
            "[&_.rbc-toolbar_button:hover]:bg-background/50",
            "[&_.rbc-header]:py-3 [&_.rbc-header]:font-medium [&_.rbc-header]:text-muted-foreground [&_.rbc-header]:uppercase [&_.rbc-header]:text-xs [&_.rbc-header]:tracking-wider",
            "[&_.rbc-off-range-bg]:bg-secondary-50/50 dark:[&_.rbc-off-range-bg]:bg-secondary-900/20",
            "[&_.rbc-today]:bg-secondary-50 dark:[&_.rbc-today]:bg-secondary-800/30",
            theme === 'dark' ? 'rbc-dark-mode' : ''
        )}>
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onEventDrop={onEventDrop}
                resizable={false} // Simplify: only creating drop logic for now
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
                defaultView="month"
            />
            {/* Dark mode overrides */}
            <style jsx global>{`
                .rbc-dark-mode .rbc-off-range-bg { background-color: rgba(0,0,0,0.2) !important; }
                .rbc-dark-mode .rbc-off-range { color: #525252; }
                .rbc-dark-mode .rbc-header { border-bottom-color: #262626; }
                .rbc-dark-mode .rbc-month-view, .rbc-dark-mode .rbc-time-view, .rbc-dark-mode .rbc-agenda-view { border-color: #262626; }
                .rbc-dark-mode .rbc-day-bg, .rbc-dark-mode .rbc-month-row, .rbc-dark-mode .rbc-time-header-content { border-left-color: #262626; }
                .rbc-dark-mode .rbc-day-bg + .rbc-day-bg { border-left-color: #262626; }
                .rbc-dark-mode .rbc-month-row + .rbc-month-row { border-top-color: #262626; }
            `}</style>
        </div>
    );
}
