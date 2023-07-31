'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { SyntheticEvent, useRef, useState } from 'react'

import { Card } from 'primereact/card';
import { signIn } from 'next-auth/react';
import Loading from '@/components/loading';

import { useRouter } from "next/navigation";
import { UserService } from '@/services/UserService';
import { User } from 'prisma/prisma-client';
import { Toast } from 'primereact/toast';


const emptyUser: User = {
    id: 0,
    email: '',
    name: '',
    password: null,
    role: null,
    createdAt: null,
    updatedAt: null
}

export default function RegisterPage() {

    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPass, setUserPass] = useState("")
    const [error, setError] = useState('')
    const [signInClicked, setSignInClicked] = useState(false);

    const router = useRouter()
    const toast = useRef<Toast>(null);





    function footer() {
        return (
            <div className='flex flex-row gap-2 items-center justify-center'>

                {
                    signInClicked ? <Loading /> :

                        <view className='text-center'>
                            <button type='button' className='outline_btn mb-5' onClick={handleSUbmit}>
                                Sign Up
                            </button>

                        </view>
                }

            </div>
        )
    }

    async function handleSUbmit(e: SyntheticEvent) {

        setError('')

        if (userName === "" || userEmail === "" || userPass === "") {

            toast.current?.show({ severity: 'error', summary: 'Failed', detail: "Harap mengisi semua kolom", life: 3000 });
            return
        }

        setSignInClicked(true)


        try {
            const response = await UserService.registerUser(userName, userEmail, userPass).then((data) => {
                console.log({ data });

                setSignInClicked(false)
                if (data.responsecode != 0) {
                    router.replace('/auth/login')
                } else {
                    toast.current?.show({ severity: 'error', summary: 'Failed', detail: data.responsemsg, life: 3000 });

                }

            })

            console.log({ response });




        } catch (error) {
            console.log(error);
        }

    }

    return (

        <section className='w-full h-full flex-center flex-col p-10 justify-center'>
            <Link href={"/"} className='flex flex-col gap-2 flex-center'>
                <Image src={"/assets/images/logo.svg"} alt='Promptopia Logo' width={100} height={100} className='object-contain' />
            </Link>
            <h1 className='head_text text-center'>
                <br className='max-md:hidden' />
                <span className='orange_gradient text-center'>Hama Jagung</span>
            </h1>
            <p className='desc text-center'>
                Implementasi metode Certainty Factor, Identifikasi Hama pada tanaman jagung.
            </p>

            <Card footer={footer} className="max-w-lg mt-10 gap-2 w-full px-3">

                <input
                    onChange={(e) => setUserName(e.target.value)}
                    type='text'
                    placeholder='Fullname'
                    required
                    className='form_input mt-3'
                />
                <input
                    onChange={(e) => setUserEmail(e.target.value)}
                    type='text'
                    placeholder='Email address'
                    required
                    className='form_input mt-3'
                />
                <input
                    onChange={(e) => setUserPass(e.target.value)}
                    type='password'
                    placeholder='Password'
                    required
                    className='form_input mt-3'
                />



                <span className='text-xs text-red-600 mt-3 text-center items-center justify-center flex'>{error}</span>
            </Card>
            <Toast ref={toast} />


        </section>

    )
}
