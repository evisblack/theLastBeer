import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyBarsComponent } from './nearby-bars.component';

describe('NearbyBarsComponent', () => {
  let component: NearbyBarsComponent;
  let fixture: ComponentFixture<NearbyBarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyBarsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NearbyBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
