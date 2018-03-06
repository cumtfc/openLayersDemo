import {Component, OnInit} from '@angular/core';
import {MapService} from "../shared/component/openlayers/services/map.service";
import * as ol from "openlayers";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  constructor(private mapService: MapService) {
  }

  config: any;


  onMapReady($event) {
    console.log(this.mapService);
  }

  public ngOnInit(): any {
    let pois = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([-73.97709499999999, 40.780863],'EPSG:4326'))
    });
    pois.setStyle(new ol.style.Style({
      image: new ol.style.Icon({
        // color: '#e0dc02',
        src: 'poi.png'
      })
    }));
    this.config = {
      map: {
        renderer: 'canvas',
        target: 'demo-simple-map',
        view: {
          projection: 'EPSG:4326',
          center: ol.proj.fromLonLat([-73.97709499999999, 40.780863], 'EPSG:4326'),
          zoom: 13,
        },
        layers: [
          {
            type: 'layer',
            name: 'geoServer layer',
            layer: new ol.layer.Tile({
              source: new ol.source.TileWMS({
                url: 'geoserver/wms',
                params: {
                  'FORMAT': "image/png",
                  'VERSION': '1.1.0',
                  layers: 'tiger-ny',
                },
                projection: 'EPSG:4326'
              })
            })
          }, {
            type: 'layer',
            name: 'poi layer',
            layer: new ol.layer.Vector({
              source: new ol.source.Vector({
                features: [pois]
              })
            })
          }
        ]
      }
    };
  };

}
