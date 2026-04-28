// aft-table-edit.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AFTRegistro } from '../../models/aftregistro';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-aft-table-edit',
  templateUrl: './aft-table-edit.component.html',
   styleUrls: ['./aft-table-edit.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    
  ]
})
export class AftTableEditComponent {
  @Input() registros: AFTRegistro[] = [];
  @Output() tableEdited = new EventEmitter<AFTRegistro[]>();

  emitEdited() {
    this.tableEdited.emit(this.registros);
    
  }
}

