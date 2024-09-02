import { Course } from './course.model';

export type UpsertCourseBody = Pick<
  Course,
  'title' | 'longDescription' | 'category' | 'iconUrl'
>;
