import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
  
export interface Test {
  countryName: string;
}

export interface Country {
  name: string;
  selected: boolean; // added property for styling purpose
}

export interface TestResult {
  countryName: string;
  testStatus: string;
}
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'GET,  POST, OPTIONS',
      'Access-Control-Allow-Origin': '*'
    })
  }
  
 getAvailableCountries()
    : Observable<HttpResponse<Country[]>> {
      return this.http.get<Country[]>(
        'https://interview.telqtele.com/countries', { observe: 'response' });
    }
  
sendTests(test: Test[])  : Observable<any>{ 
  return this.http.post<Test>('https://interview.telqtele.com/test', test, this.httpOptions);
  }
}



