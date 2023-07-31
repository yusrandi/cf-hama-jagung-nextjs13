'use client'
import { Evidence, Hama } from 'prisma/prisma-client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { User, useUserContext } from '../context/ResultContext';
import Loading from './loading';
import { LaporanService } from '@/services/LaporanService';
import { useSession } from 'next-auth/react';
import { Toast } from 'primereact/toast';
import Result from './result';
import { ResultType } from '@/type/ResultType';

interface props {
    hamas: Hama[]
    answers: string[]
    evidenceIds: number[]
    results: ResultType[]
}
export default function ResultTable({ hamas, answers, evidenceIds, results }: props) {

    const { users, dispatch } = useUserContext();
    const [isLoading, setIsLoading] = useState(false)
    const { data: session } = useSession();
    const toast = useRef<Toast>(null);



    // let hashMap = new Map<string, string>();
    let max = {
        value: 0,
        name: '',
        image: ''
    }
    const handleUpdateName = (userId: string, newName: string, newAge: number, hamaImage: string) => {
        dispatch({ type: 'UPDATE_USER', userId, userData: { name: newName, age: newAge, image: hamaImage } });
    };


    useEffect(() => {
        // setTimeoutError()
        let i = 0
        hamas.forEach((hama: Hama) => {
            // console.log({ hama });
            let cfOld = 0
            let max = 0
            hama.evidences.forEach((evidence: Evidence) => {

                const check = evidenceIds.find(item => item === evidence.id)
                const result = results.find(item => item.evidence.id === evidence.id)

                if (result) {
                    console.log(`result ${result}`);
                    let cfNew = Number(evidence.evidenceBobot) * Number(result.keyakinan.id)
                    let cfGabungan = cfOld + cfNew - (cfOld * cfNew)
                    if (cfGabungan > max) {
                        max = cfGabungan
                    }

                    handleUpdateName(hama.hamaCode!, hama.hamaName!, max, hama.image!)
                    console.log(`index ${i} ${hama.hamaCode!} ${evidence.evidenceBobot} x ${result.keyakinan.id} = cfOld ${cfOld} cfNew ${cfNew} cfGabungan = ${cfGabungan}, max ${max}`);
                    i++
                    cfOld = cfGabungan

                }

            })
        })

    }, [])

    function setTimeoutError() {
        setIsLoading(true)
        setTimeout(function () {
            setIsLoading(false)
        }, 3000)
    }



    return (
        <div className='mt-10'>
            <Toast />
            Hasil Diagnosa Jenis Hama


            {
                isLoading ? <Loading /> :
                    <div>
                        <table id="table" className='text-left mt-10'>

                            {
                                Object.values(users).map((user: User) => {
                                    // <li key={user.name}>
                                    //     {user.name} (Age: {user.age})
                                    // </li>
                                    if (user.age > max.value) {
                                        max.value = user.age
                                        max.name = user.name
                                        max.image = user.image
                                    }
                                    return <tr key={user.name} >
                                        <td>{user.name}</td>
                                        <td>{(Number(user.age.toFixed(3)) * 100).toFixed(2)}% </td>
                                    </tr>
                                })
                            }

                        </table>



                        {/* <div className='mt-10 flex-center'>
                            <p className='orange_gradient desc'>
                                Kesimpulan dari hasil diagnosa Hama

                                <p className='head_text orange_gradient'>
                                    {max.name}
                                </p>
                                <p className='desc'>
                                    sebesar
                                </p>
                                <p className='head_text orange_gradient'>
                                    {(Number(max.value.toFixed(3)) * 100).toFixed(2)}%
                                </p>
                            </p>
                        </div> */}
                        <Result hamaName={max.name} userName={session?.user.name!} value={(Number(max.value.toFixed(3)) * 100).toFixed(2)} hamaImage={max.image} />


                    </div>
            }
        </div>
    )
}
