import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, state, transition, animate } from '@angular/animations';

@Component({
  selector: 'config-menu',
  templateUrl: './configMenu.component.html',
  styleUrls: ['./configMenu.component.css'],
  animations: [
    trigger('slideInOut', [
      state('true', style({
      transform: 'translateX(50%)'
      })),
      state('false',   style({
        transform: 'translateX(0%)'
      })),
      transition('false => true', animate('100ms ease-in')),
      transition('true => false', animate('100ms ease-out'))
    ])
  ]
})

export class ConfigMenuComponent {

  @Input() options: Object;
  @Output() optionsChange: EventEmitter<Object> = new EventEmitter<Object>();

  visible: boolean = false;

  getKeys(configOptions: Object) {
    return Object.keys(configOptions);
  }
}
