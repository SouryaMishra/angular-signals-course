import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>();
  updateCourse = output<Course>();
  deleteCourse = output<string>();

  dialog = inject(MatDialog);
  messagesService = inject(MessagesService);

  async onEditCourse(course: Course) {
    try {
      const updatedCourse = await openEditCourseDialog(this.dialog, {
        mode: 'update',
        title: 'Update Existing Course',
        course,
      });
      this.updateCourse.emit(updatedCourse);
    } catch (err) {
      this.messagesService.showMessage(
        'Error!! Could not update course',
        'error'
      );
    }
  }

  onDeleteCourse(courseId: string) {
    this.deleteCourse.emit(courseId);
  }
}
