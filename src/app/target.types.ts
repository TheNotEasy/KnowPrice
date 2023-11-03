export type ItemData = {
    id: number
    name: string
    image: string
    imageAlt: string
    price: number
    sale: number
    in_stock: boolean
    category: number
    shop: {
        id: number,
        name: string,
    }
}

export type Item = ItemData & {
    markdown: string
}

export type ShopData = {
    id: number
    name: string
    ratings: string
}

export type Shop = ShopData & {
    contacts: Record<string, string>
    owner: number
    item_set: Array<Item>
    categories: string[]
}

export type Auth = {
    auth_token?: string
    username?: string[],
    password?: string[],
    non_field_errors?: string[],
}

export type City = {
    name: string
}

export interface RequestTargetTypesMap {
    'item': Item
    'item-data': ItemData
    'shop': Shop
    'shop-data': ShopData,
    'auth/token/login': Auth,
    'auth/users': Auth,
    'find/item': ItemData[],
    'find/shop': ShopData[],
    'city/shops': ShopData[],
    'city/list': City[],
}

export type ApiResponse<T = any, S = boolean> = {
    success: true
    data: T
    code: number
    rawResponse: Response
} | ({
    success: false
} & ({
    isFetchError: false
    data: T
    code: number
    rawResponse: Response
} | {
    isFetchError: true
    error: Error
})) & {
    success: S
}