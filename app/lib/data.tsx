// 'use server'
import { productType, productResponseType, cartResponseType, cartStateType } from "./definations"

export const getRecommendedProducts = async (): Promise<{ products: productType[] }> => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/v1/product?page=1&pageSize=10`)
        const data: productResponseType = await response.json();
        const products = data.data;
        return { products };
    } catch (err) {
        throw new Error('There was a problem in fetching recommended products');
    }
}

export const getSearchResults = async (searchTerm: string): Promise<{ data: productResponseType }> => {
    try {
        const response = await fetch(`${process.env.BASE_URL}/api/v1/product?search=${searchTerm}`)
        const data: productResponseType = await response.json();
        return { data };
    } catch (err) {
        throw new Error('There was a problem in fetching search results');
    }
}

export const prepareCart = async ({ token }: { token: string }) : Promise<cartStateType | null> => {
    const headers = {
        Authorization: `Bearer ${token}`
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/cart`, {
        headers,
        cache: 'no-store'
    })
    const data: cartResponseType = await response.json();

    if (!data.success || data.data.length === 0 || data.data[0].cartItems.length === 0)
        return null;

    const productList = data.data[0].cartItems.map(async (item) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/product/${item.product}`)
        const productResponse: { success: Boolean, data: productType } = await res.json();
        return productResponse.data;
    })

    const products = await Promise.all(productList);

    const descCartItems = data.data[0].cartItems.map((item, index) => {
        return {
            ...item,
            product: products[index]
        }
    })

    const cart = {
        subTotal: data.subTotal,
        totalSavings: data.totalSavings,
        finalprice: data.finalprice,
        data:{
            ...data.data[0],
            cartItems: descCartItems
        }
    }
    return cart;
}