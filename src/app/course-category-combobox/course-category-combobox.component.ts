import {
  Component,
  contentChild,
  effect,
  ElementRef,
  input,
  model,
} from '@angular/core';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss',
})
export class CourseCategoryComboboxComponent {
  label = input.required<string>();
  value = model.required<CourseCategory>();
  span = contentChild.required<ElementRef<HTMLSpanElement>>('span');

  constructor() {
    effect(() =>
      console.log('content child', this.span()?.nativeElement.textContent)
    );
  }

  onValueChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.value.set(target.value as CourseCategory);
  }
}
