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



