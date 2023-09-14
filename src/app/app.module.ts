import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Modules
import { PagesPageModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';

// Plugins
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { StarPRNT } from '@awesome-cordova-plugins/star-prnt/ngx';
import { PhotoLibrary } from '@awesome-cordova-plugins/photo-library/ngx'

// Permissions
import { Permissions } from './shared/permissions/permissions';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    PagesPageModule,
    ComponentsModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    BluetoothSerial,
    AndroidPermissions,
    Permissions,
    StarPRNT,
    PhotoLibrary
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
