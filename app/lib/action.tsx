'use server'
import z from 'zod';
import axios from 'axios';
import { shippingInfoType, userResponseType } from './definations';
import { revalidateTag } from 'next/cache'

const addressSchema = z.object({
    address: z.string().min(10, { message: "Address should be atleast 10 characters long" }).max(100, { message: "Address should be atmost 100 characters long" }),
    city: z.string().min(3, { message: "City should be atleast 3 characters long" }).max(50, { message: "City should be atmost 50 characters long" }),
    state: z.string().min(3, { message: "State should be atleast 3 characters long" }).max(50, { message: "State should be atmost 50 characters long" }),
    country: z.string().min(3, { message: "Country should be atleast 3 characters long" }).max(50, { message: "Country should be atmost 50 characters long" }),
    pinCode: z.number({
        invalid_type_error: "Invalid pin code",
    }).min(100000, { message: "Invalid pin code" }).max(999999, { message: "Invalid pin code" }),
    phoneNo: z.number({
        invalid_type_error: "Invalid phone number",
    }).min(1000000000, { message: "Invalid phone number" }).max(9999999999, { message: "Invalid phone number" })
})

export const createOrder = async (prevState: { data: { token: string, order: string, cart: string | null } }, formData: FormData) => {
    const headers = {
        Authorization: `Bearer ${prevState.data.token}`
    }

    let cartResponse, cartId;

    try {
        if (prevState.data.cart) {
            cartResponse = await axios.get(`${process.env.BASE_URL}/api/v1/cart/${prevState.data.cart}`, { headers });
            cartId = cartResponse.data.data._id;
        }
        else {
            cartResponse = await axios.get(`${process.env.BASE_URL}/api/v1/cart`, { headers });
            cartId = cartResponse.data.data[0]._id
        }
    } catch (err) {
        return { success: false, message: "Cart is empty", data: prevState.data }
    }

    const finalPrice = cartResponse.data.finalPrice;

    if (finalPrice > 500000)
        return { success: false, message: "Order value should be less than ₹500000. Please remove some items from cart", data: prevState.data }

    const validatedFields = addressSchema.safeParse({
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        country: formData.get('country'),
        pinCode: Number(formData.get('pinCode')),
        phoneNo: Number(formData.get('phoneNo')),
    });

    if (!validatedFields.success)
        return { success: false, message: validatedFields.error.errors[0].message, data: prevState.data };

    const body = {
        cart: cartId,
        shippingInfo: {
            address: validatedFields.data.address,
            city: validatedFields.data.city,
            state: validatedFields.data.state,
            country: validatedFields.data.country,
            pinCode: validatedFields.data.pinCode,
            phoneNo: validatedFields.data.phoneNo,
        }
    }
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/order`, { ...body }, { headers })
        const order = response.data.data.order._id;
        return { success: true, message: "Success", data: { ...prevState.data, order } }
    } catch (err: any) {
        // console.log(err);
        return { success: false, message: "There was some Error in creating Order", data: { ...prevState.data } }
    }
}

const userProfile = z.object({
    name: z.string({
        invalid_type_error: "Invalid name",
        required_error: "Name is required",
    }),
    email: z.string({
        invalid_type_error: "Invalid email",
        required_error: "Email is required",
    }).email({
        message: "Invalid email format"
    }),
    avatar: z.any({
        invalid_type_error: "Invalid avatar",
    }),
})

export const handleProfile = async (prevState: { accessToken: string, message: string, user: userResponseType }, formData: FormData) => {
    const validatedFields = userProfile.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        avatar: formData.get('avatar')
    });

    if (validatedFields.success === false)
        return { ...prevState, message: validatedFields.error.errors[0].message }

    const formDataToSend = new FormData();

    if (validatedFields.data.avatar.size > 0)
        formDataToSend.append('avatar', validatedFields.data.avatar)

    formDataToSend.append('name', validatedFields.data.name)
    formDataToSend.append('email', validatedFields.data.email)

    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profile/me`,
            formDataToSend, {
            headers: {
                Authorization: `Bearer ${prevState.accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        })
        return { ...prevState, message: "Success", user: response.data.data }
    } catch (err: any) {
        console.log(err)
        return { ...prevState, message: err.response.data.message }
    }
}

export const deleteAddress = async (index: number, shippingInfo: shippingInfoType[], token: string) => {

    shippingInfo = shippingInfo.filter((val, ind) => ind != shippingInfo.length - 1 - index);

    try {
        await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profile/me`,
            {
                shippingInfo
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return { message: "Success", shippingInfo }
    } catch (err) {
        return { message: "Failure" }
    }
}

export const addNewAddress = async (prevState: { accessToken: string, message: string, user: userResponseType }, formData: FormData) => {
    const validatedFields = addressSchema.safeParse({
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        country: formData.get('country'),
        pinCode: Number(formData.get('pinCode')),
        phoneNo: Number(formData.get('phoneNo')),
    });

    if (validatedFields.success === false)
        return { ...prevState, message: validatedFields.error.errors[0].message }

    try {
        const newAddress = {
            address: validatedFields.data.address,
            city: validatedFields.data.city,
            state: validatedFields.data.state,
            country: validatedFields.data.country,
            pinCode: validatedFields.data.pinCode,
            phoneNo: validatedFields.data.phoneNo,
        }
        const shippingInfo = [...prevState.user.shippingInfo, newAddress];
        await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profile/me`,
            {
                shippingInfo
            }, {
            headers: {
                Authorization: `Bearer ${prevState.accessToken}`,
            }
        })
        prevState.user = { ...prevState.user, shippingInfo }
        return { ...prevState, message: "Success" }
    } catch (err: any) {
        return { ...prevState, message: err.response.data.message }
    }
}

const productSchema = z.object({
    title: z.string({
        invalid_type_error: "Invalid title",
        required_error: "Title is required",
    }).min(20, { message: "Title is too small" }),
    images: z.any({
        invalid_type_error: "Invalid images",
        required_error: "Images are required",
    }),
    summary: z.string({
        invalid_type_error: "Invalid summary",
        required_error: "Summary is required",
    }).min(50, { message: "Summary is too small" }),
    desc: z.string({
        invalid_type_error: "Invalid desc",
        required_error: "Desc is required",
    }).min(100, { message: "Description is too small" }),
    price: z.number({
        invalid_type_error: "Invalid price",
        required_error: "Price is required",
    }).min(0, { message: "Price cannot be negative" }),
    stock: z.number({
        invalid_type_error: "Invalid stock",
        required_error: "Stock is required",
    }).min(0, { message: "Stock cannot be negative" }),
    discountType: z.string({
        invalid_type_error: "Invalid discountType",
        required_error: "Discount Type is required",
    }),
    discountValue: z.number({
        invalid_type_error: "Invalid discountValue",
        required_error: "Discount Value is required",
    }).min(0, { message: "Discount Value cannot be negative" }),

})

export const addNewProduct = async (prevState: { success: boolean, token: string, error: boolean, data: null, message: string }, formData: FormData) => {
    const validatedFields = productSchema.safeParse({
        title: formData.get('title'),
        images: formData.getAll('images'),
        summary: formData.get('summary'),
        desc: formData.get('desc'),
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        discountType: formData.get('discountType'),
        discountValue: Number(formData.get('discountValue')),
    });


    if (validatedFields.success === false)
        return { ...prevState, error: true, message: validatedFields.error.errors[0].message }

    if (validatedFields.data.images.length < 4)
        return { ...prevState, error: true, message: "Atleast add 4 images of product" }

    const formDataToSend = new FormData();

    for (let i = 0; i < validatedFields.data.images.length; i++) {
        formDataToSend.append('images', validatedFields.data.images[i]);
    }
    formDataToSend.append('title', validatedFields.data.title)
    formDataToSend.append('summary', validatedFields.data.summary)
    formDataToSend.append('desc', validatedFields.data.desc)
    formDataToSend.append('price', validatedFields.data.price.toString())
    formDataToSend.append('stock', validatedFields.data.stock.toString())
    formDataToSend.append('discountType', validatedFields.data.discountType)
    formDataToSend.append('discountValue', validatedFields.data.discountValue.toString())

    try {
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/admin/product/new`, formDataToSend, {
            headers: {
                Authorization: `Bearer ${prevState.token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        revalidateTag(`products ${response.data.product}`)
        return { ...prevState, success: true, error: false, message: "Success", data: response.data.product }
    } catch (err: any) {
        return { ...prevState, error: true, message: err.response.data.message }
    }
}

export const handleDirectBuy = async (product: string, token: string) => {
    try {
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/directbuy`, { product }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return { success: true, message: "Success", data: response.data.data }
    } catch (err: any) {
        return { success: false, message: err.response.data.message, data: null }
    }
}