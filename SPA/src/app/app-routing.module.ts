import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestaoCampusComponent } from './gestao-campus/gestao-campus.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestaoFrotaComponent } from './gestao-frota/gestao-frota.component';
import { GestaoPlaneamentoComponent } from './gestao-planeamento/gestao-planeamento.component';
import { CriarPisoComponent } from './gestao-campus/criar-piso/criar-piso.component';
import { CriarEdificioComponent } from './gestao-campus/criar-edificio/criar-edificio.component';
import { EditarEdificioComponent } from './gestao-campus/editar-edificio/editar-edificio.component';
import { AdicionarDispositivoComponent } from './gestao-frota/adicionar-dispositivo/adicionar-dispositivo.component';
import { CriarElevadorComponent } from './gestao-campus/criar-elevador/criar-elevador.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'gestaoCampus', component: GestaoCampusComponent },
  { path: 'gestaoFrota', component: GestaoFrotaComponent},
  { path: 'gestaoPlaneamento', component: GestaoPlaneamentoComponent},
  { path: 'criarPiso', component: CriarPisoComponent},
  { path: 'criarEdificio', component: CriarEdificioComponent},
  { path: 'editarEdificio', component: EditarEdificioComponent},
  { path: 'criarElevador', component: CriarElevadorComponent},
  { path: 'adicionarDispositivo', component: AdicionarDispositivoComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 

}
