import { Injectable } from '@angular/core';

// Plugins
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Injectable({ providedIn: 'root' })

export class Permissions {
    constructor(
        private androidPermissions: AndroidPermissions,
    ) { }

    async permissionBluetooth(): Promise<boolean> {
        return this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT).then(
            result => {
                if (result.hasPermission) {
                    return true;
                }
                return false;
            },
            err => { return false }
        );
    }

    async requestPermissionsBluetoth() {
        await this.androidPermissions.requestPermissions(
            [
                this.androidPermissions.PERMISSION.BLUETOOTH,
                this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
                this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
                this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
                this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
            ]
        );
    }
}
