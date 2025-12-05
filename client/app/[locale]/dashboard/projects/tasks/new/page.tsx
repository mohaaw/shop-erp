import { TaskForm } from '@/components/projects/task-form';
import { getProjectsAction } from '@/app/actions/project-actions';
import { getEmployeesAction } from '@/app/actions/employee-actions';

export default async function NewTaskPage() {
    const [projects, employees] = await Promise.all([
        getProjectsAction(),
        getEmployeesAction(),
    ]);

    return <TaskForm projects={projects} employees={employees} />;
}
