import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSignal = signal<User | null>(null);
  user = this.userSignal.asReadonly();
  isLoggedIn = computed(() => Boolean(this.user()));
  env = environment;
  httpClient = inject(HttpClient);
  router = inject(Router);

  constructor() {
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const user = localStorage.getItem(USER_STORAGE_KEY);
    if (user) this.userSignal.set(JSON.parse(user));
  }

  async login(email: string, password: string): Promise<User> {
    const response$ = this.httpClient.post<User>(`${this.env.apiRoot}/login`, {
      email,
      password,
    });
    const user = await firstValueFrom(response$);
    this.userSignal.set(user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  async logout() {
    this.userSignal.set(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    await this.router.navigateByUrl('/login');
  }
}
