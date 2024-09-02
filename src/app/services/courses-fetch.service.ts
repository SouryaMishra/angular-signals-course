import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Course } from '../models/course.model';
import { UpsertCourseBody } from '../models/upsert-course.model';

@Injectable({
  providedIn: 'root',
})
export class CoursesServiceWithFetch {
  env = environment;

  async loadAllCourses(): Promise<Course[]> {
    const response = await fetch(`${this.env.apiRoot}/courses`);
    const payload = await response.json();
    return payload.courses as Course[];
  }

  async createCourse(course: UpsertCourseBody): Promise<Course> {
    const response = await fetch(`${this.env.apiRoot}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });
    return response.json();
  }

  async updateCourse(
    courseId: string,
    course: UpsertCourseBody
  ): Promise<Course> {
    const response = await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });
    return response.json();
  }

  async deleteCourse(courseId: string): Promise<Course> {
    const response = await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}
