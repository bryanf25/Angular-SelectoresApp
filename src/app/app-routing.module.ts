import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'selector',
    loadChildren: () => import('./country/country.module').then(m => m.CountryModule)
  },
  {
    path:'**',
    redirectTo: 'selector'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
