import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeRequestsComponent } from './merge-requests.component';

describe('MergeRequestsComponent', () => {
  let component: MergeRequestsComponent;
  let fixture: ComponentFixture<MergeRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
