import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from './services/auth.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  resources: any = {
    en: {
      hello: 'hello',
      le:'LE'
    },
    ar: {
      hello: 'مرحبا',
      le: 'جنيه'
    }
  }
  constructor(private authService: AuthService) {

  }
  transform(value: any, args?: any): any {
    let lang = this.authService.getLanguage();

    if (this.resources && this.resources[lang] && this.resources[lang][value])
      return this.resources[lang][value];
    else
      return value;
  }


}
