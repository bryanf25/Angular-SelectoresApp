import { TestBed } from '@angular/core/testing';

import { CountriesService } from './countries.service';
import { HttpClientModule } from '@angular/common/http';
import { mockCountry } from 'src/app/Mocks/countryMock';

fdescribe('CountriesService', () => {
  let service: CountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(CountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  fit('should be 5 regions', () => {
// arrange
const regionsSize = service.regions.length

// assert
    expect(regionsSize).toBe(5);
  });

  fit('should call getCountriesByRegion  return an array with smallCountries ', () => {
    // arrange
    // spyOn(service,'getCountriesByRegion').and.returnValue(mockCountry.)
    // assert
      });


});
