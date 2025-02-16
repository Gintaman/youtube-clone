import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolwheelComponent } from './toolwheel.component';

describe('ToolwheelComponent', () => {
  let component: ToolwheelComponent;
  let fixture: ComponentFixture<ToolwheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolwheelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToolwheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
