import { TestBed } from '@angular/core/testing';

import { FaceDetectService } from './face-detect.service';

describe('FaceDetectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FaceDetectService = TestBed.get(FaceDetectService);
    expect(service).toBeTruthy();
  });
});
