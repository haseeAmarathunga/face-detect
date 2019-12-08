import { NgModule } from '@angular/core';
import { FaceDetectComponent } from './face-detect.component';
import {NgOpenCVModule, OpenCVOptions} from 'ng-open-cv';
import {WebcamModule} from 'ngx-webcam';
const openCVConfig: OpenCVOptions = {
  scriptUrl: `assets/opencv/opencv.js`,
  wasmBinaryFile: 'wasm/opencv_js.wasm',
  usingWasm: true
};
@NgModule({
  declarations: [FaceDetectComponent],
  imports: [
    NgOpenCVModule.forRoot(openCVConfig),
    WebcamModule
  ],
  exports: [FaceDetectComponent]
})
export class FaceDetectModule { }
