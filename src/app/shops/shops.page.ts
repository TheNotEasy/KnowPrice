import { Component, NgIterable, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemComponent } from '../components/item/item.component';

type Item = {
  "id": number,
  "name": string,
  "price": number,
}

type ResponseData = {
  "id": number,
  "name": string,
  "categories": Array<string>,
  "rating": number,
  "items": Array<{"category": number, "items": Array<Item>}>
}

@Component({
  selector: 'app-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})

export class ShopsPage implements OnInit {
  public data!: ResponseData

  private itemsGroups!: NodeListOf<Element>;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit() {
    const rawId = this.activatedRoute.snapshot.paramMap.get('id')
    if (rawId === null) {return}
    this.data = this.fetchShopData(+rawId)
  }

  ngAfterViewInit() {
    const categories = document.querySelectorAll('.goods__category')
    categories[0].classList.add('selected')
    let selectedCategory = document.getElementsByClassName('selected')[0]

    categories.forEach(el => {
      el.addEventListener('click', () => {
        if (el === selectedCategory) {
          return
        }

        selectedCategory.classList.remove('selected')
        el.classList.add('selected')
        selectedCategory = el

        const category = el.textContent
        if (category === null) {return}

        const id = this.data?.categories.indexOf(category)
        if (id === undefined) {return}

        this.categoryChanged(id)
      })
    })

    const itemsGroups = document.querySelectorAll('.goods__list')
    itemsGroups[0].classList.add('selected')

    this.itemsGroups = itemsGroups
  }

  fetchShopData(id: number) {
    // let data = fetch("")
    return {
      "id": id,
      "name": "Манчаары",
      "categories": ['Мучное', 'Консервы', 'Салаты'],
      "rating": 4.2,
      "items": [
        {"category": 0, "items": [
          {"id": 0, "name": "1", "price": 180},
          {"id": 1, "name": "test", "price": 180},
          {"id": 2, "name": "test", "price": 180},
        ]},
        {"category": 1, "items": [
          {"id": 0, "name": "2", "price": 180},
          {"id": 1, "name": "test", "price": 180},
          {"id": 2, "name": "test", "price": 180},
        ]},
        {"category": 2, "items": [
          {"id": 0, "name": "3", "price": 180},
          {"id": 1, "name": "test", "price": 180},
        ]}
      ]
    }
  }

  categoryChanged(id: number) {
    document.querySelector('.goods__list.selected')?.classList.remove('selected')
    this.itemsGroups[id].classList.add('selected')
  }
}
