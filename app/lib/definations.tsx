export type Images = {
    url: string;
    public_id: string;
    _id: string;
}

export type productType = {
    _id: string;
    category: string;
    title: string;
    images: Images[];
    summary: string;
    desc: string;
    price: number;
    stock: number;
    rating: {
        stars: number
        numReviews: number
    }
    createdBy: string;
    discountType: string;
    discountValue: number;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

export type productResponseType = {
    success: boolean;
    totalProducts: number;
    matchedProducts: number;
    matchedPages: number;
    page: string;
    pageSize: string;
    data: productType[];
}

export type cartItemType = {
    product: string;
    quantity: number;
    variations: {
        image: Images[],
        size: number
    }
    createdAt: string;
    _id: string;
}

export type cartDataType = {
    _id: string;
    cartItems: cartItemType[];
    createdBy: string;
    status: string;
}

export type cartResponseType = {
    success: boolean;
    subTotal: number;
    totalSavings: number;
    finalprice: number;
    data: cartDataType[];
}

export type cartItemStateType = {
    product: productType;
    quantity: number;
    variations: {
        image: Images[];
        size: number;
    };
    createdAt: string;
    _id: string;
}

export type cartStateType = {
    subTotal: number;
    totalSavings: number;
    finalprice: number;
    data: {
        cartItems: cartItemStateType[];
        _id: string;
        createdBy: string;
        status: string;
    };
}

export type shippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
    phoneNo: number;
    _id?: string;
}

export type userResponseType = {
    name: string,
    email: string,
    avatar: {
        url: string
        public_id: string
    },
    role: string[],
    shippingInfo: shippingInfoType[]
}

export type orderResponseType = {
    shippingInfo: shippingInfoType,
    paymentInfo: {
        id: string,
        status: string
    },
    _id: string,
    user: string,
    cart: string,
    subTotal: number,
    totalSavings: number,
    finalPrice: number,
    status: string,
    createdAt: string,
    __v: number,
    paidAt: string

}

export type cartProductType = {
    _id: string,
    cartItems: productType[],
    createdBy: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}

export type orderCartProductType = {
    shippingInfo: shippingInfoType,
    paymentInfo: {
        id: string,
        status: string
    },
    _id: string,
    user: string,
    cart: cartProductType,
    subTotal: number,
    totalSavings: number,
    finalPrice: number,
    status: string,
    createdAt: string
}

// {
// "shippingInfo": {
//     "address": "Mehdauri colony",
//     "city": "Teliarganj",
//     "state": "Uttar Pradesh",
//     "country": "India",
//     "pinCode": 211004,
//     "phoneNo": 9839639749
// },
// "paymentInfo": {
//     "id": "order_O2L3AtRYyslSSy",
//     "status": "created"
// },
// "_id": "662893ba6aae1b2786c1075e",
// "user": "65cfaa053000705dd280d4f0",
// "cart": {
//     "_id": "6612d040e71a1fcaf2010233",
//     "cartItems": [
//         {
//             "rating": {
//                 "stars": 16833,
//                 "numReviews": 5611
//             },
//             "_id": "6606a5384de662d6c3c9e707",
//             "category": "6606a5374de662d6c3c96eae",
//             "title": "Handmade Recycled Bronze Sausages Mobile Broadband Devices",
//             "images": [
//                 {
//                     "publicId": "be4c3302-ab55-4879-9a72-192507ff9d71",
//                     "url": "https://loremflickr.com/640/480?lock=1419147514740736",
//                     "_id": "6606a5384de662d6c3c9e708"
//                 },
//                 {
//                     "publicId": "c8dccef0-8fbc-4c4c-b1dd-8d833d6da5d5",
//                     "url": "https://picsum.photos/seed/bbCYjRLM/640/480",
//                     "_id": "6606a5384de662d6c3c9e709"
//                 },
//                 {
//                     "publicId": "a97c90e7-a95c-4856-8232-879c497dd5a8",
//                     "url": "https://picsum.photos/seed/ATQUN/640/480",
//                     "_id": "6606a5384de662d6c3c9e70a"
//                 },
//                 {
//                     "publicId": "330b5c88-a439-4ad5-8b5d-5e3e048d3ca1",
//                     "url": "https://loremflickr.com/640/480?lock=5055884625444864",
//                     "_id": "6606a5384de662d6c3c9e70b"
//                 }
//             ],
//             "summary": "Handmade",
//             "desc": "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
//             "price": 88828,
//             "stock": 7987,
//             "createdBy": "6606a5374de662d6c3c96eaf",
//             "discountType": "none",
//             "discountValue": 23,
//             "__v": 0,
//             "createdAt": "2024-03-29T11:25:46.454Z",
//             "updatedAt": "2024-04-24T08:05:08.067Z"
//         },
//         {
//             "rating": {
//                 "stars": 16833,
//                 "numReviews": 5611
//             },
//             "_id": "6606a5384de662d6c3c9e707",
//             "category": "6606a5374de662d6c3c96eae",
//             "title": "Handmade Recycled Bronze Sausages Mobile Broadband Devices",
//             "images": [
//                 {
//                     "publicId": "be4c3302-ab55-4879-9a72-192507ff9d71",
//                     "url": "https://loremflickr.com/640/480?lock=1419147514740736",
//                     "_id": "6606a5384de662d6c3c9e708"
//                 },
//                 {
//                     "publicId": "c8dccef0-8fbc-4c4c-b1dd-8d833d6da5d5",
//                     "url": "https://picsum.photos/seed/bbCYjRLM/640/480",
//                     "_id": "6606a5384de662d6c3c9e709"
//                 },
//                 {
//                     "publicId": "a97c90e7-a95c-4856-8232-879c497dd5a8",
//                     "url": "https://picsum.photos/seed/ATQUN/640/480",
//                     "_id": "6606a5384de662d6c3c9e70a"
//                 },
//                 {
//                     "publicId": "330b5c88-a439-4ad5-8b5d-5e3e048d3ca1",
//                     "url": "https://loremflickr.com/640/480?lock=5055884625444864",
//                     "_id": "6606a5384de662d6c3c9e70b"
//                 }
//             ],
//             "summary": "Handmade",
//             "desc": "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
//             "price": 88828,
//             "stock": 7987,
//             "createdBy": "6606a5374de662d6c3c96eaf",
//             "discountType": "none",
//             "discountValue": 23,
//             "__v": 0,
//             "createdAt": "2024-03-29T11:25:46.454Z",
//             "updatedAt": "2024-04-24T08:05:08.067Z"
//         }
//     ],
//     "createdBy": "65cfaa053000705dd280d4f0",
//     "status": "abandonned",
//     "createdAt": "2024-04-07T16:56:32.961Z",
//     "updatedAt": "2024-05-04T18:39:35.228Z",
//     "__v": 1315
// },
// "subTotal": 444140,
// "totalSavings": 0,
// "finalPrice": 444140,
// "status": "Confirmed",
// "createdAt": "2024-04-24T05:08:10.543Z",
// "__v": 0,
// "paidAt": "2024-04-24T05:14:55.028Z"
// }