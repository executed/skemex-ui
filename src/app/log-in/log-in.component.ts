import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  form: FormGroup;
  message: string;
  rememberMe: boolean = false;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
    this.authService.getCsrfToken();
  }

  checkBoxChange(e) {
    this.rememberMe = e.target.checked;
  }

  login() {
    const username = this.form.value.username;
    const password = this.form.value.password;

    if (!this.form.invalid) {
      this.authService.login(username, password, this.rememberMe).subscribe(
        data => {
        },
        error => {
          console.log(error);
          if(error.status === 401) {
            this.message = 'Invalid username or password';
          }
        },
        () => {
          console.log('trying to navigate to "/"');
          this.router.navigate(['/']);
        }
      )
    }
  }
}
