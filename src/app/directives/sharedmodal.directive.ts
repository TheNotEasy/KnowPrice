import { Directive, ElementRef, HostListener, Input } from '@angular/core';

let modals: Record<string, HTMLIonModalElement> = {}

@Directive({
  selector: '[shared-modal]'
})
export class SharedModalDirective {
  @Input('shared-modal') id!: string
  private elType!: 'modal' | 'else'

  constructor(private el: ElementRef<HTMLIonModalElement | HTMLElement>) { }

  ngOnInit() {
    console.log(this.el.nativeElement)

    if (this.el.nativeElement.tagName === 'ion-modal') {
      modals[this.id] = this.el.nativeElement as HTMLIonModalElement
      this.elType = 'modal'
    } else {
      this.elType = 'else'
    }
  }

  @HostListener('click')
  onClick() {
    if (this.elType === 'modal') return
    modals[this.id].present()
  }
}
