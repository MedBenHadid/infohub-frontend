import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './../../../store/actions/auth.actions';
import { Router } from '@angular/router';
import { selectUser } from '../../../store/selectors/auth.selectors';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [CardModule,FormsModule,ButtonModule,InputTextModule],
})
export class SignInComponent {
  email: string = '';
  password: string = '';

  constructor(private store: Store, private router: Router) {
    this.store.select(selectUser).subscribe((user) => {
      if (user) {
        this.router.navigate(['/home']);
      }
    });
  }

  signIn() {
    this.store.dispatch(
      AuthActions.signIn({ email: this.email, password: this.password })
    );
  }
}
