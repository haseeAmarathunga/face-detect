import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {WebcamModule} from './modules/webcam/webcam.module';
import {FormsModule} from '@angular/forms';
import {NgOpenCVModule, OpenCVOptions} from 'ng-open-cv';
import {FlexLayoutModule} from '@angular/flex-layout';

const openCVConfig: OpenCVOptions = {
  scriptUrl: `assets/opencv/opencv.js`,
  wasmBinaryFile: 'wasm/opencv_js.wasm',
  usingWasm: true
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    WebcamModule,
    NgOpenCVModule.forRoot(openCVConfig),
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
