import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CursoComponent } from './components/curso/curso.component';
import { CourseeditComponent } from './components/courseedit/courseedit.component';
import { CourselessonsComponent } from './components/courselessons/courselessons.component';
import { GuiasComponent } from './components/guias/guias.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ListcoursesComponent } from './components/listcourses/listcourses.component';
import { SigninComponent } from './components/signin/signin.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { ModulesComponent } from './components/modules/modules.component';
import { MycoursesComponent } from './components/mycourses/mycourses.component';
import { SupportsuperatemexicoComponent } from './components/supportsuperatemexico/supportsuperatemexico.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { ChartsComponent } from './components/charts/charts.component';
import { MygroupsComponent } from './components/mygroups/mygroups.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { EditcoursesComponent } from './components/editcourses/editcourses.component';
import { EditmanagerComponent } from './components/editmanager/editmanager.component';
import { NewcourseComponent } from './components/newcourse/newcourse.component';
import { NewblockComponent } from './components/newblock/newblock.component';
import { AdminComponent } from './components/admin/admin.component';
import { TaskreviewComponent } from './components/taskreview/taskreview.component';
import { TasksviewComponent } from './components/tasksview/tasksview.component';
import { GradesbygroupComponent } from './components/gradesbygroup/gradesbygroup.component';
import { TesteditComponent } from './components/testedit/testedit.component';

const APP_ROUTES:Routes=[
  {path: '', component:HomeComponent},
  {path: 'home', component:HomeComponent},
  {path: 'guias', component:GuiasComponent},
  {path: 'modules/:curso/:groupid/:courseid', component:ModulesComponent},
  {path: 'curso/:id', component:CursoComponent},
  {path: 'cursos', component:CursosComponent},
  {path: 'courselessons/:id', component:CourselessonsComponent},
  {path: 'courseedit/:courseid/:blockid', component:CourseeditComponent},
  {path: 'perfil', component:PerfilComponent},
  {path: 'listcourses', component:ListcoursesComponent},
  {path: 'signin', component:SigninComponent},
  {path: 'avisoprivacidad', component:PrivacyComponent},
  {path: 'mygroups', component:MygroupsComponent},
  {path: 'tutorial', component:TutorialComponent},
  {path: 'editmanager', component:EditmanagerComponent},
  {path: 'editcourses', component:EditcoursesComponent},
  {path: 'newcourse', component:NewcourseComponent},
  {path: 'newblock', component:NewblockComponent},
  {path: 'admin', component:AdminComponent},
  {path: 'testedit', component:TesteditComponent},
  {path: 'taskreview/:groupCode',component:TaskreviewComponent},
  {path: 'tasksview/:groupCode/:groupid/:studentid/:blockid',component:TasksviewComponent},
  {path: 'mycourses/:curso/:groupid/:courseid/:blockid', component:MycoursesComponent},
  {path: 'block/:curso/:groupid/:courseid/:blockid', component:BlocksComponent},
  {path: 'supportsuperatemexico/:operacion/:idtemporal/:emailuser', component:SupportsuperatemexicoComponent},
  {path: 'gradesbygroup/:idgroup', component:GradesbygroupComponent},
  {path: 'charts' ,component:ChartsComponent},
  {path: 'resetpass' ,component:ResetpasswordComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const appRoutingProviders: any[]= [];
export const routing = RouterModule.forRoot(APP_ROUTES);
