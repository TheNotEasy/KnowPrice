import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

const loading = "<ion-spinner style=\"margin: 100px auto; text-align: center; width: 70%;\" *ngIf=\"!isLoadingFailed; else loadingFailed\"></ion-spinner>"


@Directive({
  selector: '[appLoadable]'
})
export class LoadableDirective {
  @Input() appLoadable!: Promise<[any, number]>;

  oldInnerHTML: string;

  constructor(private el: ElementRef<HTMLIonContentElement>) { 
    this.oldInnerHTML = el.nativeElement.innerHTML;
    el.nativeElement.innerHTML = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Changed! " + changes['appLoadable'].currentValue)
  }
}
