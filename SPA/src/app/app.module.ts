import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GestaoCampusComponent } from './gestao-campus/gestao-campus.component';
import { GestaoFrotaComponent } from './gestao-frota/gestao-frota.component';
import { GestaoPlaneamentoComponent } from './gestao-planeamento/gestao-planeamento.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './gestao-campus/sidebar/sidebar.component';
import { SidebarFrotaComponent } from './gestao-frota/sidebar-frota/sidebar-frota.component';
import { CriarPisoComponent } from './gestao-campus/criar-piso/criar-piso.component';

@NgModule({
  declarations: [
    AppComponent,
    GestaoCampusComponent,
    GestaoFrotaComponent,
    GestaoPlaneamentoComponent,
    DashboardComponent,
    SidebarComponent,
    SidebarFrotaComponent,
    CriarPisoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
