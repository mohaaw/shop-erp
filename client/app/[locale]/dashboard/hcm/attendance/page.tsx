import { getAttendanceAction } from '@/app/actions/hcm-actions';
import { AttendanceClient } from './attendance-client';

export default async function AttendancePage() {
    const attendance = await getAttendanceAction();

    return <AttendanceClient attendance={attendance} />;
}
