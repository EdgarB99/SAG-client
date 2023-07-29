import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActualizarPesosComponent } from './pages/actualizar-pesos/actualizar-pesos.component';
import { AlimentacionComponent } from './pages/alimentacion/alimentacion.component';
import { AlimentosComponent } from './pages/alimentos/alimentos.component';
import { HomeComponent } from './pages/home/home.component';
import { LotesComponent } from './pages/lotes/lotes.component';
import RazasComponent from './pages/razas/razas.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { TareasComponent } from './pages/tareas/tareas.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { VacasComponent } from './pages/vacas/vacas.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { FormulacionComponent } from './pages/formulacion/formulacion.component';
import { DietasComponent } from './pages/dietas/dietas.component';

import { DosificacionComponent } from './pages/dosificacion/dosificacion.component';
import { FormulacionMenuComponent } from './pages/formulacion-menu/formulacion-menu.component';
import { VenderComponent } from './pages/vender/vender.component';
import { ActualizarPesoComponent } from './pages/actualizar-peso/actualizar-peso.component';

const routes: Routes = [{
  path:':id',
  component:HomeComponent,
  children:[
    {
      path:'usuario',
      component:UsuarioComponent
    },
    {
      path:'tareas',
      component:TareasComponent
    },
    {
      path:'vacas',
      component:VacasComponent
    },
    {
      path:'lotes',
      component:LotesComponent
    },
    {
      path:'razas',
      component:DietasComponent
    },
    {
      path:'compras',
      component:ComprasComponent
    },
    {
      path:'actualizar-pesos',
      component:ActualizarPesosComponent
    },
    {
      path:'actualizar-peso/:id',
      component:ActualizarPesoComponent
    },
    {
      path:'reportes',
      component:ReportesComponent
    },
    {
      path:'vender',
      component:VentasComponent
    },
    {
      path:'vender-vaca/:id',
      component:VenderComponent
    },
    {
      path:'formulacion',
      component:FormulacionMenuComponent,
      children: [
        {
          path:'listado-dietas',
          component: DietasComponent
        },
        {
          path:'registro-dietas',
          component: FormulacionComponent
        },
        {
          path:'registro-dosificacion',
          component: DosificacionComponent
        } 
      ]
    },
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
