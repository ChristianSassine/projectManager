import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { TaskComponent } from './components/task/task.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { TaskInfoComponent } from './components/task-info/task-info.component';
import { DeleteTaskComponent } from './components/delete-task/delete-task.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HomeTasksPageComponent } from './pages/home-tasks-page/home-tasks-page.component';
import { HomeOverviewPageComponent } from './pages/home-overview-page/home-overview-page.component';
import { HomeHistoryPageComponent } from './pages/home-history-page/home-history-page.component';

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        LoginComponent,
        RegisterComponent,
        LoginPageComponent,
        ProjectsPageComponent,
        CreateProjectComponent,
        TaskComponent,
        CreateTaskComponent,
        TaskInfoComponent,
        DeleteTaskComponent,
        HomeTasksPageComponent,
        HomeOverviewPageComponent,
        HomeHistoryPageComponent,
    ],
    imports: [
        HttpClientModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        DragDropModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
