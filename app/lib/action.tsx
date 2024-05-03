'use server'
import z from 'zod';
import axios from 'axios';
import { shippingInfoType, userResponseType } from './definations';

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

export const createOrder = async (prevState: { data: { token: string, order: string } }, formData: FormData) => {
    const headers = {
        Authorization: `Bearer ${prevState.data.token}`
    }

    const cartResponse = await axios.get(`${process.env.BASE_URL}/api/v1/cart`, { headers })
    const cartId = cartResponse.data.data[0]._id;
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
        return { success: false, message: err.data.message, data: { ...prevState.data } }
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
        console.log(prevState)
        prevState.user = { ...prevState.user, shippingInfo }
        console.log(prevState)
        return { ...prevState, message: "Success" }
    } catch (err: any) {
        console.log(err.response)
        return { ...prevState, message: err.response.data.message }
    }
}