import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  // * autoComplete
  streets: string[] = [];
  address = new FormControl('', Validators.required);
  filteredStreets: Observable<string[]>;
  postal_code: string = '';
  city: string = '';
  name: string = '';

  constructor() {
    // * Autocomplete
    this.filteredStreets = this.address.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  // * Filter for autocomplete (async may not work with bad connection)
  private _filter(value: string): string[] {
    const autocompleteService = new google.maps.places.AutocompleteService();
    const placeService = new google.maps.places.PlacesService(document.createElement('div'));
    if (value !== '') {
      autocompleteService.getPlacePredictions({ input: value, componentRestrictions: {country: 'fr'} }, (predictions, status) => {
        if (
          status != google.maps.places.PlacesServiceStatus.OK ||
          !predictions
        ) {
          return;
        }
        this.streets = [];
        predictions.forEach((prediction) => {
          placeService.getDetails({ placeId: prediction.place_id }, (place, status) => {
            if(status === google.maps.places.PlacesServiceStatus.OK) {
              if(place) {
                if(place.address_components) {
                  this.city = place.address_components[2]?.long_name;
                  this.postal_code = place.address_components[6]?.long_name;
                  if(place.name) {
                    this.name = place.name;
                  }
                }
              }
            }
            this.streets.push(prediction.description);
          });
        });
      });
    }
    const filterValue = this._normalizeValue(value);
    return this.streets.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  getLatLng(address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          if(results) {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            });
          }
        } else {
          reject(status);
        }
      });
    });
  }
}
