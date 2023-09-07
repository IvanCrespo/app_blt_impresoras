import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

// Permissions
import { Permissions } from './shared/permissions/permissions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private androidPermissions: Permissions
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.platform.backButton.subscribeWithPriority(1, () => {
      });

      // Permissions
      await this.androidPermissions.requestPermissionsBluetoth();
      const request = await this.androidPermissions.permissionBluetooth();
      console.log(request);
      if (!request) {
        console.log("Necesita permisos");
        await this.androidPermissions.requestPermissionsBluetoth();
      }

      // Para verificar permisos
      const request2 = await this.androidPermissions.permissionBluetooth();
      console.log(request2);
    });
  }
}
