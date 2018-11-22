import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from './services/auth.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  resources: any = {
    en: {
      hello: 'hello',
      le: 'LE',
      rightsReserved: 'all rights reserved',
      logout: "logout"

    },
    ar: {
      hello: 'مرحبا',
      le: 'جنيه',
      rightsReserved: 'جميع الحقوق محفوظة',
      logout:"تسجيل الخروج"
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
