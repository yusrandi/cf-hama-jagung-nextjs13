'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { SyntheticEvent, useRef, useState } from 'react'

import { Card } from 'primereact/card';
import { signIn } from 'next-auth/react';
import Loading from '@/components/loading';

import { useRouter } from "next/navigation";



export default function LoginPage() {

    const userName = useRef("")
    const userPass = useRef("")
    const [error, setError] = useState('')
    const [signInClicked, setSignInClicked] = useState(false);

    const router = useRouter()




    function footer() {
        return (
            <div className='flex flex-row gap-2 items-center justify-center'>

                {
                    signInClicked ? <Loading /> :

                        <button type='button' className='outline_btn' onClick={handleSUbmit}>
                            Sign In
                        </button>
                }

            </div>
        )
    }

    async function handleSUbmit(e: SyntheticEvent) {

        setError('')
        setSignInClicked(true)

        if (userName.current === '') {

        }
        if (userPass.current === '') {

        }

        const res = await signIn("credentials", {
            username: userName.current,
            password: userPass.current,
            redirect: false,
            callbackUrl: '/',
        }).then(res => {
            setSignInClicked(false)
            console.log({ res });
            if (res?.error != null) {
                setError(res.error)

            } else {
                router.replace('/')
            }
        }).catch(err => {
            setSignInClicked(false)

            console.log({ err });
            setError(err)

        })

        console.log(res);

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
                    onChange={(e) => (userName.current = e.target.value)}
                    type='text'
                    placeholder='Username, Email, or Phone number'
                    required
                    className='form_input mt-3'
                />
                <input
                    onChange={(e) => (userPass.current = e.target.value)}
                    type='password'
                    placeholder='Password'
                    required
                    className='form_input mt-3'
                />



                <span className='text-xs text-red-600 mt-3 text-center items-center justify-center flex'>{error}</span>
            </Card>

        </section>

    )
}
