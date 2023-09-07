import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesPage } from './pages.page';

// Componentes
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: PagesPage,
    children: [
      {
        path: '',
        redirectTo: '/pages/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'setting',
        component: SettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule { }

/* Import standalone components in Angular*/
/* {
  path: 'home',
  loadComponent: () =>
    import('./home/home.component').then((x) => x.HomeComponent),
}, */