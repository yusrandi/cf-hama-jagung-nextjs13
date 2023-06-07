'use client'
import AdminLayout from '@/components/admin-layout';
import Navbar from '@/components/navbar';
import Image from 'next/image'
import { Button } from 'primereact/button';


export default function Home() {
  return (
    <AdminLayout>
      <section className='w-full flex-center flex-col'>
        <h1 className='head_text text-center'>Identifikasi Hama Tanaman Jagung
          <br className='max-md:hidden' />
          <span className='orange_gradient text-center'>Certainty Factor</span>
        </h1>
        <p className='desc text-center'>
          Propmtopia is a open-source AI prompting tool for modern world to discover, create nd share creative prompts
        </p>

        <form className='relative w-full max-w-2xl flex-center mt-8' >
          <input
            type="text"
            placeholder='Search for a tag or a username'
            required
            className='search_input peer'

          />

        </form>

      </section>
    </AdminLayout>
  )
}