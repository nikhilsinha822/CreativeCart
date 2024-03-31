'use server'
import { productType, productResponseType } from "./definations"

export const getRecommendedProducts = async () : Promise<{products: productType[]}> => {
    try{
        const response = await fetch(`${process.env.BASE_URL}/api/v1/product?page=1&pageSize=10`)
        const data : productResponseType = await response.json();
        const products = data.data;
        return {products};
    } catch(err) {
        throw new Error('There was a problem in fetching recommended products');
    }
}

export const getSearchResults = async (searchTerm: string) : Promise<{data: productResponseType}> => {
    try{
        const response = await fetch(`${process.env.BASE_URL}/api/v1/product?search=${searchTerm}`)
        const data : productResponseType = await response.json();
        return {data};
    } catch(err) {
        throw new Error('There was a problem in fetching search results');
    }
}