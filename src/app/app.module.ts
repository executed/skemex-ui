import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FloorComponent} from './floor/floor.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppService} from './app.service';
import {RoomsComponent} from './rooms/rooms.component';
import {OfficeComponent} from './office/office.component';
import {RoomComponent} from './room/room.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LogInComponent} from './log-in/log-in.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CreateWorkspaceComponent} from './create-workspace/create-workspace.component';
import {AngularDraggableModule} from 'angular2-draggable';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {WorkspaceComponent} from './workspace/workspace.component';
import {ModalModule} from 'ngx-bootstrap';
import {BsDatepickerModule, DatepickerModule} from 'ngx-bootstrap/datepicker';

import {ErrorsHandler} from './error/error-handler';
import {SmthWentWrongComponent} from './smth-went-wrong/smth-went-wrong.component';
import {ErrorsService} from './error/error.service';
import {AuthGuard} from './auth-guard';
import {AuthService} from './auth.service';
import { NotificationsComponent } from './notifications/notifications.component';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {CookieService} from 'ngx-cookie-service';
import { NavBarComponent } from './navbar/navbar.component';
import { UploadModule } from './upload/upload.module';
import { SearchComponent } from './search/search.component';
import {SlideToggleModule} from 'ngx-slide-toggle';
import {DatePipe} from '@angular/common';
import {LoginLayoutsComponent} from './login-layouts/login-layouts.component';
import {HomeLoyoutsComponent} from './home-loyouts/home-loyouts.component';
import {ConflictsComponent} from './conflicts/conflicts.component';
import {CsrfInterceptor} from './error/csrf-interceptor';
import {GlobalInterceptor} from './error/global-interceptor';
import {ErrorComponent} from './error/error.component';
import { NumberDirective } from './floor/numbers-only.directive';
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    showDismissButton: true
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: false
  }
};

@NgModule({
  declarations: [
    AppComponent,
    FloorComponent,
    RoomsComponent,
    OfficeComponent,
    RoomComponent,
    PageNotFoundComponent,
    CreateWorkspaceComponent,
    LogInComponent,
    WorkspaceComponent,
    SmthWentWrongComponent,
    NavBarComponent,
    NotificationsComponent,
    SearchComponent,
    ConflictsComponent,
    LoginLayoutsComponent,
    HomeLoyoutsComponent,
    ErrorComponent,
    NumberDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularDraggableModule,
    DragDropModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    ModalModule.forRoot(),
    DragDropModule,
    NotifierModule.withConfig(customNotifierOptions),
    UploadModule,
    SlideToggleModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    },
    AppService,
    ErrorsService,
    AuthGuard,
    AuthService,
    DatePipe,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
