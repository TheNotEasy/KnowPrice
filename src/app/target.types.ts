export type ItemData = {
    id: number
    name: string
    image: string
    imageAlt: string
    price: number
    sale: number
    in_stock: boolean
    category: number
}

export type Item = ItemData & {
    shopId: number
    markdown: string
}

export type ShopData = {
    id: number
    name: string
    address: string
    ratings: string
}

export type Shop = ShopData & {
    contacts: Record<string, string>
    owner: number
    item_set: Array<Item>
    categories: string[]
}

export interface RequestTargetTypesMap {
    'item': Item
    'shop': Shop
    'shop-data': ShopData,
    'auth/token/login': {auth_token: string, username?: Array<string>, password?: Array<string>, non_field_errors?: Array<string>},
    'auth/users': {auth_token: string, username?: Array<string>, password?: Array<string>, non_field_errors?: Array<string>},
    'field': {result: string, error?: string}
}
