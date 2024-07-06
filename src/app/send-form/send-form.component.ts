import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SenditService } from '../sendit.service';
import { Observable, map, of, startWith } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss']
})
export class SendFormComponent {
  sendForm: FormGroup;
  response: any;
  districts: any[] = [];
  filteredDistricts: Observable<any[]> | undefined = of([]);
  errorMessage: string = ''; // Variable to track errors

  constructor(private fb: FormBuilder, private senditService: SenditService, private snackBar: MatSnackBar) {
    this.sendForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      district_id: ['', Validators.required],
      phone: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchDistricts();
  }

  displayFn(district: any): string {
    return district ? `${district.name} ${district.arabic_name}` : '';
  }
  
  fetchDistricts(): void {
    this.senditService.getAllDistricts().subscribe(
      districts => {
        this.districts = districts;
        this.filteredDistricts = this.sendForm.get('district_id')?.valueChanges
          .pipe(
            startWith(''),
            map(value => this.filterDistricts(value))
          );
      },
      err => {
        console.error('Error occurred while fetching districts:', err);
      }
    );
  }

  filterDistricts(value: string): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.districts.filter(district => 
      (district.name + ' ' + district.arabic_name).toLowerCase().includes(filterValue)
    );
  }

  onSubmit() {
    if (this.sendForm.invalid) {
      return;
    }
    const selectedDistrict = this.sendForm.value.district_id;

    const formData = {
      ...this.sendForm.value,
      district_id: selectedDistrict.id,
      pickup_district_id: 40,
      comment: '',
      products: '',
      allow_open: 1,
      allow_try: 0,
      products_from_stock: 0,
      option_exchange: 0,
      delivery_exchange_id: ''
    };

    this.senditService.submitDelivery(formData).subscribe(
      res => {
        this.response = res;
        this.snackBar.open('Votre commande a été bien enregistrée. / تم تسجيل طلبك بنجاح.', 'Fermer / إغلاق', {
          duration: 3000,
        });
        this.sendForm.reset(); // Clear the form on success
        this.errorMessage = ''; // Clear any previous errors
      },
      err => {
        console.error('Error occurred during delivery submission:', err);
        this.errorMessage = 'Erreur lors de l\'enregistrement de la commande. / حدث خطأ أثناء تسجيل الطلب.';

        // this.snackBar.open('Erreur lors de l\'enregistrement de la commande. / حدث خطأ أثناء تسجيل الطلب.', 'Fermer / إغلاق', {
        //   duration: 3000,
        // });
      }
    );
  }
  
}