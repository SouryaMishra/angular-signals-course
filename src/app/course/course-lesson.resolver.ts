import { ActivatedRouteSnapshot } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { inject } from '@angular/core';
import { MessagesService } from '../messages/messages.service';
import { LessonsService } from '../services/lessons.service';

export const courseLessonResolver = async (route: ActivatedRouteSnapshot) => {
  const courseId = route.paramMap.get('courseId');
  if (!courseId) {
    return [];
  }
  const lessonsService = inject(LessonsService);
  return lessonsService.loadLessons({ courseId });
};
