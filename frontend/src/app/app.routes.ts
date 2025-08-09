import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'course/private',
    redirectTo: 'course/private/1/assignment/1',
    pathMatch: 'full'
  },
  {
    path: 'course/private/:courseId/assignment/:assignmentId',
    loadComponent: () => import('./pages/course/course.component').then(m => m.CourseComponent),
  }
];
