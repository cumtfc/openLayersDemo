import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import 'hammerjs';
import {Map} from './../../core/_index';

import * as ol from 'openlayers';
import {MapService} from "../../services/map.service";
import * as OpenLayers from "openlayers";
import Overlay = ol.Overlay;

@Component({
  selector: 'ol-map',
  templateUrl: './map.component.html'
})
export class MapComponent implements AfterViewInit, OnInit {
  @Input() options: any;
  @Output() mapCreated = new EventEmitter();
  @Output() sidebarToggled = new EventEmitter();

  map: Map;
  view: ol.View;
  target: string;
  hasSidebar: boolean;
  zoomDuration = 500;
  sidebarCollapsible = false;
  coords:any;//当前坐标
  overlay = new Overlay({
    element: document.getElementById('popup-container'),
    positioning: 'bottom-center',
    offset: [0, -10]
  });

  constructor(private mapService: MapService) {

  }

  ngOnInit() {
    this.sidebarCollapsible = (this.hasSidebar && this.options.sidebar.hasOwnProperty('collapsible'))
      ? this.options.sidebar.collapsible : false;
    this.target = this.options.map.target;
    this.view = new ol.View({
      projection: this.options.map.hasOwnProperty('view') && this.options.map.view.hasOwnProperty('projection')
        ? this.options.map.view.projection : 'EPSG:900913',
      center: this.options.map.hasOwnProperty('view') && this.options.map.view.hasOwnProperty('center')
        ? this.options.map.view.center : ol.proj.fromLonLat([19.39563, 47.16846], 'EPSG:900913'),
      zoom: this.options.map.hasOwnProperty('view') && this.options.map.view.hasOwnProperty('zoom')
        ? this.options.map.view.zoom : 7,
      resolutions: this.options.map.hasOwnProperty('view') && this.options.map.view.hasOwnProperty('resolutions')
        ? this.options.map.view.resolutions : undefined
    });
  }

  ngAfterViewInit(): any {
    this.map = new Map({
      layers: [],
      target: this.target,
      view: this.view
    });
    this.map.addControl(new ol.control.ZoomSlider);
    this.map.addControl(new ol.control.FullScreen);
    this.map.addControl(new ol.control.MousePosition);
    this.map.addControl(new ol.control.ScaleLine);
    this.map.addOverlay(this.overlay);
    // register the map in the injectable mapService
    this.mapService.addMap(this.map);
    this.map.addLayersAndLayerGroups(this.options.map.layers);
    this.mapCreated.emit(this.map);
    this.map.updateSize();
    navigator.geolocation.getCurrentPosition((pos)=> {
      this.coords = ol.proj.fromLonLat([pos.coords.longitude, pos.coords.latitude]);
    });
    this.map.on('click',(e)=> {
      let features = this.map.getFeaturesAtPixel(e.pixel);
      console.log(e)//获取坐标
      console.log(features[0].getGeometry().getExtent())//获取feature坐标
      // if (features) {
      //   let coords = features[0].getGeometry().getCoordinates();
      //   let hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coords));
      //   this.overlay.getElement().innerHTML = hdms;
      //   this.overlay.setPosition(coords);
      // }
    });
    console.log(this.map)
  }

  public zoomIn(): void {
    const view = this.map.getView();
    view.animate({zoom: view.getZoom() + 1, duration: this.zoomDuration});
  }

  public zoomOut(): void {
    const view = this.map.getView();
    view.animate({zoom: view.getZoom() - 1, duration: this.zoomDuration});
  }


}
