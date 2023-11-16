import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { GestaoCampusComponent } from './gestao-campus/gestao-campus.component';
import { GestaoFrotaComponent } from './gestao-frota/gestao-frota.component';
import { GestaoPlaneamentoComponent } from './gestao-planeamento/gestao-planeamento.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './gestao-campus/sidebar/sidebar.component';
import { SidebarFrotaComponent } from './gestao-frota/sidebar-frota/sidebar-frota.component';
import { CriarPisoComponent } from './gestao-campus/criar-piso/criar-piso.component';
import { CriarEdificioComponent } from './gestao-campus/criar-edificio/criar-edificio.component';
import { EditarEdificioComponent } from './gestao-campus/editar-edificio/editar-edificio.component';
import { MessageComponent } from './message/message.component';
import { AdicionarDispositivoComponent } from './gestao-frota/adicionar-dispositivo/adicionar-dispositivo.component';
import { CriarTipoRoboComponent } from './gestao-frota/criar-tipo-robo/criar-tipo-robo.component';
import { CriarElevadorComponent } from './gestao-campus/criar-elevador/criar-elevador.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditarPisoComponent } from './gestao-campus/editar-piso/editar-piso.component';
import { Visualizacao3DComponent } from './visualizacao3-d/visualizacao3-d.component';
import { CriarPassagemComponent } from './gestao-campus/criar-passagem/criar-passagem.component';
import { CriarSalaComponent } from './gestao-campus/criar-sala/criar-sala.component';
import { EditarPassagemComponent } from './gestao-campus/editar-passagem/editar-passagem.component';
import { CarregarMapaComponent } from './gestao-campus/carregar-mapa/carregar-mapa.component';
import { ListarEdificiosComponent } from './gestao-campus/listar-edificios/listar-edificios.component';
import { TableModule } from 'primeng/table';
import { ListarPisoComponent } from './gestao-campus/listar-piso/listar-piso.component';
import { EditarElevadorComponent } from './gestao-campus/editar-elevador/editar-elevador.component';
import { ListarDispositivosFrotaComponent } from './gestao-frota/listar-dispositivos-frota/listar-dispositivos-frota.component';


@NgModule({
  declarations: [
    AppComponent,
    GestaoCampusComponent,
    GestaoFrotaComponent,
    GestaoPlaneamentoComponent,
    DashboardComponent,
    SidebarComponent,
    SidebarFrotaComponent,
    CriarPisoComponent,
    CriarEdificioComponent,
    EditarEdificioComponent,
    MessageComponent,
    AdicionarDispositivoComponent,
    CriarTipoRoboComponent,
    MessageComponent,
    CriarElevadorComponent,
    EditarPisoComponent,
    Visualizacao3DComponent,
    CriarPassagemComponent,
    CriarSalaComponent,
    EditarPassagemComponent,
    CarregarMapaComponent,
    ListarEdificiosComponent,
    ListarPisoComponent,
    EditarElevadorComponent,
    ListarDispositivosFrotaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
