import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export type PlaceSearchFormValue = {
  keyword: string;
  location: string;
};

@Component({
  selector: 'app-place-search-form',
  imports: [ReactiveFormsModule],
  templateUrl: './place-search-form.html',
  styleUrl: './place-search-form.scss',
})
export class PlaceSearchForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly search = output<PlaceSearchFormValue>();

  readonly form = this.formBuilder.nonNullable.group({
    keyword: ['', [Validators.required]],
    location: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.search.emit(this.form.getRawValue());
  }
}
