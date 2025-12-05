import { getTimesheetsAction } from '@/app/actions/project-actions';
import { TimesheetsClient } from './timesheets-client';

export default async function TimesheetsPage() {
    const timesheets = await getTimesheetsAction();

    return <TimesheetsClient timesheets={timesheets} />;
}
