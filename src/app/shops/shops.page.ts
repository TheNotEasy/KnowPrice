import { Component, NgIterable, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemComponent } from '../components/item/item.component';
import { LanguageService } from '../language.service';

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
  "items": Array<{'id': number, 'name': string, 'price': number, 'category': number}>,
  'address': string,
}

@Component({
  selector: 'app-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})

export class ShopsPage implements OnInit {
  public data!: ResponseData

  private itemsGroups!: NodeListOf<Element>
  private selectedCategoryGroup!: NodeListOf<HTMLElement>

  constructor(
    private activatedRoute: ActivatedRoute,
    public lang: LanguageService,
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
    
    this.selectedCategoryGroup = document.querySelectorAll('[ng-reflect-category="0"]')

    this.categoryChanged(0)
  }

  fetchShopData(id: number) {
    // let data = fetch("")
    return {
      "id": id,
      "name": "Манчаары",
      "categories": ['Мучное', 'Консервы', 'Салаты'],
      "rating": 4.2,
      'address': 'ул. Манчаары, 21',
      "items": [
        {"id": 0, "name": "1", "price": 180, 'category': 0},
        {"id": 1, "name": "test", "price": 180, 'category': 0},
        {"id": 2, "name": "test", "price": 180, 'category': 0},
        {"id": 3, "name": "2", "price": 180, 'category': 1},
        {"id": 4, "name": "test", "price": 180, 'category': 1},
        {"id": 5, "name": "test", "price": 180, 'category': 1},
        {"id": 6, "name": "3", "price": 180, 'category': 2},
        {"id": 7, "name": "test", "price": 180, 'category': 2},
    ]
    }
  }

  categoryChanged(id: number) {
    document.querySelectorAll('app-item').forEach(el => {
      el.hidden = el.getAttribute('ng-reflect-category') !== String(id)
    })
  }
}
