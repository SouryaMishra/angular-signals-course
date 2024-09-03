import {
  afterNextRender,
  Component,
  computed,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private courses = signal<Course[]>([]);
  beginnerCourses = computed(() => {
    return this.courses().filter((course) => course.category === 'BEGINNER');
  });
  advancedCourses = computed(() => {
    return this.courses().filter((course) => course.category === 'ADVANCED');
  });

  coursesService = inject(CoursesService);
  dialog = inject(MatDialog);
  loadingService = inject(LoadingService);

  constructor() {
    afterNextRender(() => {
      console.log('After next render');
    });
    console.log('constructor');
    this.loadAllCourses();
  }

  ngOnInit(): void {
    console.log('on init');
  }

  async loadAllCourses() {
    try {
      this.loadingService.loadingOn();
      const courses = await this.coursesService.loadAllCourses();
      this.courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      console.error(err);
    } finally {
      this.loadingService.loadingOff();
    }
  }

  async onAddCourse() {
    try {
      const addedCourse = await openEditCourseDialog(this.dialog, {
        mode: 'create',
        title: 'Create New Course',
      });
      if (!addedCourse) return;
      this.courses.update((courses) => [...courses, addedCourse]);
    } catch (err) {
      console.error(err);
    }
  }

  onUpdateCourse(updatedCourse: Course) {
    if (!updatedCourse) return;
    this.courses.update((courses) =>
      courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  }

  async onDeleteCourse(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      this.courses.update((courses) =>
        courses.filter((course) => course.id !== courseId)
      );
    } catch (err) {
      console.error(err);
    }
  }
}
