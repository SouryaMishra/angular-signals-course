import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';

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

  async createCourse(course: Omit<Course, 'id'>): Promise<Course> {
    const course$ = this.httpClient.post<Course>(
      `${this.env.apiRoot}/courses`,
      course
    );
    return firstValueFrom(course$);
  }

  async updateCourse(course: Course): Promise<Course> {
    const course$ = this.httpClient.put<Course>(
      `${this.env.apiRoot}/courses/${course.id}`,
      course
    );
    return firstValueFrom(course$);
  }

  async deleteCourse(courseId: string) {
    const response$ = this.httpClient.delete(
      `${this.env.apiRoot}/courses/${courseId}`
    );
    return firstValueFrom(response$);
  }
}
