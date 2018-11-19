import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minStrLength'
})
export class MinStrLengthPipe implements PipeTransform {

  transform(value: any, min?: any): any {
    if (value.length > min) {
      return value.substring(0, min)+'..';
    }
    return value;
  }

}
