import { productType, productResponseType } from "./definations"

export const getRecommendedProducts = async () : Promise<{products: productType[]}> => {
    try{
        const response = await fetch(`${process.env.BASE_URL}/api/v1/product?page=1&pageSize=10`)
        const data : productResponseType = await response.json();
        const products = data.data;
        return {products};
    } catch(err) {
        console.log(err);
        throw new Error('There was a problem in fetching recommended products');
    }
}