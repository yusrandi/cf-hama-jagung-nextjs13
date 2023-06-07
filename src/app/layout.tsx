import Provider from '@/components/Provider'
import Navbar from '@/components/navbar'
import '@/styles/globals.css'

import "primereact/resources/themes/tailwind-light/theme.css"
//core
import "primereact/resources/primereact.min.css";
import Image from 'next/image';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

export const metadata = {
  title: 'Hama Jagung',
  description: 'Implementasi metode certainty factor dalam identifikasi hama pada tanaman jagung.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="">
        <Provider>
          <div className='main'>
            <Image src={"/corn-a.png"} alt='Promptopia Logo' width={450} height={30} className='object-contain absolute bottom-0 right-0' />

            <div className="gradient" />
          </div>
          <main className='app'>
            {children}
          </main>
        </Provider>
      </body>
    </html>
  )
}
