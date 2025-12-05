import { TimesheetForm } from '@/components/projects/timesheet-form';
import { getProjectsAction, getTasksAction } from '@/app/actions/project-actions';
import { getEmployeesAction } from '@/app/actions/employee-actions';

export default async function NewTimesheetPage() {
    const [projects, tasks, employees] = await Promise.all([
        getProjectsAction(),
        getTasksAction(),
        getEmployeesAction(),
    ]);

    return <TimesheetForm projects={projects} tasks={tasks} employees={employees} />;
}
