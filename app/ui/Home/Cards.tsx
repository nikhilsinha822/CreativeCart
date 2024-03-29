import { getRecommendedProducts } from '../../lib/data'
import { productType } from '@/app/lib/definations';

const CardWrapper = async () => {
    const { products } = await getRecommendedProducts();
    return <div className='grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-5 md:gap-5'>
        {
            products.map((product: productType) => {
                return <Card key={product._id} product={product} />
            })
        }
    </div>
}

const Card = ({ product }: { product: productType }) => {
    return <div className='bg-white p-3 rounded-sm border shadow-sm'>
        <img className='m-auto h-44 md:h-56' src={product.images[0].url} alt={product.title} />
        <p className='font-bold text-sm pb-1 pt-3'>Rs. {product.price}</p>
        <p className='text-gray-400 text-sm'>{product.title}</p>
    </div>
}

export default CardWrapper