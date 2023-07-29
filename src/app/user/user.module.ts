import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { TareasComponent } from './pages/tareas/tareas.component';
import { VacasComponent } from './pages/vacas/vacas.component';
import RazasComponent from './pages/razas/razas.component';
import { LotesComponent } from './pages/lotes/lotes.component';
import { AlimentosComponent } from './pages/alimentos/alimentos.component';
import { AlimentacionComponent } from './pages/alimentacion/alimentacion.component';
import { ActualizarPesosComponent } from './pages/actualizar-pesos/actualizar-pesos.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { HomeComponent } from './pages/home/home.component';
import { ModalUsuarioComponent } from './modals/modal-usuario/modal-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalVacaComponent } from './modals/modal-vaca/modal-vaca.component';
import { ModalLoteComponent } from './modals/modal-lote/modal-lote.component';
import { ModalRazaComponent } from './modals/modal-raza/modal-raza.component';
import { ModalAlimentoComponent } from './modals/modal-alimento/modal-alimento.component';
import { NombreLotePipe } from './pipes/nombre-lote.pipe';
import { KgPipe } from './pipes/kg.pipe';
import { LbPipe } from './pipes/lb.pipe';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NombreRazaPipe } from './pipes/nombre-raza.pipe';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { NombreAlimentoPipe } from './pipes/nombre-alimento.pipe';
import { PesoLotePipe } from './pipes/peso-lote.pipe';
import { ActualizarPesoPipe } from './pipes/actualizar-peso.pipe';
import { ModalComprasComponent } from './modals/modal-compras/modal-compras.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { FormulacionComponent } from './pages/formulacion/formulacion.component';
import { AgregarDietaComponent } from './pages/agregar-dieta/agregar-dieta.component';
import { AgregarDosisComponent } from './pages/agregar-dosis/agregar-dosis.component';
import { DietasComponent } from './pages/dietas/dietas.component';
import { ContenidoPipe } from './pipes/contenido.pipe';
import { DosificacionComponent } from './pages/dosificacion/dosificacion.component';
import { FormulacionMenuComponent } from './pages/formulacion-menu/formulacion-menu.component';
import { VenderComponent } from './pages/vender/vender.component';
import { ActualizarPesoComponent } from './pages/actualizar-peso/actualizar-peso.component';



@NgModule({
  declarations: [
    UsuarioComponent,
    TareasComponent,
    VacasComponent,
    RazasComponent,
    LotesComponent,
    AlimentosComponent,
    AlimentacionComponent,
    ActualizarPesosComponent,
    ReportesComponent,
    VentasComponent,
    HomeComponent,
    ModalUsuarioComponent,
    ModalVacaComponent,
    ModalLoteComponent,
    ModalRazaComponent,
    ModalAlimentoComponent,
    NombreLotePipe,
    KgPipe,
    LbPipe,
    NombreRazaPipe,
    SnackbarComponent,
    NombreAlimentoPipe,
    PesoLotePipe,
    ActualizarPesoPipe,
    ModalComprasComponent,
    ComprasComponent,
    FormulacionComponent,
    AgregarDietaComponent,
    AgregarDosisComponent,
    DietasComponent,
    ContenidoPipe,
    DosificacionComponent,
    FormulacionMenuComponent,
    VenderComponent,
    ActualizarPesoComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    NgApexchartsModule
  ]
})
export class UserModule { }
