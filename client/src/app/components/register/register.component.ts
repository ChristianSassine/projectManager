import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    form: FormGroup;
    title: string = 'User Registration';

    usernameLabel: string = 'Username';
    passwordLabel: string = 'Password';
    emailLabel: string = 'Email';
    usernamePlaceholder: string = 'Ex: Bart';
    passwordPlaceholder: string = 'Ex: 123IloveCookies';
    emailPlaceholder: string = 'Ex: BartCookies@simpsons.com';
    usernameError: string = 'A username is required';
    passwordError: string = 'A password is required';
    emailError: string = "The email isn't a valid format";
    registerButtonText: string = 'Register';

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', Validators.email],
        });
    }

    submit() {
        if (this.form.get('username')?.valid && this.form.get('password')?.valid) {
            //TODO : Handle catch
            this.authService
                .login(this.form.value.username, this.form.value.password)
                .then(() => this.router.navigate(['/home']))
                .catch(() => console.log('error occured'));
        }
    }
}