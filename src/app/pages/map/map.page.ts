import {Component, OnDestroy, OnInit} from '@angular/core';
import {ViewDidEnter} from "@ionic/angular";
import {Geolocation} from '@capacitor/geolocation';
import {Map, tileLayer, circle} from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnDestroy, ViewDidEnter {

  private map: Map;
  private mapData;

  constructor() {
  }

  ngOnDestroy(): void {
  }

  ionViewDidEnter(): void {
    this.leafletInit();

  }

  async leafletInit() {
    this.mapData = await Geolocation.getCurrentPosition();
    console.log(this.mapData);
    this.map = new Map('mapView');
    this.map.setView([this.mapData.coords.latitude, this.mapData.coords.longitude], 23);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Yolo'
    }).addTo(this.map);

    this.map.on('click', (event) => {
      circle(
        [event.latlng.lat, event.latlng.lng],
        {color: 'red', radius: 10}).addTo(this.map);
    });

  }


}
