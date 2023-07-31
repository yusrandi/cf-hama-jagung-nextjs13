import { LaporanService } from '@/services/LaporanService'
import React, { useEffect } from 'react'

interface props {
    hamaName: string
    userName: string
    value: string
    hamaImage: string
}
export default function Result({ hamaName, userName, value, hamaImage }: props) {

    useEffect(() => {
        handleSUbmit()
    }, [])

    async function handleSUbmit() {
        console.log('handle submit');
        try {
            if (hamaName !== "") {
                const response = await LaporanService.createData(userName, hamaName, value).then((data) => {
                    console.log({ data });
                    console.log('loading....');

                    if (data.responsecode != 0) {
                        console.log('loaded');

                    } else {
                        console.log('loaded 0');

                    }

                })

            }


        } catch (error) {
            console.log(error);
        }

    }
    return (
        <div className='mt-10 flex-center'>
            <p className='orange_gradient desc'>
                Dari Hasil Diagnosa kemungkinan jagung anda terkena jenis hama

                {<img src={`http://hamajagung.cloud/hamas/${hamaImage}`} alt={hamaImage} width="80%" className="mt-0 mx-auto mb-5 block shadow-2" />}


                <p className='head_text orange_gradient'>
                    {hamaName}
                </p>
                <p className='desc'>
                    sebesar
                </p>
                <p className='head_text orange_gradient'>
                    {value}%
                </p>
            </p>
        </div>
    )
}
