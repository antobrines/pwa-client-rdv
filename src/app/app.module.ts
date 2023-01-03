import { NgModule, OnInit, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { MaterialModule } from './material/material/material.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { HotToastModule } from '@ngneat/hot-toast';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import {
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
} from '@syncfusion/ej2-angular-schedule';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import {
  DateTimePickerModule,
  TimePickerModule,
} from '@syncfusion/ej2-angular-calendars';

import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { MapsComponent } from './components/maps/maps.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ConfirmComponent } from './components/user/confirm/confirm.component';
import { SignInComponent } from './components/user/sign-in/sign-in.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { CalendarComponent } from './components/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    LayoutComponent,
    HeaderComponent,
    SidenavComponent,
    LoadingComponent,
    ConfirmComponent,
    MapsComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ScheduleModule,
    DateTimePickerModule,
    TimePickerModule,
    DropDownListAllModule,
    FlexLayoutModule,
    GoogleMapsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HotToastModule.forRoot({
      position: 'bottom-center',
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule implements OnInit {
  ngOnInit() {
    const savedUrl = sessionStorage.getItem('currentUrl');
    if (savedUrl) {
      window.location.href = savedUrl;
    }
  }
}
