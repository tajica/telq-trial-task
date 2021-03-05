import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpService, Test, TestResult, Country } from '../http.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  countries: Country[] = [];
  results: TestResult[] = [];
  testList: Test[] = [];

  selectedRows: Country[] = [];

  constructor(private _http: HttpService, private ref: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.getCountriesList();
  }

  ngOnInit(): void {
    setInterval(() => {   // refresh Available Countries every 30s.
      this.getCountriesList(); 
    }, 30000);
  }
  
  getCountriesList(): void {
    
    this._http.getAvailableCountries().subscribe((result) => {
      this.countries = [];
      result.body?.forEach((item) => {
        item.selected = false;
        this.countries.push(item);
      });
      // this.dataSourceCountries = this.countries;
      console.log(this.countries);
      this.ref.markForCheck();
    });
  }

  selectRow(row: Country): void {
    row.selected = !row.selected; // toggle row selection
    let element = document.getElementById(row.name);
    if (element) {
      element.classList.toggle('selected-row'); // change list item style
    }
    if (row.selected) {
      this.selectedRows.push(row);
    } else {
      const index =  this.selectedRows.indexOf(row, 0);
      if (index > -1) {
        this.selectedRows.splice(index, 1);
      }
    }
  }


  sendTestList(): void {
    // transform selected countries list and send request
    this.testList = [];
    this.selectedRows.forEach((row) => {
      this.testList.push({ countryName: row.name });
    });
    // this.getTestResults();  
    this.getFakeTestResults(); // calling fake test, because of the CORS problem
  }

  getTestResults(): void {
    // get backend response and add new test results to Results History
    this.selectedRows = []; //  empty array, so it won't send same countries between 2 getAvailableCountries calls
    this._http.sendTests(this.testList).subscribe((result) => {
      if (result) {
          result.forEach((element: TestResult) => { 
        this.results.push(element);
      });
      }
           
    });
  }

  getFakeStatus(): string { 

    // return fake status for the Fake Test result // made for test
    
    let fakeStatus = Boolean(Math.round(Math.random()));
    if (fakeStatus) {
      return 'Successful';
    } else { 
      return 'Failed'
    }
  }

  getFakeTestResults(): void { 
    // return fake test results  // made for testing, because of the CORS problem
    this.selectedRows = [];  // empty array, so it won't send same countries between 2 getAvailableCountries calls
    this.testList.forEach(test => {
      this.results.push({ countryName: test.countryName, testStatus: this.getFakeStatus() }); 
    });
  }

  clearHistory(): void {
    // clear Result History
    this.results = []; 
  }

}
