import { Injectable } from '@angular/core';
import { Map } from '../core/_index';

@Injectable()
export class MapService {
    maps: Map[];

    constructor() {
        this.maps = [];
    }

    /**
     * Retrieves all the maps
     */
    getMaps(): Map[] {
        return this.maps;
    }

    /**
     * Returns a map object from the maps array
     */
    getMapById(id: string): Map {
        let map: Map = null;
        for (let i = 0; i < this.maps.length; i++) {
            if (this.maps[i].getTarget() === id) {
                map = this.maps[i];
                break;
            }
        }
        return map;
    }

    /**
     * Adds a new map to the maps array
     */
    addMap(map: Map): void {
        this.maps.push(map);
    }

}
