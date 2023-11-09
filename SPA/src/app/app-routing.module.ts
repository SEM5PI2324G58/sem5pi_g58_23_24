import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestaoCampusComponent } from './gestao-campus/gestao-campus.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestaoFrotaComponent } from './gestao-frota/gestao-frota.component';
import { GestaoPlaneamentoComponent } from './gestao-planeamento/gestao-planeamento.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gestaoCampus', component: GestaoCampusComponent },
  { path: 'gestaoFrota', component: GestaoFrotaComponent},
  { path: 'gestaoPlaneamento', component: GestaoPlaneamentoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 

}
