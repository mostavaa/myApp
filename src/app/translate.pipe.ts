import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Constants } from './services/constants';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  
  constructor(private authService: AuthService) {

  }
  transform(value: any, args?: any): any {
    let lang = this.authService.getLanguage();

    if (Constants.resources && Constants.resources[lang] && Constants.resources[lang][value])
      return Constants.resources[lang][value];
    else
      return value;
  }


}
