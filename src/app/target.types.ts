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
    shop: {
        id: number,
        name: string,
    }
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

export type Auth = {
    auth_token?: string
    username?: string[],
    password?: string[],
    non_field_errors?: string[],
}

export interface RequestTargetTypesMap {
    'item': Item
    'shop': Shop
    'shop-data': ShopData,
    'auth/token/login': Auth,
    'auth/users': Auth,
    'find': Item[] | Shop[]
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