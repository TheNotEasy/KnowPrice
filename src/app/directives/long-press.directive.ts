import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  NgZone,
  EventEmitter,
  Output
} from "@angular/core";
import { GestureController } from "@ionic/angular";

@Directive({
  selector: "[long-press]"
})
export class LongPressDirective implements AfterViewInit {

  @Output() tap = new EventEmitter();
  @Output() press = new EventEmitter();
  @Input("delay") delay = 300;
  action: any; //not stacking actions

  private positions = {
    start: {
      x: -1,
      y: -1,
    },
    current: {
      x: -1,
      y: -1,
    }
  }

  private longPressActive = false;

  constructor(
    private el: ElementRef,
    private gestureCtrl: GestureController,
    private zone: NgZone
  ) { }

  ngAfterViewInit() {
    this.loadLongPressOnElement();
  }

  loadLongPressOnElement() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      threshold: 0,
      gestureName: 'long-press',
      onStart: ev => {
        this.longPressActive = true;
        this.longPressAction();

        this.positions = {
          start: { x: ev.startX, y: ev.startY },
          current: { x: ev.currentX, y: ev.currentY }
        };

      },
      onMove: ev => {
        this.positions.current = { x: ev.currentX, y: ev.currentY };
      },
      onEnd: ev => {
        this.longPressActive = false;
        this.zone.run(() => {this.tap.emit()})
        clearInterval(this.action)
      }
    });
    gesture.enable(true);
  }

  private longPressAction() {
    if (this.action) {
      clearInterval(this.action);
    }
    this.action = setTimeout(() => {
      this.zone.run(() => {
        // Check distance
        const xDistance = Math.abs(this.positions.start.x - this.positions.current.x);
        const yDistance = Math.abs(this.positions.start.y - this.positions.current.y);
        if (xDistance > 15 || yDistance > 15)
          // User dragged finger
          return;

        if (this.longPressActive === true) {
          this.longPressActive = false;
          this.press.emit();
        } else {
          this.tap.emit();
        }
      });
    }, this.delay);
  }
}