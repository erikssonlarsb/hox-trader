import { Component, Input } from '@angular/core';

import { OrderDepth} from '../../models/index';

@Component({
  selector: 'order-depth',
  templateUrl: './orderDepth.component.html',
  styleUrls: ['./orderDepth.component.css']
})

export class OrderDepthComponent {
  @Input() orderDepth: OrderDepth;
}
