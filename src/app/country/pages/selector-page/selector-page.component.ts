import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  public countriesByRegion: SmallCountry[] = [];
  public borders : SmallCountry[] = []

  constructor(
    private fb: FormBuilder,
    public countriesService: CountriesService
  ) { }


  ngOnInit(): void {

    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions
  }


  onRegionChanged(): void {
    this.myForm.get('region')?.valueChanges
      .pipe(
        tap(() => {
          // se puede ubicar en elcon el susbcribe pero es mas readable ubicarlo en el tap 
          // ya que se puede notar el orden de ejecucion
          // el impacto es el mismo inicializar el contry en ''
          this.myForm.get('country')?.setValue('')
          this.borders = []
        }),
        switchMap(region => this.countriesService.getCountriesByRegion(region))
      )
      .subscribe(countries => {
        this.countriesByRegion = countries
        // console.log(this.countriesByRegion)
      })
  }

  onCountryChanged(): void {
    this.myForm.get('country')?.valueChanges
      .pipe(
        tap(() => {
          // se puede ubicar en el con el susbcribe pero es mas readable ubicarlo en el tap 
          // ya que se puede notar el orden de ejecucion
          // el impacto es el mismo inicializar el border en ''
          this.myForm.get('border')?.setValue('')
        }),
        filter((value: string) => value.length > 0),
        switchMap(alphacode => this.countriesService.getCountryByAlphaCode(alphacode)),
        switchMap(country => this.countriesService.getCountryBordersByCodes(country.borders))
      ).subscribe( countries => {
        this.borders = countries;
      })
      // lo mismo pero con desestructuracion
      // .subscribe(({borders}) => {
      //   this.borders = borders;
      //   console.log(borders)
      //   // this.countriesByRegion = countries
      // })
  }
}
