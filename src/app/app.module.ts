import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'ng2-archwizard';
import { EmbedVideo } from 'ngx-embed-video';
import { NgxPaginationModule } from 'ngx-pagination';
import { SortableModule } from 'ngx-bootstrap';
import { NgxEditorModule } from 'ngx-editor';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';



//Routes
import {routing, appRoutingProviders} from './app.routes';

//Servicios
import { UserService } from './services/user.service';
import { CourseService } from './services/course.service';
import { InsertUserService } from './services/insert_user.service';

//Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { GuiasComponent } from './components/guias/guias.component';
import { CursoComponent } from './components/curso/curso.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ListcoursesComponent } from './components/listcourses/listcourses.component';
import { FooterComponent } from './components/footer/footer.component';
import { SigninComponent } from './components/signin/signin.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { ModulesComponent } from './components/modules/modules.component';
import { VideosPipe } from './pipes/videos.pipe';
import { MycoursesComponent } from './components/mycourses/mycourses.component';
import { SupportsuperatemexicoComponent } from './components/supportsuperatemexico/supportsuperatemexico.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ChartsComponent } from './components/charts/charts.component';
import { MygroupsComponent } from './components/mygroups/mygroups.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { EditcoursesComponent } from './components/editcourses/editcourses.component';
import { AdminComponent } from './components/admin/admin.component';
import { TaskreviewComponent } from './components/taskreview/taskreview.component';
import { TasksviewComponent } from './components/tasksview/tasksview.component';
import { CourseeditComponent } from './components/courseedit/courseedit.component';
import { CourselessonsComponent } from './components/courselessons/courselessons.component';
import { EditmanagerComponent } from './components/editmanager/editmanager.component';
import { NewcourseComponent } from './components/newcourse/newcourse.component';
import { NewblockComponent } from './components/newblock/newblock.component';
import { TesteditComponent } from './components/testedit/testedit.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { GradesbygroupComponent } from './components/gradesbygroup/gradesbygroup.component';
import { LoaderComponent } from './components/shared/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CursosComponent,
    GuiasComponent,
    CursoComponent,
    PerfilComponent,
    ListcoursesComponent,
    FooterComponent,
    SigninComponent,
    BlocksComponent,
    ModulesComponent,
    VideosPipe,
    MycoursesComponent,
    SupportsuperatemexicoComponent,
    PrivacyComponent,
    ChartsComponent,
    MygroupsComponent,
    TutorialComponent,
    EditcoursesComponent,
    AdminComponent,
    TaskreviewComponent,
    TasksviewComponent,
    CourseeditComponent,
    CourselessonsComponent,
    EditmanagerComponent,
    NewcourseComponent,
    NewblockComponent,
    TesteditComponent,
    ResetpasswordComponent,
    GradesbygroupComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    routing,
    ArchwizardModule,
    NgxEditorModule,
    EmbedVideo.forRoot(),
    NgbModule.forRoot(),
    SortableModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    NgxPaginationModule,
    ChartsModule
  ],
  providers: [ appRoutingProviders, UserService, InsertUserService, CourseService ],
  bootstrap: [ AppComponent]
})
export class AppModule { }
