import { Component, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { compileNgModule } from '@angular/compiler';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CanvasComponent implements AfterViewInit, OnDestroy {

  private canvasElement = null;
  private ctx = null;
  private waves = [];
  private wave1 = [];
  private wave2 = [];
  private wave3 = [];
  private screenWidth = 0;
  private screenHeight = 0;
  private numWaves = 8;
  private wavesSize = 4;
  private moveWavesId = null;
  private moveBoatId = null;
  private shipComputed = {
    angle: '0',
    top: 0,
    left: 0,
    widthScreenWidthPercent: 0.07,
  };

  public angle = '0';
  public left = '0';
  public top = '0';

  @ViewChild('main', { static: false }) main: ElementRef;
  @ViewChild('boat', { static: false }) boat: ElementRef;

  constructor() {
  }

  ngAfterViewInit() {
    this.initCanvas();
    this.initWaves();
    requestAnimationFrame(() => { this.draw(); });
    this.startLoop();
  }

  initCanvas() {
    this.canvasElement = document.createElement('canvas');
    this.ctx = this.canvasElement.getContext('2d');
    this.main.nativeElement.insertBefore(this.canvasElement, this.main.nativeElement.firstChild);

    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    this.canvasElement.width = this.screenWidth;
    this.canvasElement.height = this.screenHeight;

    this.shipComputed = {
      angle: '0',
      top: 0,
      left: 0,
      widthScreenWidthPercent: 0.07,
    };
  }

  initWaves() {
    const num = this.numWaves;
    const size = this.wavesSize;
    for (let x = 0; x < this.screenWidth; x++) {
      const s1 = (x + 40) * num / this.screenWidth * 2 * Math.PI;
      const s2 = (x + 20) * (num - 1) / this.screenWidth * 2 * Math.PI;
      const s3 = (x + 10) * (num + 1) / this.screenWidth * 2 * Math.PI;
      this.wave1[x] = Math.sin(s1);
      this.wave2[x] = Math.sin(s2);
      this.wave3[x] = Math.sin(s3);
      this.waves[x] = ((this.wave1[x] + this.wave2[x] + this.wave3[x]) * size) + this.screenHeight / 2;
    }
  }

  moveBoat() {
    const y1 = this.waves[this.shipComputed.left];
    const y2 = this.waves[this.shipComputed.left + 1];

    this.shipComputed.left += 1;
    this.shipComputed.top = y1;

    if (this.shipComputed.left > this.screenWidth + 100) {
      this.shipComputed.left = -10;
    }

    this.angle = `rotate(${-Math.atan(y1 - y2)}rad)`;
    this.left = this.shipComputed.left - (this.screenWidth * this.shipComputed.widthScreenWidthPercent / 2) + 'px';
    this.top = this.shipComputed.top - 55 + 'px';
  }

  moveWaves() {
    const num = this.numWaves;
    const size = this.wavesSize;

    const wave2zero = this.wave2[0];
    const wave3zero = this.wave3[0];

    for (let x = 0; x < this.screenWidth; x++) {
      if (x === this.screenWidth - 1) {
        this.wave2[x] = wave2zero;
        this.wave3[x] = wave3zero;
      } else {
        this.wave2[x] = this.wave2[x + 1];
        this.wave3[x] = this.wave3[x + 1];
      }
      this.waves[x] = ((this.wave1[x] + this.wave2[x] + this.wave3[x]) * size) + this.screenHeight / 2;
    }
  }

  startLoop() {
    clearInterval(this.moveWavesId);
    this.moveWavesId = setInterval(() => { this.moveWaves(); }, 15);

    clearInterval(this.moveBoatId);
    this.moveBoatId = setInterval(() => { this.moveBoat(); }, 25);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.screenHeight);

    for (let x = 0; x < this.screenWidth; x++) {
      this.ctx.lineTo(x, this.waves[x]);
    }

    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.screenHeight);
    gradient.addColorStop(.5, '#2196d3');
    gradient.addColorStop(1, '#000025');
    this.ctx.fillStyle = gradient;
    this.ctx.lineTo(this.screenWidth, this.screenHeight);
    this.ctx.fill();
    requestAnimationFrame(() => { this.draw(); });

  }

  ngOnDestroy() {
    clearInterval(this.moveWavesId);
    clearInterval(this.moveBoatId);
  }

}
