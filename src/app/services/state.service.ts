import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _prestaSelected = new BehaviorSubject<any>(null);
  public prestaSelected$ = this._prestaSelected.asObservable();
  constructor() {}

  updateSelection(newSelection: any) {
    this._prestaSelected.next(newSelection);
  }
}
