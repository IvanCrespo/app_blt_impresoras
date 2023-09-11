import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Components
import { PrintTicketsComponent } from './modals/print-tickets/print-tickets.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [PrintTicketsComponent]
})
export class ComponentsModule {}
