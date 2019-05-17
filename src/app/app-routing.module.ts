import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FloorComponent} from './floor/floor.component';
import {OfficeComponent} from './office/office.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {RoomComponent} from './room/room.component';
import {LogInComponent} from './log-in/log-in.component';
import { SmthWentWrongComponent } from './smth-went-wrong/smth-went-wrong.component';
import {WorkspaceComponent} from './workspace/workspace.component';
import {AuthGuard} from './auth-guard';
import {UploadComponent} from './upload/upload.component';
import {SearchComponent} from './search/search.component';
import {ConflictsComponent} from './conflicts/conflicts.component';
import {HomeLoyoutsComponent} from "./home-loyouts/home-loyouts.component";
import {LoginLayoutsComponent} from "./login-layouts/login-layouts.component";
import {ErrorComponent} from "./error/error.component";
import {InfoPageComponent} from "./info-page/info-page.component";

const routes: Routes = [
  {
    path: '',
    component: HomeLoyoutsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: OfficeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'floor/:officeId',
        component: FloorComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'floor/:officeId/room/:roomId',
        component: RoomComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'workspace/:workSpaceId',
        component: WorkspaceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'upload',
        component: UploadComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'conflicts',
        component: ConflictsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'errors',
        component: ErrorComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'info',
        component: InfoPageComponent
      }
    ]
  },
  {
    path: '',
    component: LoginLayoutsComponent,
    children: [
      {
        path: 'login',
        component: LogInComponent
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: 'error',
    component: SmthWentWrongComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
