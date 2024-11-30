import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWithInput } from './card-with-input.component';

describe('LittleTitleTourComponent', () => {
  let component: CardWithInput;
  let fixture: ComponentFixture<CardWithInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWithInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardWithInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
