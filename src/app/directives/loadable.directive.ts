import { ComponentRef, Directive, EventEmitter, Input, Output, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ErrorComponent } from '../error/error.component';
import { IonModal, LoadingController } from '@ionic/angular';

@Directive({
  selector: '[appLoadable]'
})
export class LoadableDirective {
  @Input() appLoadable!: TemplateRef<any>;
  @Input('promise') readyPromise: Promise<any> | undefined;
  @Output('callback') callback = new EventEmitter();
  @Input() modal: IonModal | null = null;

  errorComponentRef: ComponentRef<ErrorComponent> | null = null;

  constructor(private viewContainerRef: ViewContainerRef,
              private loadingController: LoadingController) {}

  async ngOnChanges(changes: SimpleChanges) {
    let promise: Promise<any> = changes['readyPromise'].currentValue;
    console.log("Changed!")
    if (!promise) return;

    this.viewContainerRef.clear();
    // let spinnerComponent = this.viewContainerRef.createComponent(IonLoad);
    // let spinnerElementStyle: CSSStyleDeclaration = spinnerComponent.location.nativeElement.style;
    // spinnerElementStyle.margin = "auto";

    (await this.loadingController.create({"message": "Подождите..."})).present()

    promise.then((_: any) => {
      this.loadingController.dismiss();
      this.viewContainerRef.createEmbeddedView(this.appLoadable);
    }, (_: any) => {
      this.loadingController.dismiss();
      this.modal?.present();
      this.errorComponentRef = this.viewContainerRef.createComponent(ErrorComponent);
      this.errorComponentRef.instance.callback = this.callback;
    })
  }
}
