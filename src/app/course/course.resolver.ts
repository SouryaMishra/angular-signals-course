import { ActivatedRouteSnapshot } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { inject } from '@angular/core';
import { MessagesService } from '../messages/messages.service';

export const courseResolver = async (route: ActivatedRouteSnapshot) => {
  const courseId = route.paramMap.get('courseId');
  if (!courseId) {
    return null;
  }
  const coursesService = inject(CoursesService);
  const messagesService = inject(MessagesService);
  try {
    const course = await coursesService.getCourseById(courseId);
    return course;
  } catch {
    messagesService.showMessage('Error!! Could not load course', 'error');
    return null;
  }
};
