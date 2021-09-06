export type Location = {
    id?: string
    longitude?: number
    latitude?: number
    placeName?: string
    note?: string
}

export type User = {
    id?: string,
    username?: string,
    password?: string,
    fullName?: string,
    email?: string,
    photoURL?: string,
    socialToken?: string,
    loginType?: string,
    birthday?: Date,
    gender?: number,
    address?: string,
    note?: string
    location?:string
}

export type Session = {
    id?: string,
    title?: string,
    content?: string,
    done?: boolean,
    winLocation?: string,
    locations?: string,
    timeout?: number
}

