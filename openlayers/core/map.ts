import { Layer } from './layer';
import { Layergroup } from './layergroup';
import * as ol from 'openlayers'
export class Map extends ol.Map {

  options: any;

  layers: Layer[];
  layerGroups: Layergroup[];

  constructor(options: any) {
    super(options);
    this.options = options;
    this.layers = [];
    this.layerGroups = [];
  }

  public addLayersAndLayerGroups(optionLayers: any[]): any {
    for (let i = 0; i < optionLayers.length; i++) {
      const element = optionLayers[i];
      this.handleLayerOrLayerGroup(element, null);
    }
  }

  private handleLayerOrLayerGroup(element: any, layerGroup: Layergroup): any {
    if (element.type === 'layer') {
      const newLayer = new Layer(element);
      this.addLayer(element.layer);
      if (layerGroup !== null) {
        layerGroup.getChildren().push(newLayer);
      } else {
        this.layers.push(newLayer);
      }
    } else if (element.type === 'layergroup') {
      const newLayerGroup = new Layergroup(element);
      this.layerGroups.push(newLayerGroup);
      for (let i = 0; i < element.children.length; i++) {
        this.handleLayerOrLayerGroup(element.children[i], newLayerGroup);
      }
    }
  }

  public getMangolLayers(): Layer[] {
    return this.layers;
  }

  public getMangolLayerGroups(): Layergroup[] {
    return this.layerGroups;
  }

}
