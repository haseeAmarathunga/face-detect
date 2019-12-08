import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, Subject, Subscription} from 'rxjs';
import {WebcamImage} from '../domain/webcam-image';
import {filter, switchMap, tap} from 'rxjs/operators';
import {NgOpenCVService, OpenCVLoadResult} from 'ng-open-cv';
import {WebcamComponent} from '../webcam/webcam.component';
declare var cv: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'face-detect',
  templateUrl: './face-detect.component.html',
  styleUrls: ['./face-detect.component.scss']
})
export class FaceDetectComponent implements OnInit {
  private static DEFAULT_VIDEO_OPTIONS: MediaTrackConstraints = {facingMode: 'environment'};
  private static DEFAULT_IMAGE_TYPE: string = 'image/jpeg';
  private static DEFAULT_IMAGE_QUALITY: number = 0.92;
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  constructor(private ngOpenCVService: NgOpenCVService) {
  }
  public trigger: Subject<void> = new Subject<void>();
  imageUrl;
  isCaptured = false;
  // @ts-ignore
  @ViewChild('fileInput')
  fileInput: ElementRef;
  // @ts-ignore
  @ViewChild('canvasInput')
  canvasInput: ElementRef;
  // @ts-ignore
  @ViewChild('canvasOutput')
  canvasOutput: ElementRef;
  // latest snapshot
  webcamImage: WebcamImage = null;

  /** Defines the max width of the webcam area in px */
  @Input() public width: number = 640;
  /** Defines the max height of the webcam area in px */
  @Input() public height: number = 480;
  /** Defines base constraints to apply when requesting video track from UserMedia */
  @Input() public videoOptions: MediaTrackConstraints = WebcamComponent.DEFAULT_VIDEO_OPTIONS;

  @Output()
  imageCapture: EventEmitter<any> = new EventEmitter<any>();
  // Notifies of the ready state of the classifiers load operation
  private classifiersLoaded = new BehaviorSubject<boolean>(false);
  private classifiersLoaded$ = this.classifiersLoaded.asObservable();
  private triggerSubscription: Subscription;

