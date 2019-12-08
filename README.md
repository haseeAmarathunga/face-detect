## @haseeamarathunga/face-detection

[![npm (scoped)](https://img.shields.io/npm/v/@bamblehorse/tiny.svg)](https://www.npmjs.com/package/@haseeamarathunga/face-detection)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@bamblehorse/tiny.svg)](https://www.npmjs.com/package/@haseeamarathunga/face-detection)

Faces and Iris detection using web-cam

## Features
* Webcam live view
* Face Detection
* Iris Iris Detection
* Return Face image from capture
* Return Iris images from capture


## Prerequisites

### Runtime Dependencies
* Angular: `^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0`
* RxJs: `^5.0.0 || ^6.0.0`
* App must be served on a secure context (https or localhost)

### Client
* [Current Browser](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Browser_compatibility) w/ HTML5 and WebRTC/UserMedia support (Chrome >53, Safari >11, Firefox >38, Edge)
* Webcam :)
* User permissions to access the webcam

## Usage
1) Install the library via standard npm command:

`npm install --save @haseeamarathunga/face-detection`

2) Import the `FaceDetectionModule` into your Angular module:

```typescript
import {FaceDetectionModule} from '@haseeamarathunga/face-detection';

@NgModule({
  imports: [
    FaceDetectionModule,
    ...
  ],
  ...
})
export class AppModule { }
```

3) Use the `FaceDetectionComponent` on your pages:

`<face-detection></face-detection>`

## Options and Events
This section describes the basic inputs/outputs of the component. All inputs are optional.
### Inputs
* `triggerFace: Observable<void>`: An `Observable` to trigger image capturing. When it fires, an image will be captured and emitted (see Outputs).
* `width: number`: The maximal video width of the webcam live view.
* `height: number`: The maximal video height of the webcam live view. The actual view will be placed within these boundaries, respecting the aspect ratio of the video stream.

### Outputs
* `imageCapture: EventEmitter<any>`: Whenever an image is captured it return the event object that include fullImage, Face, eyeLeft and eyeRight.

` 
viewChange(event) {
     this.fullFace = event.fullImage;
     this.face = event.face;
     this.eyeRight = event.eyeRight;
     this.eyeLeft = event.eyeLeft;
  }
`

## Development
Here you can find instructions on how to start developing this library.

### Build
Run `npm run packagr` to build the library. The build artifacts will be stored in the `dist/` directory.

### Start
Run `npm start` to build and run the surrounding webapp with the `FaceDetectionModule`. Essential for live-developing.

### Generate docs/
Run `npm run docs` to generate the live-demo documentation pages in the `docs/` directory.

### Running Unit Tests
Run `npm run test` to run unit-tests.
