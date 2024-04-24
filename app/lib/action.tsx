'use server'
import zod from 'zod';
import axios from 'axios';

const orderSchema = zod.object({
    address: zod.string().min(10, { message: "Address should be atleast 10 characters long" }).max(100, { message: "Address should be atmost 100 characters long" }),
    city: zod.string().min(3, { message: "City should be atleast 3 characters long" }).max(50, { message: "City should be atmost 50 characters long" }),
    state: zod.string().min(3, { message: "State should be atleast 3 characters long" }).max(50, { message: "State should be atmost 50 characters long" }),
    country: zod.string().min(3, { message: "Country should be atleast 3 characters long" }).max(50, { message: "Country should be atmost 50 characters long" }),
    pinCode: zod.number({
        invalid_type_error: "Invalid pin code",
    }).min(100000, { message: "Invalid pin code" }).max(999999, { message: "Invalid pin code" }),
    phoneNo: zod.number({
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

    const validatedFields = orderSchema.safeParse({
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