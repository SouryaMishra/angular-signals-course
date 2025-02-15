import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../messages/messages.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  messagesService = inject(MessagesService);
  authService = inject(AuthService);
  router = inject(Router);
  form = this.fb.group({
    email: [''],
    password: [''],
  });

  async onLogin() {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this.messagesService.showMessage(
          'Please enter both email and password',
          'error'
        );
        return;
      }
      const user = await this.authService.login(email, password);
      if (user) await this.router.navigate(['/home']);
    } catch (err) {
      this.messagesService.showMessage(
        'Login failed. Please try again',
        'error'
      );
    }
  }
}
