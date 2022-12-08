import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatCard } from '@angular/material/card';
import { AuthService } from 'src/app/services/auth.service';
import { GeofireService } from 'src/app/services/geofire.service';
import { GoogleService } from 'src/app/services/google.service';

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


  @ViewChild(MapInfoWindow) info!: MapInfoWindow;
  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MatCard) card!: MatCard;

  constructor(
    private geofireService: GeofireService,
    private googleService: GoogleService,
    private authService: AuthService
  ) {
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
      // Add the current location
      this.markers.push({
        position: {
          lat: this.myPostion.lat,
          lng: this.myPostion.lng,
        },
        title: 'Ma position',
        uid: 0,
        distance: 0,
        options: {
          animation: google.maps.Animation.DROP,
          icon: {
            url: 'assets/icons/myPosition.png',
            scaledSize: new google.maps.Size(50, 50),
          },
        },
      });
      // Add the home location
      // this.authService.GetAuth().then((user: any) => {
      //   this.authService.GetUserData(user.uid).subscribe((data: any) => {
      //     this.markers.push({
      //       position: {
      //         lat: data.lat,
      //         lng: data.lng,
      //       },
      //       title: `Chez moi`,
      //       uid: 0,
      //       distance: 0,
      //       options: {
      //         animation: google.maps.Animation.DROP,
      //         icon: {
      //           url: 'assets/icons/myPositionHome.png',
      //           scaledSize: new google.maps.Size(40, 40),
      //         },
      //       },
      //     });
      //   });
      // });
    });
  }

  ngOnInit(): void {}

  boundsChange() {
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
      radius * 500
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
            isPrestatary: data.isPrestatary,
            distance: Math.round(
              this.geofireService.getDistanceBetweenKm(
                lat,
                lng,
                this.centerInitial.lat,
                this.centerInitial.lng
              )
            ),
            isHighlighted: false,
          };
          if (
            !this.markers.find((m: any) => m.uid === marker.uid) &&
            data.isPrestatary
          ) {
            this.markers.push(marker);
            this.googleService
              .getDistanceBetweenKmInNavigation(
                lat,
                lng,
                this.centerInitial.lat,
                this.centerInitial.lng
              )
              .then((distance: any) => {
                marker.distance = Math.round(distance * 100) / 100;
                this.markers = this.markers.filter(
                  (m: any) => m.uid !== marker.uid
                );
                this.markers.push(marker);
              });
          }
        });
      });
    });
  }

  openInfo(marker: MapMarker, content: any) {
    this.infoContent = content.title;
    const position = this.info.infoWindow?.get('position');
    this.info.open(marker);
    this.info.infoWindow?.focus();
    if (position === undefined) this.onCardClick(content, 0);
    else {
      this.onCardClick(content);
      this.info.infoWindow?.close();
      this.info.infoWindow?.set('position', undefined);
    }
  }

  onCardClick(marker: any, position: any = null) {
    this.markers = this.markers.map((m: any) => {
      if (m.uid === marker.uid) {
        if (position == null) m.isHighlighted = !m.isHighlighted;
        else if (position === 0) m.isHighlighted = true;
      } else {
        m.isHighlighted = false;
      }
      return m;
    });
  }
}
