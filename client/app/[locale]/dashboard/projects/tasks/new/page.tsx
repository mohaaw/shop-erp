import { TaskForm } from '@/components/projects/task-form';
import { getProjectsAction } from '@/app/actions/project-actions';
import { getEmployeesAction } from '@/app/actions/employee-actions';

export default async function NewTaskPage() {
    const projects = await getProjectsAction();
    const employees = await getEmployeesAction();

    return <TaskForm projects={projects} employees={employees} />;
}
