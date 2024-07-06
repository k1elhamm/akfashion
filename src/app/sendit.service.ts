import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, merge, mergeMap, of, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SenditService {
  private baseUrl = 'https://murmuring-beyond-41383-400a54003697.herokuapp.com/api'; // Replace with your Heroku app URL

  private deliveryUrl = `${this.baseUrl}/deliveries`;
  private districtsUrl = `${this.baseUrl}/districts`;

  constructor(private http: HttpClient) { }

  submitDelivery(formData: any): Observable<any> {
    return this.http.post(this.deliveryUrl, formData);
  }

  getDistricts(page: number = 1, search: string = ''): Observable<any> {
    return this.http.get(`${this.districtsUrl}?page=${page}&querystring=${search}`);
  }

  getAllDistricts(): Observable<any[]> {
    return this.http.get(`${this.districtsUrl}?page=1`).pipe(
      mergeMap((response: any) => {
        const totalPages = response.last_page;
        const observables = [];
        for (let page = 1; page <= totalPages; page++) {
          observables.push(this.http.get(`${this.districtsUrl}?page=${page}`).pipe(
            map((res: any) => res.data)
          ));
        }
        return observables.length ? merge(...observables) : of([]);
      }),
      toArray(),
      map(districts => [].concat(...districts))
    );
  }



  // private loginUrl = 'https://app.sendit.ma/api/v1/login'; // Replace with actual login endpoint
  // private deliveryUrl = 'https://app.sendit.ma/api/v1/deliveries'; // Replace with actual deliveries endpoint
  // private districtsUrl = 'https://app.sendit.ma/api/v1/districts'; // Replace with actual districts endpoint


  // constructor(private http: HttpClient) { }

  // login(): Observable<any> {
  //   const loginData = {
  //     public_key: '5bc2c1be14df0235cab4087388091d6a',
  //     secret_key: 'G4jKxm9j3NDUwKfaiHMwj0glMFheiKy9'
  //   };
  //   return this.http.post(this.loginUrl, loginData);
  // }

  // submitDelivery(token: string, formData: any): Observable<any> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.post(this.deliveryUrl, formData, { headers });
  // }

  // getDistricts(token: string, page: number = 1, search: string = ''): Observable<any> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.get(`${this.districtsUrl}?page=${page}&querystring=${search}`, { headers });
  // }

  // getAllDistricts(token: string): Observable<any[]> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   return this.http.get(`${this.districtsUrl}?page=1`, { headers }).pipe(
  //     mergeMap((response: any) => {
  //       const totalPages = response.last_page;
  //       const observables = [];
  //       for (let page = 1; page <= totalPages; page++) {
  //         observables.push(this.http.get(`${this.districtsUrl}?page=${page}`, { headers }).pipe(
  //           map((res: any) => res.data)
  //         ));
  //       }
  //       return observables.length ? merge(...observables) : of([]);
  //     }),
  //     toArray(),
  //     map(districts => [].concat(...districts))
  //   );
  // }
}
