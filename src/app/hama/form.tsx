import Link from 'next/link';
import { Hama } from 'prisma/prisma-client'
import React, { Dispatch, SetStateAction, SyntheticEvent } from 'react'

interface Props {
    title: string
    submitting: boolean
    hama: Hama
    setHama: Dispatch<SetStateAction<Hama>>;
    handleSubmit: (e: SyntheticEvent) => void,

}
export default function HamaForm({ title, handleSubmit, hama, setHama, submitting }: Props) {
    return (
        <section className='w-full max-w-full flex-start flex-col'>
            <h1 className='head_text text-left'>
                <span className='blue_gradient'>{title} Hama</span>
            </h1>
            <p className='desc text-left max-w-md'>
                {title} and share amazing prompts with the world, and let your
                imagination run wild with any AI-powered platform
            </p>
            <form onSubmit={handleSubmit} className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'>
                <label>
                    <span className='font-satoshi font-semibold text-base text-gray-700'>
                        Kode hama{" "}
                        <span className='font-normal'>
                            (awali dengan huruf H (kapital))
                        </span>
                    </span>
                    <input
                        value={hama.hamaCode!}
                        onChange={(e) => setHama({ ...hama, hamaCode: e.target.value })}
                        type='text'
                        placeholder='Kode hama'
                        required
                        className='form_input'
                    />
                </label>
                <label>
                    <span className='font-satoshi font-semibold text-base text-gray-700'>
                        Nama hama
                    </span>

                    <textarea
                        value={hama.hamaName!}
                        onChange={(e) => setHama({ ...hama, hamaName: e.target.value })}
                        placeholder='Nama hama atau jenis hama'
                        required
                        className='form_textarea '
                    />
                </label>


                <div className='flex-end mx-3 mb-5 gap-4'>
                    <Link href='/hama' className='text-gray-500 text-sm'>
                        Cancel
                    </Link>

                    <button
                        type='submit'
                        disabled={submitting}
                        className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
                    >
                        {submitting ? `${title}ing...` : title}
                    </button>
                </div>
            </form>
        </section>
    )
}
