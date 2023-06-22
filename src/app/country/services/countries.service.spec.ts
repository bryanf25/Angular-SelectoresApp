import { TestBed } from '@angular/core/testing';

import { CountriesService } from './countries.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockCountry } from 'src/app/Mocks/countryMock';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { of } from 'rxjs';

describe('CountriesService', () => {
  let service: CountriesService;
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    service = TestBed.inject(CountriesService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should be 5 regions', () => {
    // arrange
    const regionsSize = service.regions.length

    // assert
    expect(regionsSize).toBe(5);
  });

  it('should call getCountriesByRegion and return an array with smallCountries ', () => {
    // arrange
    const mockResponse: Country[] = mockCountry.countries
    const initialRegion: Region = service.regions[0]
    const baseUrl = 'https://restcountries.com/v3.1'

    // act
    service.getCountriesByRegion(initialRegion).subscribe(data => {

      // assert
      expect(data).toEqual([
        {
          name: 'Colombia',
          cca3: 'COL',
          borders: [
            "BRA",
            "ECU",
            "PAN",
            "PER",
            "VEN"
          ]
        },
        {
          name: 'Turks and Caicos Islands',
          cca3: 'TCA',
          borders: []
        }
      ])
    })

    // assert
    const request = httpMock.expectOne(`${baseUrl}/region/${initialRegion}?fields=cca3,name,borders`)
    expect(request.request.method).toBe('GET')
    request.flush(mockResponse)

  });

  it('should return a country by alphaCode', () => {
    // arrange
    const mockResponse: Country = mockCountry.country
    const initAlphaCode: string = mockCountry.country.cca3
    const baseUrl = 'https://restcountries.com/v3.1'


    // act
    service.getCountryByAlphaCode(initAlphaCode).subscribe(response => {

      // assert
      expect(
        {
          name: "United States",
          cca3: "USA",
          borders: [
            "CAN",
            "MEX"
          ]
        }
      ).toEqual(response)
    })

    const request = httpMock.expectOne(`${baseUrl}/alpha/${initAlphaCode}?fields=cca3,name,borders`)
    expect(request.request.method).toBe('GET')
    request.flush(mockResponse)
  })


  it('should return an array empty of countries ', (done) => {

    // arrange
    const borders: string[] = []

    // act
    service.getCountryBordersByCodes(borders).subscribe(response => {

      // assert
      expect(response.length).toBe(0)
      done();
    })
    
  })


  it('should return smallcountries by code', () => {
    // arrange
    const mockResponse: Country[] = mockCountry.countries
    const borders: string[] = ['COL', 'USA']
    const baseUrl = 'https://restcountries.com/v3.1'


    // act
    service.getCountryBordersByCodes(borders).subscribe(data => {

      expect(data).toEqual([{
        name: "Colombia",
        cca3: "COL",
        borders: [
            "BRA",
            "ECU",
            "PAN",
            "PER",
            "VEN"
        ]
    },
    {
        name:  "Turks and Caicos Islands",
        cca3: "TCA",
        borders: []
    }])
    })


    const requests = httpMock.match((request) => {
      return request.url.startsWith(`${baseUrl}/alpha/`)
    })

    expect(requests.length).toBe(2)
    requests.forEach((request,index) => {
      request.flush({
        name:{common : mockResponse[index]?.name?.common},
        cca3: mockResponse[index]?.cca3,
        borders:mockResponse[index]?.borders
      })

    });
  })
})
