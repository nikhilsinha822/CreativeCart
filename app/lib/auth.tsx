'use server'
import { z } from 'zod';
import { cookies } from 'next/headers'
import axios from 'axios';

const FormSchema = z.object({
    email: z.string(),
    password: z.string(),
})

const registerFormSchema = z.object({
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
    password: z.string({
        invalid_type_error: "Invalid password",
        required_error: "Password is required",
    }),
    avatar: z.any({
        invalid_type_error: "Invalid avatar",
        required_error: "Avatar is required",
    }),
})

const loginForm = FormSchema.pick({ email: true, password: true });
const registerForm = registerFormSchema.pick({ name: true, email: true, password: true, avatar: true });

export const handleLogin = async (prevState: { message: string, token?: string }, formData: FormData) => {

    const validatedFields = loginForm.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (validatedFields.success === false)
        return { message: "Invalid email or password" };

    try {
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/login`, {
            email: validatedFields.data.email,
            password: validatedFields.data.password
        });

        const setCookieHeader = response.headers['set-cookie'];
        const cookieStore = cookies();
        if (setCookieHeader) {
            const cookie = setCookieHeader[0].split('; ');
            const [key, value] = cookie[0].split('=');
            const maxAge = cookie[1].split('=')[1];
            const expires = cookie[3].split('=')[1];
            cookieStore.set({
                name: key,
                value: value,
                path: '/',
                sameSite: "none",
                secure: cookie.includes('Secure'),
                httpOnly: cookie.includes('HttpOnly'),
                maxAge: parseInt(maxAge),
                expires: new Date(expires),
            })
        }

        return { message: "Success", accessToken: response.data.accessToken, roles: response.data.roles };
    } catch (error: any) {
        switch (error?.response?.status) {
            case 401:
                return { message: "Invalid email or password" };
            case 500:
                return { message: "Server error" };
            default:
                return { message: "Unknown error" };
        }
    }
}

export const handleRegister = async (prevState: { message: string, token?: string }, formData: FormData) => {
    const validatedFields = registerForm.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        avatar: formData.get('avatar')
    });

    if (!validatedFields.success) {
        return { message: validatedFields.error.errors[0].message };
    }

    const formDataToSend = new FormData();

    formDataToSend.append('name', validatedFields.data.name);
    formDataToSend.append('email', validatedFields.data.email);
    formDataToSend.append('password', validatedFields.data.password);
    formDataToSend.append('avatar', validatedFields.data.avatar);

    try {
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/register`, formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const setCookieHeader = response.headers['set-cookie'];
        const cookieStore = cookies();
        if (setCookieHeader) {
            const cookie = setCookieHeader[0].split('; ');
            const [key, value] = cookie[0].split('=');
            const maxAge = cookie[1].split('=')[1];
            const expires = cookie[3].split('=')[1];
            cookieStore.set({
                name: key,
                value: value,
                path: '/',
                sameSite: "none",
                secure: cookie.includes('Secure'),
                httpOnly: cookie.includes('HttpOnly'),
                maxAge: parseInt(maxAge),
                expires: new Date(expires),
            })
        }

        return { message: "Success", accessToken: response.data.accessToken, roles: response.data.roles };
    } catch (error: any) {
        // console.log("error", error);
        return { message: error?.response?.data?.message || "Unknown error" }
    }
}

export const handleLogout = async () => {
    try {
        await axios.post(`${process.env.BASE_URL}/api/v1/logout`, {}, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
            }
        });
    } catch (error) {
        console.log(error);
    }
}


