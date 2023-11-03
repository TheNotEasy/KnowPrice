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
  
  private dismiss() {
    if (this.useLoadingModal)
      this.loadingController.dismiss();
    else
      this.viewContainerRef.clear();
  }

  async ngOnChanges(changes: SimpleChanges) {
    let promise: Promise<any> = changes['readyPromise'].currentValue;
    if (!promise) return;

    this.viewContainerRef.clear();

    if (this.useLoadingModal) {
      const overlay = await this.loadingController.create({"message": "Подождите..."});
      await overlay.present();
    }
    else {
      let spinnerComponent = this.viewContainerRef.createComponent(IonSpinner);
      let spinnerElementStyle = spinnerComponent.location.nativeElement.style;
      spinnerElementStyle.margin = "auto";
    }

    promise.then((_: any) => {
      this.dismiss();
      this.viewContainerRef.createEmbeddedView(this.appLoadable);
    }, (_: any) => {
      this.dismiss();
      this.modal?.present();
      this.errorComponentRef = this.viewContainerRef.createComponent(ErrorComponent);
      this.errorComponentRef.instance.callback = this.callback;
    })
  }
}
