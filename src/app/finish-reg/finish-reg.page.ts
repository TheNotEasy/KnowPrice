import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { SelectCustomEvent } from '@ionic/angular';

type CitiesJson = {
  id: string
  parent_id: string | null
  name: string
  areas: CitiesJson[]
}

@Component({
  selector: 'app-finish-reg',
  templateUrl: './finish-reg.page.html',
  styleUrls: ['./finish-reg.page.scss'],
})
export class FinishRegPage implements OnInit {
  public citiesJson!: CitiesJson
  public readyPromise!: Promise<any>

  public regions: CitiesJson[] = []
  public cities: CitiesJson[] = []

  constructor() { }

  async openCities() {
    this.citiesJson = await (await fetch("/assets/cities.json")).json()
    this.parseRegions()
  }

  ngOnInit() {
    this.readyPromise = this.openCities()
  }

  async parseRegions() {
    for (const area of this.citiesJson.areas) {
      this.regions.push(area)
    }
  }

  parseCities(event: SelectCustomEvent) {
    console.log(event.detail.value)
    // for (const area of this.regions) {
    //   if (area.name !== this.selectedRegion)
    // }
  }
}
