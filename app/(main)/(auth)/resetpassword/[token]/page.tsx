'use client'
import React, {useState} from 'react'
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ResetPassword = ({ params }: { params: { token: string } }) => {
    const { token } = params;
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const password = e.currentTarget.password.value;
        const confirmPassword = e.currentTarget.confirmPassword.value;
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/resetpassword/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, confirmPassword })
        })
        const data = await response.json();
        if (response.ok) {
            toast.success(data.message);
            router.push('/login');
        } else {
            toast.error(data.message);
        }
    }
    return (
        <div className='flex flex-col items-center justify-center h-screen w-full bg-gray-100'>
            <form className='bg-white p-10' onSubmit={handleSubmit}>
                <div className="flex flex-col my-2">
                    <label
                        className='mb-2 font-bold text-lg'
                        htmlFor="password">New Password</label>
                    <input
                        className='border-2 p-4 py-2 w-fit'
                        type={showPassword ? "text" : "password"} id="password" name="password" />
                </div>
                <div className="flex flex-col my-2">
                    <label
                        className='mb-2 font-bold text-lg'
                        htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className='border-2 p-4 py-2 w-fit'
                        type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" />
                </div>
                <div className='flex text-lg'>
                    <input 
                    className='mr-2 px-5 w-5 text-lg rounded-md bg-gray-200'
                    type="checkbox" name="showPassword" id="showPassword"
                    onChange={() => setShowPassword(!showPassword)}
                    />
                    <label htmlFor="showPassword">Show Password</label>
                </div>
                <button
                    className='bg-blue-600 text-white p-2 px-5 text-lg my-5 rounded-md w-full'
                    type="submit">Reset Password</button>
            </form>
        </div>
    )
}

export default ResetPassword