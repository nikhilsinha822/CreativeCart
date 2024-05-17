'use server'
import { productType, productResponseType, cartResponseType, cartStateType, orderResponseType, cartDataType, cartProductType } from "./definations"

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

export const prepareCart = async ({ token }: { token: string }): Promise<cartStateType | null> => {
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
        data: {
            ...data.data[0],
            cartItems: descCartItems
        }
    }
    return cart;
}

export const prepareOrder = async ({ token }: { token: string }) => {
    const headers = {
        Authorization: `Bearer ${token}`
    }

    const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order`, {
        headers
    });

    const orderData = await orderResponse.json();

    const confirmedOrder = orderData.data.filter((order: orderResponseType) => order.status === 'Confirmed')

    const orderList = confirmedOrder.map(async (order: orderResponseType) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/cart/${order.cart}`, {
            headers
        })
        const cartResponse: { success: Boolean, data: cartResponseType } = await res.json();
        return {
            ...order,
            cart: cartResponse.data
        };
    })

    const orders = await Promise.all(orderList);

    const ProductList = orders.map(async (order) => {
        const product = await getCartProducts({ cart: order.cart });

        return {
            ...order,
            cart: product
        }
    })

    const prod = Promise.all(ProductList);
    return prod;
}

export const getCartProducts = async ({ cart }: { cart: cartDataType }) => {
    const productList = cart.cartItems.map(async (item) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/product/${item.product}`)

        const productResponse: { success: Boolean, data: productType } = await res.json();
        return productResponse.data;
    })

    const prod = await Promise.all(productList);

    return {
        ...cart,
        cartItems: prod
    };
}