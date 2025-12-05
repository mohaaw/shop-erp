import { getTasksAction } from '@/app/actions/project-actions';
import { TasksClient } from './tasks-client';

export default async function TasksPage() {
    const tasks = await getTasksAction();

    return <TasksClient tasks={tasks} />;
}
