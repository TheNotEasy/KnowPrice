import { Component, ElementRef, NgIterable, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemComponent } from '../components/item/item.component';
import { LanguageService } from '../language.service';
import { ApiService, RequestMethod, RequestTarget } from '../api.service';
import { QueryList } from '@angular/core';

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
  "item_set": Array<{'id': number, 'name': string, 'price': number, 'category': number}>,
  'address': string,
}

@Component({
  selector: 'app-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})

export class ShopsPage implements OnInit {
  public data!: ResponseData

  public readyPromise!: Promise<any[]>
  public isLoadingFailed: boolean = false

  constructor(
    private activatedRoute: ActivatedRoute,
    public lang: LanguageService,
    public api: ApiService,
  ) {}

  @ViewChild('loading') public loadingEl!: {'nativeElement': HTMLElement}
  @ViewChild('content') public page!: ElementRef<HTMLElement>

  @ViewChildren(ItemComponent) public items!: QueryList<ItemComponent>

  ngOnInit() {
    const rawId = this.activatedRoute.snapshot.paramMap.get('id')
    if (rawId === null) {throw Error("got null on rawId")}
    this.readyPromise = this.api.makeRequest(RequestMethod.GET, RequestTarget.SHOP, rawId)
    this.readyPromise.then(([data, status]) => {
      this.data = data
    })
  }

  ngAfterViewInit() {
    let selected: HTMLElement | null = null
    let index = 0
    const categories = document.querySelectorAll('.goods__category')
    const selectedInterval = setInterval(() => {
      let el = categories[index]

      if (selected) {
        selected.classList.remove('selected')
      }
      el.classList.add('selected')
      selected = el as HTMLElement

      if (index === 3) {
        index = 0
        return
      }
      index++
    }, 300)

    this.readyPromise.then(() => {
      clearInterval(selectedInterval)
      categories.forEach((el) => {
        el.classList.remove('selected')
      })
      setTimeout(() => {
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

        this.categoryChanged(0)
      }, 1)
    }, () => {
      this.isLoadingFailed = true
    })
  }

  async fetchShopData(id: string) {
    // let data = fetch("")
    console.log('asd')
    return await this.api.makeRequest(RequestMethod.GET, RequestTarget.SHOP, id)
  }

  categoryChanged(id: number) {
    console.log(id)
    this.items.forEach(item => {
      let parent = item.element.el.parentElement
      if (parent === null) {
        throw Error("Item component 'card' elementref has no got parent")
      }
      parent.hidden = item.category !== id
    })
  }

  ionViewWillEnter() {
    this.items.forEach(item => {
      item.updateView()
    })
  }
}
