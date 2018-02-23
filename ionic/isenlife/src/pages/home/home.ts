import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/of";
import Rx from "rxjs/Rx";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public orientation:GyroscopeOrientation;
  public options:GyroscopeOptions = {
    frequency: 100
  };

  public x:number = 0;

  @ViewChild('canvas') canvasEl: ElementRef;

  /**
  * Reference Canvas object
  */
  private _CANVAS: any;

  /**
    * Reference the context for the Canvas element
    */
  private _CONTEXT: any;

  constructor(public navCtrl: NavController, private gyroscope: Gyroscope, public platform: Platform) {

    //this.onBrowser();
    this.onAndroid();
  }

  public onBrowser(){
    let flux_1 = [0, 1, 1.1, 1.2, 1.3, 1.4, 1.4, 1.4, 1.4, 1.6, 1.7, 1.8, 1.9, 1.8, 1.9, 2, 2.1, 2, 1.9, 1.8, 1.7];
    let flux_2 = [0, -1, -1.1, -1.2, -1.3, -1.4, -1.4, -1.4, -1.4, -1.6, -1.7, -1.8, -1.9, -1.8, -1.9, -2, -2.1];

    flux_1.forEach(elt => {
      flux_2.push(elt);
    });

    flux_2.forEach(elt => {
      flux_2.push(elt);
    });

    var observable = Rx.Observable.interval(50).take(3 * flux_2.length).map(t => flux_2[t % flux_2.length]);
    observable.subscribe(t => {
      //console.log(t);
      this.x -= t;
      this.clearCanvas();
      this.drawPlayer();
    });
  }

  public onAndroid(){
    this.gyroscope.watch(this.options)
      .subscribe((orientation: GyroscopeOrientation) => {
        console.log("orientation: ", orientation.x, orientation.y, orientation.z);
        this.orientation = orientation;
        this.x += 10*orientation.y;
        this.clearCanvas();
        this.drawPlayer();
      });  
  }

  ionViewDidLoad() {
    this._CANVAS = this.canvasEl.nativeElement;

    this._CANVAS.width = this.platform.width();
    this._CANVAS.height = this.platform.height();

    this.initialiseCanvas();
    this.drawCircle();
  }

  public initialiseCanvas() {
    if (this._CANVAS.getContext) {
      this.setupCanvas();
    }
  }

  public setupCanvas() {
    this._CONTEXT = this._CANVAS.getContext('2d');
    this._CONTEXT.fillStyle = "#3e3e3e";
    this._CONTEXT.fillRect(0, 0, this._CANVAS.width, this._CANVAS.height);
  }

  public clearCanvas() {
    this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
    this.setupCanvas();
  }

  public drawPlayer(){
    let image = new Image();
    image.src = "assets/imgs/molina.png";
    this._CONTEXT.drawImage(image, (this._CANVAS.width / 2 + this.x), this._CANVAS.height/2);
  }

  public drawCircle() {
    this.clearCanvas();
    this._CONTEXT.beginPath();

    // x, y, radius, startAngle, endAngle
    this._CONTEXT.arc((this._CANVAS.height / 2 + this.x), this._CANVAS.width / 2, 20, 0, 2 * Math.PI);
    this._CONTEXT.lineWidth = 1;
    this._CONTEXT.strokeStyle = '#ffffff';
    this._CONTEXT.stroke();
  }
}
