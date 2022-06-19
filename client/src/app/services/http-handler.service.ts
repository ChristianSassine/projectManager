import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { TaskState } from 'src/common/task-state';
import { environment } from 'src/environments/environment';
import { HistoryLog } from '../interfaces/history-log';
import { Project } from '../interfaces/project';
import { ProjectTask } from '../interfaces/project-task';
import { TasksStats } from '../interfaces/tasks-stats';

export function tapOnSubscribe<T>(callback: () => void) {
    return (source: Observable<T>) =>
        of({}).pipe(
            tap(callback),
            switchMap(() => source),
        );
}

@Injectable({
    providedIn: 'root',
})
export class HttpHandlerService {
    constructor(private readonly http: HttpClient) {}

    private baseUrl = environment.serverUrl;

    private chainAfterAuth<T>(observable: Observable<T>): Observable<T> {
        return this.validateAuth().pipe(mergeMap(() => observable));
    }
    // Authentication requests
    loginRequest(username: string, password: string): Observable<{}> {
        return this.http.post(`${this.baseUrl}/auth/login`, { username, password }, { withCredentials: true });
    }

    logoutRequest(): Observable<unknown> {
        return this.http.get<unknown>(`${this.baseUrl}/auth/logout`, { withCredentials: true });
    }

    validateAuth(): Observable<unknown> {
        return this.http.get<unknown>(`${this.baseUrl}/auth/validate`, { withCredentials: true }).pipe(catchError((_) => this.refreshAuth()));
    }

    refreshAuth(): Observable<string> {
        return this.http.get<string>(`${this.baseUrl}/auth/refresh`, { withCredentials: true });
    }

    createAccountRequest(username: string, email: string, password: string): Observable<{}> {
        return this.http.post(`${this.baseUrl}/auth/create`, { username, email, password }, { withCredentials: true });
    }

    fetchUsername(): Observable<string> {
        return this.http.get<string>(`${this.baseUrl}/auth/user`, { withCredentials: true });
    }

    // Project requests
    createProjectRequest(title: string, password: string): Observable<Project> {
        return this.chainAfterAuth(this.http.post<Project>(`${this.baseUrl}/data/project`, { title, password }, { withCredentials: true }));
    }

    joinProjectRequest(id: number, password: string): Observable<Project> {
        return this.chainAfterAuth(this.http.post<Project>(`${this.baseUrl}/data/project/join`, { id, password }, { withCredentials: true }));
    }

    deleteProjectRequest(projectId: number): Observable<unknown> {
        return this.chainAfterAuth(this.http.delete<unknown>(`${this.baseUrl}/data/project/${projectId}`, { withCredentials: true }));
    }

    getAllProjects(): Observable<Project[]> {
        return this.chainAfterAuth(this.http.get<Project[]>(`${this.baseUrl}/data/projects`, { withCredentials: true }));
    }

    // Tasks requests
    getAllTasks(projectId: number): Observable<ProjectTask[]> {
        return this.chainAfterAuth(this.http.get<ProjectTask[]>(`${this.baseUrl}/data/project/${projectId}/tasks`, { withCredentials: true }));
    }

    getRecentTasks(projectId: number, limit: number = 5): Observable<ProjectTask[]> {
        return this.chainAfterAuth(
            this.http.get<ProjectTask[]>(`${this.baseUrl}/data/project/${projectId}/tasks?limit=${limit}`, { withCredentials: true }),
        );
    }

    getTasksStats(projectId: number): Observable<TasksStats> {
        return this.chainAfterAuth(this.http.get<TasksStats>(`${this.baseUrl}/data/project/${projectId}/tasks/stats`, { withCredentials: true }));
    }

    getTasksByState(projectId: number, state: string): Observable<ProjectTask[]> {
        return this.chainAfterAuth(
            this.http.get<ProjectTask[]>(`${this.baseUrl}/data/project/${projectId}/tasks?state=${state}`, { withCredentials: true }),
        );
    }

    createTask(task: ProjectTask, projectId: number) {
        return this.chainAfterAuth(this.http.post<ProjectTask[]>(`${this.baseUrl}/data/project/${projectId}/task`, task, { withCredentials: true }));
    }

    updateTask(task: ProjectTask, projectId: number) {
        return this.chainAfterAuth(this.http.put<unknown>(`${this.baseUrl}/data/project/${projectId}/task`, task, { withCredentials: true }));
    }

    updateTaskPosition(previousIndex: number, currentIndex: number, taskId: number, projectId: number) {
        return this.chainAfterAuth(
            this.http.patch<unknown>(
                `${this.baseUrl}/data/project/${projectId}/task/position`,
                { previousIndex, currentIndex, taskId },
                { withCredentials: true },
            ),
        );
    }

    updateTaskState(newState: TaskState, currentIndex: number, taskId: number, projectId: number) {
        return this.chainAfterAuth(
            this.http.patch<unknown>(
                `${this.baseUrl}/data/project/${projectId}/task/state`,
                { newState, currentIndex, taskId },
                { withCredentials: true },
            ),
        );
    }

    deleteTask(taskId: number, projectId: number) {
        return this.chainAfterAuth(
            this.http.delete<unknown>(`${this.baseUrl}/data/project/${projectId}/task?id=${taskId}`, { withCredentials: true }),
        );
    }

    // Logs requests
    getAllProjectLogs(projectId: number) {
        return this.chainAfterAuth(this.http.get<HistoryLog[]>(`${this.baseUrl}/data/project/${projectId}/logs`, { withCredentials: true }));
    }

    getRecentProjectLogs(projectId: number, limit: number = 5) {
        return this.chainAfterAuth(
            this.http.get<HistoryLog[]>(`${this.baseUrl}/data/project/${projectId}/logs?limit=${limit}`, { withCredentials: true }),
        );
    }
}
