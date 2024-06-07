import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent {
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    message: ['', Validators.required],
  });
  errorMessage: string | null = null;

  async onSubmit() {
    if (this.form.valid) {
      emailjs.init('-zo-CALBj8VPxXKG_');
      try {
        await emailjs.send("service_wwmx4ai", "template_26jkhps", {
          from_name: this.form.value.name,
          message: this.form.value.message,
          reply_to: this.form.value.email,
        });
        alert('Tak for din besked :)');
        this.form.reset();
      } catch (error) {
        console.error('Email sending failed:', error);
        alert('Der opstod en fejl ved afsendelse af din besked. Prøv igen senere.');
      }
    } else {
      alert('Udfyld venligst alle felter korrekt :)');
    }
  }
  


}
