import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
<<<<<<< HEAD
import { NgScrollbarModule } from 'ngx-scrollbar'; 

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'; 

import { AppConfig } from '../environments/environment';
=======
import { NgScrollbarModule } from 'ngx-scrollbar';
import { LaolaComponentsModule } from './components/laola-components.module';
import { AuthInterceptor } from './http-interceptors/auth.http-interceptor';
>>>>>>> 5a60097796d352e7af3ff3278226200c5c8782ce

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './containers';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}


import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,
} from '@coreui/angular';
 

import { IconModule, IconSetService } from '@coreui/icons-angular';

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS],
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    FormsModule, // Add this line
    BrowserModule,
    BrowserAnimationsModule, 
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    CommonModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule, 
	provideFirebaseApp(() => initializeApp(AppConfig.firebase)),
    provideFirestore(() => getFirestore()) 
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    },
    IconSetService,
    Title
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
} 
