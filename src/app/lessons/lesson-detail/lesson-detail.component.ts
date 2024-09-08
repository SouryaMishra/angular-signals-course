import { Component, inject, input, output } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { LessonsService } from '../../services/lessons.service';
import { MessagesService } from '../../messages/messages.service';

@Component({
  selector: 'lesson-detail',
  standalone: true,
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss',
})
export class LessonDetailComponent {
  lesson = input.required<Lesson | null>();
  cancel = output();
  lessonUpdated = output<Lesson>();
  lessonService = inject(LessonsService);
  messagesService = inject(MessagesService);

  async onSave(description: string) {
    try {
      const updatedLesson = await this.lessonService.updateLesson({
        ...this.lesson()!,
        description,
      });
      this.lessonUpdated.emit(updatedLesson);
    } catch (err) {
      this.messagesService.showMessage(
        'Error!! Could not update lesson',
        'error'
      );
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
