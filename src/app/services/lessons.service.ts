import { inject, Injectable } from '@angular/core';
import { Lesson } from '../models/lesson.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GetLessonsResponse } from '../models/get-lessons.response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  env = environment;

  private httpClient = inject(HttpClient);

  async loadLessons(
    config: {
      courseId?: string;
      query?: string;
    } = {}
  ): Promise<Lesson[]> {
    const { courseId, query } = config;
    let params = new HttpParams();
    if (courseId) {
      params = params.set('courseId', courseId);
    }
    if (query) {
      params = params.set('query', query);
    }
    const lesson$ = this.httpClient.get<GetLessonsResponse>(
      `${this.env.apiRoot}/search-lessons`,
      { params }
    );
    const response = await firstValueFrom(lesson$);
    return response.lessons;
  }
}
