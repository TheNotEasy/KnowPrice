export interface HomeCollection {
  title: string
  shops: {name: string, rating: number}[]
  type: "near" | "fav" | "recent"
}

export interface CartItem {
  id: number
  name: string
  price: number
  store: string
  checked: boolean
}

export interface Item {
  id: number
  name: string
  price: number
  store: number
}
