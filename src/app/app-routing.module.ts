import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddCardComponent } from "./add-card/add-card.component";
import { AuthorizationComponent } from './authorization/authorization.component';
import { CabinetComponent } from './cabinet/cabinet.component';
import { EditorCardComponent } from "./editor-card/editor-card.component";
import { MainComponent } from './main/main.component';
import { RegistrationComponent } from './registration/registration.component';


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'authorization', component: AuthorizationComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'cabinet', component: CabinetComponent},
  {path: 'add-card', component: AddCardComponent},
  {path: 'editor-card/:id_task', component: EditorCardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
