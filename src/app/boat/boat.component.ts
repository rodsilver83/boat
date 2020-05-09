import { Component, OnInit, Input, HostBinding, OnChanges } from '@angular/core';

@Component({
  selector: 'app-boat',
  templateUrl: './boat.component.svg',
  styleUrls: ['./boat.component.scss']
})
export class BoatComponent implements OnChanges {

  @Input() styledBoat = {};

  constructor() { }

  ngOnChanges(change) {
    console.log(change);
  }

}
