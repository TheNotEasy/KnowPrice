import { ComponentRef, Directive, EventEmitter, Input, Output, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { ErrorComponent } from '../error/error.component';
import { IonModal, IonSpinner, LoadingController } from '@ionic/angular';

@Directive({
  selector: '[appLoadable]'
})
export class LoadableDirective {
  @Input() appLoadable!: TemplateRef<any>;
  @Input('promise') readyPromise: Promise<any> | undefined;
  @Output('callback') callback = new EventEmitter();
  @Input() modal: IonModal | null = null;
  @Input() useLoadingModal: boolean = true
  @Input() spinnerView!: ViewContainerRef

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

    if (this.useLoadingModal) (await this.loadingController.create({"message": "Подождите..."})).present()
    else {
      let spinnerComponent = this.viewContainerRef.createComponent(IonSpinner);
      let spinnerElementStyle: CSSStyleDeclaration = spinnerComponent.location.nativeElement.style;
      spinnerElementStyle.margin = "auto";
    }

    promise.then((_: any) => {
      if (this.useLoadingModal)
        this.loadingController.dismiss();
      else
        this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(this.appLoadable);
    }, (_: any) => {
      if (this.useLoadingModal)
        this.loadingController.dismiss();
      else
        this.viewContainerRef.clear()
      this.modal?.present();
      this.errorComponentRef = this.viewContainerRef.createComponent(ErrorComponent);
      this.errorComponentRef.instance.callback = this.callback;
    })
  }
}
