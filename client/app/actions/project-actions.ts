'use server';

import { projectService, Project, Task } from '@/lib/services/project-service';
import { revalidatePath } from 'next/cache';

// Project actions
export async function getProjectsAction() {
    return projectService.getProjects();
}

export async function getProjectByIdAction(id: string) {
    return projectService.getProjectById(id);
}

export async function createProjectAction(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    const project = projectService.createProject(data);
    revalidatePath('/dashboard/projects');
    return project;
}

// Task actions
export async function getTasksAction() {
    return projectService.getTasks();
}

export async function getTaskByIdAction(id: string) {
    return projectService.getTaskById(id);
}

export async function createTaskAction(data: Omit<Task, 'id' | 'createdAt'>) {
    const task = projectService.createTask(data);
    revalidatePath('/dashboard/projects/tasks');
    return task;
}
