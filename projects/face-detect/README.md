## @haseeamarathunga/face-detect

[![npm (scoped)](https://img.shields.io/npm/v/@bamblehorse/tiny.svg)](https://www.npmjs.com/package/@haseeamarathunga/face-detect)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@bamblehorse/tiny.svg)](https://www.npmjs.com/package/@haseeamarathunga/face-detect)

Faces and Iris detection using web-cam

## Features
* Webcam live view
* Face Detection
* Iris Detection
* Return Face image from capture
* Return Iris images from capture


## Prerequisites
You must install ngx-webcam and ng-open-cv libraries.

### Runtime Dependencies
* Angular: `^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0`
* RxJs: `^5.0.0 || ^6.0.0`
* App must be served on a secure context (https or localhost)

### Client
* [Current Browser](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Browser_compatibility) w/ HTML5 and WebRTC/UserMedia support (Chrome >53, Safari >11, Firefox >38, Edge)
* Webcam :)
* User permissions to access the webcam

## Usage
1) Install ngx-webcam library via standard npm command:

`npm install --save ngx-webcam`

2) Install ng-open-cv library via standard npm command:

`npm install ng-open-cv`

3) Install face-detect library via standard npm command:

`npm install @haseeamarathunga/face-detect`

2) Import the `FaceDetectModule` into your Angular module:

```typescript
import {FaceDetectModule} from '@haseeamarathunga/face-detect';
import {NgOpenCVModule, OpenCVOptions} from 'ng-open-cv';
import {WebcamModule} from 'ngx-webcam';
@NgModule({
  imports: [
    NgOpenCVModule,
    WebcamModule,
    FaceDetectModule,
    ...
  ],
  ...
})
export class AppModule { }
```

3) Use the `FaceDetectComponent` on your pages:

In .html file

```html
<face-detect [width]="500" [height]="380" [triggerFace]="triggerObservable"
                  (imageCapture)="viewChange($event)"></face-detect>
                  
     <button class="button" (click)="triggerSnapshot();">Detect Face</button>

```

In .ts file

```typescript
 private trigger: Subject<void> = new Subject<void>();
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
```
## Options and Events
This section describes the basic inputs/outputs of the component. All inputs are optional.
### Inputs
* `triggerFace: Observable<void>`: An `Observable` to trigger image capturing. When it fires, an image will be captured and emitted (see Outputs).
* `width: number`: The maximal video width of the webcam live view.
* `height: number`: The maximal video height of the webcam live view. The actual view will be placed within these boundaries, respecting the aspect ratio of the video stream.

### Outputs
* `imageCapture: EventEmitter<any>`: Whenever an image is captured it return the event object that include fullImage, Face, eyeLeft and eyeRight.

```typescript
 viewChange(event) {
    console.log(event);
    this.fullFace = event.fullImage;
    this.face = event.face;
    this.eyeRight = event.eyeRight;
    this.eyeLeft = event.eyeLeft;
  }
```

## Development
Here you can find instructions on how to start developing this library.

### Build
Run `npm run packagr` to build the library. The build artifacts will be stored in the `dist/` directory.

### Start
Run `npm start` to build and run the surrounding webapp with the `FaceDetectModule`. Essential for live-developing.

### Generate docs/
Run `npm run docs` to generate the live-demo documentation pages in the `docs/` directory.

### Running Unit Tests
Run `npm run test` to run unit-tests.
