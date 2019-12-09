import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {NgOpenCVModule, OpenCVOptions} from 'ng-open-cv';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FaceDetectModule} from '../../projects/face-detect/src/lib/face-detect.module';
import {NgAnimationModule} from '../../projects/ng-animation/src/lib/ng-animation.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FaceDetectModule,
    FlexLayoutModule,
    NgAnimationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
