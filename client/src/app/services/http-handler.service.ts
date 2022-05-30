import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../interfaces/project';
import { ProjectTask } from '../interfaces/project-task';

type Callback = () => void;

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

    logoutRequest(): Observable<unknown>{
        return this.http.get<unknown>(`${this.baseUrl}/auth/logout`, { withCredentials: true })
    }

    validateAuth(): Observable<string> {
        return this.http.get<string>(`${this.baseUrl}/auth/validate`, { withCredentials: true })
        .pipe(catchError(_ => this.refreshAuth()));
    }

    refreshAuth(): Observable<string> {
        return this.http.get<string>(`${this.baseUrl}/auth/refresh`, { withCredentials: true })
    }

    createAccountRequest(username: string, email: string, password: string): Observable<{}> {
        return this.http.post(`${this.baseUrl}/auth/create`, { username, email, password }, { withCredentials: true });
    }

    // Project and tasks handling requests
    createProjectRequest(title: string): Observable<Project> {
        return this.chainAfterAuth(this.http.post<Project>(`${this.baseUrl}/data/project`, { title }, { withCredentials: true }));
    }

    getAllProjects(): Observable<Project[]> {
        return this.chainAfterAuth(this.http.get<Project[]>(`${environment.serverUrl}/data/projects`, { withCredentials: true }));
    }

    getAllTasks(projectId: number): Observable<ProjectTask[]> {
        return this.chainAfterAuth(this.http.get<ProjectTask[]>(`${environment.serverUrl}/data/project/${projectId}/tasks`, { withCredentials: true }));
    }

    // TODO : implement refresh token
    // refreshToken(): Observable<{}>{
    //     return this.http.get(`${this.baseUrl}/auth/refresh`, { withCredentials: true });
    // }
}
