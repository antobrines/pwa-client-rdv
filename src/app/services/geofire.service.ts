import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as geofire from 'geofire-common';

@Injectable({
  providedIn: 'root'
})
export class GeofireService {
  prestaries: any = [];
  markers: any = [];
  radiusInM = 50 * 1000;

  constructor(private afs: AngularFirestore) { }

  getHash(lat: number, lng: number) {
    return geofire.geohashForLocation([lat, lng]);
  }

  getBounds(lat: number, lng: number, radius: number) {
    return geofire.geohashQueryBounds([lat, lng], radius);
  }

  getDistanceBetweenKm(lat1: number, lng1: number, centerLat: number, centerLng: number) {
    return geofire.distanceBetween([lat1, lng1], [centerLat, centerLng]);
  }

  async getPrestatariesInRadius(center: any, radius: any) {
    const bounds = this.getBounds(center.lat, center.lng, radius);
    const promises = [];
    for (const b of bounds) {
      const q = this.afs.collection('users',
      (ref) => {
        return ref.orderBy('geohash').startAt(b[0]).endAt(b[1]);
      });
      promises.push(q.get().toPromise());
    }
    const snapShots = await Promise.all(promises);
    return snapShots;
  }
}
