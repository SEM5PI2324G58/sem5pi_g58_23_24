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
    EditarPisoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
