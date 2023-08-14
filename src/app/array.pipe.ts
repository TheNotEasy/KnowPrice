import { ElementRef, Pipe, PipeTransform } from '@angular/core';

class KeyValue<K, V> {
  constructor(public key: K, public value: V) {}
}

@Pipe({
  name: 'array'
})
export class ArrayPipe implements PipeTransform {
  transform<K extends string | number | symbol, V>(value: Record<K, V>): KeyValue<K, V>[] {
    const keyValues = []
    for (const [key, data] of Object.entries<V>(value)) {
      keyValues.push(
        new KeyValue(key as K, data)
      )
    }
    return keyValues
  }
}
