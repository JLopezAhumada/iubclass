import { Routes } from '@angular/router';
import { Pedido } from './taller03/pedido';
export const routes: Routes = [
  { path: 'taller03', component: Pedido },
  { path: '', redirectTo: 'taller03', pathMatch: 'full' },
];
