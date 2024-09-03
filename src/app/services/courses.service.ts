import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';
import { UpsertCourseBody } from '../models/upsert-course.model';
import { SkipLoading } from '../loading/skip-loading.httpcontext';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  env = environment;

  httpClient = inject(HttpClient);

  async loadAllCourses(): Promise<Course[]> {
    const courses$ = this.httpClient.get<GetCoursesResponse>(
      `${this.env.apiRoot}/courses`
    );
    const response = await firstValueFrom(courses$);
    return response.courses;
  }

  async createCourse(course: UpsertCourseBody): Promise<Course> {
    const course$ = this.httpClient.post<Course>(
      `${this.env.apiRoot}/courses`,
      course
    );
    return firstValueFrom(course$);
  }

  async updateCourse(
    courseId: string,
    course: UpsertCourseBody
  ): Promise<Course> {
    const course$ = this.httpClient.put<Course>(
      `${this.env.apiRoot}/courses/${courseId}`,
      course
    );
    return firstValueFrom(course$);
  }

  async deleteCourse(courseId: string) {
    const response$ = this.httpClient.delete(
      `${this.env.apiRoot}/courses/${courseId}`,
      {
        context: new HttpContext().set(SkipLoading, true),
      }
    );
    return firstValueFrom(response$);
  }
}
