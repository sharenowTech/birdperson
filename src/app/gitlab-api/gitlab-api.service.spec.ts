import { TestBed, inject } from '@angular/core/testing';

import { GitlabApiService } from './gitlab-api.service';

describe('GitlabApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GitlabApiService]
    });
  });

  it('should be created', inject([GitlabApiService], (service: GitlabApiService) => {
    expect(service).toBeTruthy();
  }));
});
