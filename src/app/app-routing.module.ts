import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

const routes: Routes =[
  {
    path:'',
    component: LandingComponent
  },
  {
    path:'auth',
    loadChildren:()=> import('./auth/auth.module').then(m=>m.AuthModule),
  },

  {
    path:'user',
    loadChildren:()=> import('./user/user.module').then(m=>m.UserModule),
  },
  {
    path:'**',
    redirectTo:''
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
