import { ElementRef, Pipe, PipeTransform } from '@angular/core';

class KeyValue {
  constructor(public key: any, public value: any) {}
}


@Pipe({
  name: 'array'
})
export class ArrayPipe implements PipeTransform {
  transform(value: Record<any, any>) {
    const keyValues = []
    for (const [key, data] of Object.entries(value)) {
      keyValues.push(
        new KeyValue(key, data)
      )
    }
    return keyValues
  }
}
