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
    loadComponent: () => import('./pages/course-list/course-list.component').then(m => m.CourseListComponent)
  },
  {
    path: 'course/private/:courseId',
    loadComponent: () => import('./pages/course/course.component').then(m => m.CourseComponent)
  },
  {
    path: 'course/private/:courseId/assignment/:assignmentId',
    loadComponent: () => import('./pages/assignment/assigment.component').then(m => m.AssignmentComponent),
  }
];
