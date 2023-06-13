export type Item = {
    id: number
    name: string
    image: string
    imageAlt: string
    price: number
    shopId: number
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
}

export interface RequestTargetTypesMap {
    'item': Item
    'shop': Shop
    'shop-data': ShopData,
    'auth/token/login': {auth_token: string, username?: Array<string>, password?: Array<string>, non_field_errors?: Array<string>},
    'auth/users': {auth_token: string, username?: Array<string>, password?: Array<string>, non_field_errors?: Array<string>},
}
