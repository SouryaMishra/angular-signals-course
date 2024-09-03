import { Component, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Course } from '../models/course.model';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { CoursesService } from '../services/courses.service';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { CourseCategory } from '../models/course-category.model';
import { firstValueFrom } from 'rxjs';
import { UpsertCourseBody } from '../models/upsert-course.model';
import { UnaryOperator } from '@angular/compiler';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  courseService = inject(CoursesService);
  messagesService = inject(MessagesService);
  dialogRef = inject(MatDialogRef);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);

  form = this.fb.group({
    title: [''],
    longDescription: [''],
    category: [''],
    iconUrl: [''],
  });

  constructor() {
    this.form.patchValue({
      title: this.data?.course?.title,
      longDescription: this.data?.course?.longDescription,
      category: this.data?.course?.category || 'BEGINNER',
      iconUrl: this.data?.course?.iconUrl,
    });
  }

  async onSave() {
    if (this.form.pristine) {
      this.dialogRef.close();
      return;
    }
    const courseProps = this.form.value as UpsertCourseBody;
    if (this.data.mode === 'update') {
      try {
        const updatedCourse = await this.courseService.updateCourse(
          this.data?.course!.id,
          courseProps
        );
        this.dialogRef.close(updatedCourse);
      } catch (err) {
        this.messagesService.showMessage(
          'Error!! Could not update course',
          'error'
        );
      }
    } else if (this.data.mode === 'create') {
      try {
        const newCourse = await this.courseService.createCourse(courseProps);
        this.dialogRef.close(newCourse);
      } catch (err) {
        this.messagesService.showMessage(
          'Error!! Could not add course',
          'error'
        );
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}

export const openEditCourseDialog = async (
  dialog: MatDialog,
  data: EditCourseDialogData
) => {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  config.data = data;

  const closed$ = dialog.open(EditCourseDialogComponent, config).afterClosed();
  return firstValueFrom(closed$);
};
