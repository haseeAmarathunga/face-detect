import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WebcamComponent} from './webcam/webcam.component';
import { FaceDetectComponent } from './face-detect/face-detect.component';

const COMPONENTS = [
  WebcamComponent
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    COMPONENTS,
    FaceDetectComponent
  ],
  exports: [
    COMPONENTS,
    FaceDetectComponent
  ]
})
export class WebcamModule {
}
