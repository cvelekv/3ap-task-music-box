import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SecurePipe } from './secure.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [SecurePipe],
  exports: [SecurePipe]
})
export class SharedModule {}
