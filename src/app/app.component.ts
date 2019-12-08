import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {WebcamInitError, WebcamUtil} from 'ngx-webcam';

@Component({
  selector: 'appRoot',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  fullFace = 'assets/images/face-Iris-capture.jpg';
  face = 'assets/images/face-Iris-capture.jpg';
  eyeLeft = 'assets/images/left-eye.jpg';
  eyeRight = 'assets/images/right-eye.jpg';

  // toggle webcam on/off
  public showWebcam = true;
  public multipleWebcamsAvailable = false;
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  viewChange(event) {
    console.log(event);
    this.fullFace = event.fullImage;
    this.face = event.face;
    this.eyeRight = event.eyeRight;
    this.eyeLeft = event.eyeLeft;
  }
}
