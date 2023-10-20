import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDate'
})
export class ShortDatePipe implements PipeTransform{
    transform(rawDate: string) {
        return `${new Date(rawDate).toLocaleDateString()} ${new Date(rawDate).toLocaleTimeString()}`;
    }
}