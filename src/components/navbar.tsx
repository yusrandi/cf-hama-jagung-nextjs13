'use client'
import { Provider } from 'next-auth/providers';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

export default function Navbar() {
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null)
    const pathname = usePathname();
    const [toggleDropdown, setToggleDropdown] = useState(false);



    return (
        <nav className='flex-between w-full mb-16 pt-3'>
            <Link href={"/"} className='flex gap-2 flex-center'>
                <Image src={"/assets/images/logo.svg"} alt='Promptopia Logo' width={39} height={30} className='object-contain' />
                <p className='logo_text'>Hama Jagung</p>
            </Link>

            {/* Desktop Navigation */}
            <div className='sm:flex hidden'>
                {
                    session?.user ?
                        (
                            <div className='flex gap-3 md:gap-5 items-center'>


                                <Link href='/evidence' className={`${pathname === '/evidence' ? 'orange_gradient border-b-2 border-orange-400 font-medium' : ''}`}>
                                    Evidence
                                </Link>
                                <Link href='/hama' className={`${pathname === '/hama' || pathname === '/hama/create' ? 'orange_gradient border-b-2 border-orange-400 font-medium' : ''}`}>
                                    Hama
                                </Link>
                                <button type='button' onClick={() => signOut()} className='outline_btn'>
                                    Sign Out
                                </button>

                            </div>
                        )
                        :
                        (
                            <>
                                <button type='button' onClick={() => signIn()} className='black_btn'>
                                    Sign In
                                </button>


                            </>
                        )
                }
            </div>

            {/* Mobile Navigation */}
            <div className='sm:hidden flex relative'>
                {session?.user ? (
                    <div className='flex'>
                        <Image
                            src={"/assets/images/logo.svg"}
                            width={37}
                            height={37}
                            className='rounded-full'
                            alt='profile'
                            onClick={() => setToggleDropdown(!toggleDropdown)}
                        />

                        {toggleDropdown && (
                            <div className='dropdown'>


                                <Link href='/evidence' onClick={() => setToggleDropdown(false)} className={`dropdown_link ${pathname === '/evidence' ? 'orange_gradient border-b-2 border-orange-400 font-medium' : ''}`}>
                                    Evidence
                                </Link>
                                <Link href='/hama' onClick={() => setToggleDropdown(false)} className={`dropdown_link ${pathname === '/hama' ? 'orange_gradient border-b-2 border-orange-400 font-medium' : ''}`}>
                                    Hama
                                </Link>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setToggleDropdown(false);
                                        signOut();
                                    }}
                                    className='mt-5 w-full black_btn'
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button
                            type='button'
                            onClick={() => {
                                signIn();
                            }}
                            className='black_btn'
                        >
                            Sign in
                        </button>
                    </>
                )}
            </div>

        </nav>
    )
}
