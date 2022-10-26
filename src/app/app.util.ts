import { Injectable } from '@angular/core';

@Injectable()
export class AppUtil {
  public shorten(text: string): string {
    const max = 40;
    if (text.length > max) {
      return `${text.substring(0, 30)}...`;
    }
    return text;
  }

  public sortAppointments(list: any[]): any[] {
    return list.sort((a, b) => {
      const startA = new Date(a.start);
      const startB = new Date(b.start);
      
      if (startA > startB) {
        return 1;
      } else if (startA < startB) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}