  public triggerSnapshot(): void {
    this.trigger.next();
  }
  @Input()
  public set triggerFace(trigger: Observable<void>) {
    if (this.triggerSubscription) {
      this.triggerSubscription.unsubscribe();
    }

    // Subscribe to events from this Observable to take snapshots
    this.triggerSubscription = trigger.subscribe(() => {
      this.triggerSnapshot();
    });
  }
  ngOnInit() {
    this.ngOpenCVService.isReady$
      .pipe(
        // The OpenCV library has been successfully loaded if result.ready === true
        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {
          // Load the face and eye classifiers files
          return this.loadClassifiers();
        })
      )
      .subscribe(() => {
        // The classifiers have been succesfully loaded
        this.classifiersLoaded.next(true);
      });
  }

  handleImage(webcamImage: WebcamImage) {
    (async () => {
      this.webcamImage = webcamImage;
      // console.log(this.webcamImage.imageAsBase64);
      this.imageUrl = this.webcamImage.imageAsDataUrl;
      const canvas = document.getElementById('canvasInput');
      // @ts-ignore
      canvas.width = 500;
      // @ts-ignore
      canvas.height = 500;
      const baseImage = new Image();
      baseImage.src = this.imageUrl;
      // @ts-ignore
      const context = canvas.getContext('2d');
      // tslint:disable-next-line:only-arrow-functions
      baseImage.onload = function () {
        context.drawImage(baseImage, 0, 0);
      };
      await this.delay(500);
      this.detectFace();
      this.isCaptured = true;
      await this.delay(500);
      const canvasOutput = document.getElementById('canvasOutput');
      const canvasFace = document.getElementById('face');
      const canvasEyeLeft = document.getElementById('eyeLeft');
      const canvasEyeRight = document.getElementById('eyeRight');
      const captureddata = {
        // @ts-ignore
        fullImage: canvasOutput.toDataURL(),
        // @ts-ignore
        face: canvasFace.toDataURL(),
        // @ts-ignore
        eyeLeft: canvasEyeLeft.toDataURL(),
        // @ts-ignore
        eyeRight: canvasEyeRight.toDataURL()
      };
      this.imageCapture.emit(captureddata);
    })();
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  loadClassifiers(): Observable<any> {
    return forkJoin(
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_frontalface_default.xml',
        `assets/opencv/data/haarcascades/haarcascade_frontalface_default.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_eye.xml',
        `assets/opencv/data/haarcascades/haarcascade_eye.xml`
      )
    );
  }

  detectFace() {
    // before detecting the face we need to make sure that
    // 1. OpenCV is loaded
    // 2. The classifiers have been loaded
    this.ngOpenCVService.isReady$
      .pipe(
        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {
          return this.classifiersLoaded$;
        }),
        tap(() => {
          this.clearOutputCanvas();
          this.findFaceAndEyes();
        })
      )
      .subscribe(() => {
        console.log('Face detected');
      });
  }

  clearOutputCanvas() {
    const context = this.canvasOutput.nativeElement.getContext('2d');
    context.clearRect(0, 0, this.canvasOutput.nativeElement.width, this.canvasOutput.nativeElement.height);
  }

  findFaceAndEyes() {
    const src = cv.imread(this.canvasInput.nativeElement.id);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    const faces = new cv.RectVector();
    const eyes = new cv.RectVector();
    const faceCascade = new cv.CascadeClassifier();
    const eyeCascade = new cv.CascadeClassifier();
    // load pre-trained classifiers, they should be in memory now
    faceCascade.load('haarcascade_frontalface_default.xml');
    eyeCascade.load('haarcascade_eye.xml');
    // detect faces
    const msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
    let i = 0;
    for (i; i < faces.size(); ++i) {
      const roiGray = gray.roi(faces.get(i));
      const roiSrc = src.roi(faces.get(i));
      const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      const point2 = new cv.Point(faces.get(i).x + faces.get(i).width, faces.get(i).y + faces.get(i).height);
      cv.rectangle(src, point1, point2, [255, 0, 0, 255], 2);
      // detect eyes in face ROI
      eyeCascade.detectMultiScale(roiGray, eyes);
      const canvas = document.getElementById('face');
      // @ts-ignore
      const context = canvas.getContext('2d');
      const imageObj = new Image();
      // @ts-ignore
      canvas.width = 400;
      // @ts-ignore
      canvas.height = 400;
      imageObj.onload = function () {
        const sourceX = point1.x;
        const sourceY = point1.y;
        const sourceWidth = point2.x - point1.x;
        const sourceHeight = point2.y - point1.y;
        const destWidth = sourceWidth;
        const destHeight = sourceHeight;
        // @ts-ignore
        const destX = canvas.width / 2 - destWidth / 2;
        // @ts-ignore
        const destY = canvas.height / 2 - destHeight / 2;
        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
      };
      imageObj.src = this.imageUrl;
      const eyeRect = ['eyeLeft', 'eyeRight'];
      let j = 0;
      for (j; j < eyes.size(); ++j) {
        if (j < 2) {
          const point3 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
          const point4 = new cv.Point(eyes.get(j).x + eyes.get(j).width, eyes.get(j).y + eyes.get(j).height);
          cv.rectangle(roiSrc, point3, point4, [0, 0, 255, 255]);
          const eye = eyeRect[j];
          const canvas2 = document.getElementById(eye);
          // @ts-ignore
          const context2 = canvas2.getContext('2d');
          const imageObj2 = new Image();
          // @ts-ignore
          canvas2.width = 100;
          // @ts-ignore
          canvas2.height = 100;
          imageObj2.onload = function () {
            const sourceX2 = point3.x + point1.x;
            const sourceY2 = point3.y + point1.y;
            const sourceWidth2 = point4.x - point3.x;
            const sourceHeight2 = point4.y - point3.y;
            const destWidth2 = sourceWidth2 * 3;
            const destHeight2 = sourceHeight2 * 3;
            // @ts-ignore
            const destX2 = canvas2.width / 2 - destWidth2 / 2;
            // @ts-ignore
            const destY2 = canvas2.height / 2 - destHeight2 / 2;
            context2.drawImage(imageObj2, sourceX2, sourceY2, sourceWidth2, sourceHeight2, destX2, destY2,
              destWidth2, destHeight2);
          };
          imageObj2.src = this.imageUrl;
        }
      }
      roiGray.delete();
      roiSrc.delete();
    }
    cv.imshow(this.canvasOutput.nativeElement.id, src);
    src.delete();
    gray.delete();
    faceCascade.delete();
    eyeCascade.delete();
    faces.delete();
    eyes.delete();
  }

  retry() {
    this.isCaptured = false;
  }

}
