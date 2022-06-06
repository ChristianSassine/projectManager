import { Injectable } from '@angular/core';
import { HttpHandlerService } from './http-handler.service';
import { ProjectService } from './project.service';
import { ProjectTask } from '../interfaces/project-task';
import { TaskState } from 'src/common/task-state';
import { Project } from '../interfaces/project';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TasksService {
    tasksTODO: ProjectTask[];
    tasksONGOING: ProjectTask[];
    tasksDONE: ProjectTask[];

    currentTask: ProjectTask;
    newTaskSetObservable: Subject<ProjectTask>;

    constructor(private http: HttpHandlerService, private projectService: ProjectService) {
        this.tasksTODO = [];
        this.tasksDONE = [];
        this.tasksONGOING = [];
        this.currentTask = {} as ProjectTask;

        this.newTaskSetObservable = new Subject();
    }

    fetchStateTasks() {
        if (!this.projectService.currentProject) return;
        this.http.getTasksByState(this.projectService.currentProject.id, TaskState.TODO).subscribe((data) => (this.tasksTODO = [...data]));
        this.http.getTasksByState(this.projectService.currentProject.id, TaskState.ONGOING).subscribe((data) => (this.tasksONGOING = [...data]));
        this.http.getTasksByState(this.projectService.currentProject.id, TaskState.DONE).subscribe((data) => (this.tasksDONE = [...data]));
    }

    setCurrentTask(task: ProjectTask) {
        this.currentTask = task;
        this.newTaskSetObservable.next(task);
    }

    uploadTask(task: ProjectTask) {
        if (!this.projectService.currentProject?.id) return;
        this.http.createTask(task, (this.projectService.currentProject as Project).id).subscribe(() => this.fetchStateTasks());
    }

    updateTask(task: ProjectTask) {
        this.http.updateTask(task, (this.projectService.currentProject as Project).id).subscribe(() => {
            this.setCurrentTask(task);
            this.fetchStateTasks();
        });
    }

    updateTaskPosition(previousIndex : number, currentIndex: number, taskId: number){
        if (!this.projectService.currentProject) return;
        this.http.updateTaskPosition(previousIndex, currentIndex, taskId, this.projectService.currentProject.id).subscribe();
    }

    deleteTask(taskId: number) {
        this.http.deleteTask(taskId, (this.projectService.currentProject as Project).id).subscribe(() => {
            if (taskId === this.currentTask.id) this.setCurrentTask({} as ProjectTask);
            this.fetchStateTasks();
        });
    }
}
