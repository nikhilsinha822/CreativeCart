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