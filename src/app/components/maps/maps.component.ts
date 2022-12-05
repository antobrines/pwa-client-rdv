import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { GeofireService } from 'src/app/services/geofire.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  centerInitial = { lat: 48.864716, lng: 2.349014 };
  centerCurrent = { lat: 48.864716, lng: 2.349014 };
  myPostion = { lat: 48.864716, lng: 2.349014 };
  markers: any = [];
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: true,
    mapTypeControl: false,
    maxZoom: 16,
    minZoom: 4,
  };
  infoContent = '';

  @ViewChild(MapInfoWindow)
  info!: MapInfoWindow;
  @ViewChild(GoogleMap) map!: GoogleMap;

  constructor(private geofireService: GeofireService) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.centerInitial = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.centerCurrent = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.myPostion = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  ngOnInit(): void {}

  boundsChange() {
    // getCenter
    this.centerCurrent = this.map.getCenter()?.toJSON() || this.centerInitial;
    const bounds = this.map.getBounds()?.toJSON();
    const east = bounds?.east || 0;
    const north = bounds?.north || 0;
    const radius = this.geofireService.getDistanceBetweenKm(
      north,
      east,
      this.centerCurrent.lat,
      this.centerCurrent.lng
    );
    const snapShots = this.geofireService.getPrestatariesInRadius(
      this.centerCurrent,
      radius * 1000
    );
    snapShots.then((snapShots) => {
      snapShots.forEach((snapShot: any) => {
        snapShot.forEach((doc: any) => {
          const data = doc.data();
          const lat = data.lat;
          const lng = data.lng;
          const marker = {
            position: {
              lat: lat,
              lng: lng,
            },
            title: `${data.firstName} ${data.lastName}`,
            uid: data.uid,
            distance: Math.round(
              this.geofireService.getDistanceBetweenKm(
                lat,
                lng,
                this.centerInitial.lat,
                this.centerInitial.lng
              )
            ),
          };
          if (!this.markers.find((m: any) => m.uid === marker.uid)) {
            this.markers.push(marker);
          }
        });
      });
    });
  }

  openInfo(marker: MapMarker, content: any) {
    this.infoContent = content.title;
    this.info.open(marker);
  }
}
