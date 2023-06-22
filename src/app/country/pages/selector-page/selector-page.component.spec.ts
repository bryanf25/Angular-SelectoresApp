import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorPageComponent } from './selector-page.component';
import { of } from 'rxjs';
import { CountriesService } from '../../services/countries.service';
import { mockCountry } from 'src/app/Mocks/countryMock';
import { SmallCountry } from '../../interfaces/country.interfaces';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SelectorPageComponent', () => {
  let component: SelectorPageComponent;
  let fixture: ComponentFixture<SelectorPageComponent>;
  let service: CountriesService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      providers: [CountriesService],
      declarations: [SelectorPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectorPageComponent);
    component = fixture.componentInstance;
    service = component.countriesService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change countriesByRegion when region changes', () => {
    // arrange
    const initalRegion: string = 'Europe'
    const finalRegion: string = 'America'
    component.myForm.get('region')?.setValue(initalRegion)
    spyOn(service, 'getCountriesByRegion').and.returnValue(of(mockCountry.smallcountries))


    // act
    component.myForm.get('region')!.setValue(finalRegion)
    const isEmpty = component.countriesByRegion.length === 0

    // Assert
    expect(isEmpty).not.toBeTruthy()
  })



  it('should load 5 elements of regions', () => {
    // arrange
    const regions = component.regions

    // assert
    expect(regions.length).toBe(5)

  })

  it('should show countries select when region has value', () => {
    // Arrange
    const regionSelect: HTMLSelectElement = fixture.nativeElement.querySelector('#region');
    const spy = spyOn(service, 'getCountriesByRegion').and.returnValue(of(mockCountry.smallcountries))

    // act
    // trigger the event change
    regionSelect.dispatchEvent(new Event('change'))
    // notify the changes detection system that was realized a change
    fixture.detectChanges()

    // assert
    const countrySelect: HTMLSelectElement = fixture.nativeElement.querySelector('#country')
    expect(spy).toHaveBeenCalled()
    expect(countrySelect).toBeTruthy()

  })


  it('should show borders select when countries select has value', () => {
    // Arrange
    const initialCountry = 'USA'
    const alphaSpy = spyOn(service, 'getCountryByAlphaCode').and.returnValue(of(mockCountry.smallcountry))
    const bordersSpy = spyOn(service, 'getCountryBordersByCodes').and.returnValue(of(mockCountry.smallcountries))

    // act
    component.myForm.get('country')?.setValue(initialCountry)
    fixture.detectChanges()
    const borderSelect: HTMLSelectElement = fixture.nativeElement.querySelector('#border');

    // assert
    expect(alphaSpy).toHaveBeenCalled()
    expect(bordersSpy).toHaveBeenCalled()
    expect(borderSelect).toBeTruthy()
  })

  it('should non show countries select when region doesnt have a value', () => {
    // Arrange
    component.countriesByRegion = []

    // act
    fixture.detectChanges()
    const countrySelect: HTMLSelectElement = fixture.nativeElement.querySelector('#country');

    // assert
    expect(countrySelect).toBeFalsy()

  })


});
