'use client'
import AdminLayout from '@/components/admin-layout';
import Navbar from '@/components/navbar';
import { KeyakinanType, ListKeyakinan } from '@/type/keyakinan-type';
import Image from 'next/image'
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Evidence, Hama } from 'prisma/prisma-client';
import { useEffect, useState } from 'react';
import { EvidenceService } from './evidence/service';
import { HamaService } from './hama/service';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ResultTable from '@/components/result-table';
import { ResultType } from '@/type/ResultType';


export default function Home() {
  const [isBegin, setIsBegin] = useState(false)
  const [evidences, setEvidences] = useState<Evidence[]>([])
  const [hamas, setHamas] = useState<Hama[]>([])
  const [index, setIndex] = useState<number>(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [evidenceIds, setEvidenceIds] = useState<number[]>([])
  const [answersLabel, setAnswersLabel] = useState<string[]>([])
  const [results, setResults] = useState<ResultType[]>([])

  let i: number = 0

  useEffect(() => {
    EvidenceService.getData().then((data) => {
      console.log({ data });
      setEvidences(data.responsedata)
      // setIndex(data.responsedata.length)
    })

  }, [])
  useEffect(() => {
    HamaService.getData().then((data) => {
      console.log({ data });
      setHamas(data.responsedata)
    })

  }, [])

  return (
    <AdminLayout>
      <section className='w-full flex-center flex-col'>


        {/* <form className='relative w-full max-w-2xl flex-center mt-8' >
          <input
            type="text"
            placeholder='Search for a tag or a username'
            required
            className='search_input peer'

          />

        </form> */}

        <div className='mt-8 w-full items-center justify-center text-center flex-center'>
          {
            !isBegin ?
              <div className='w-full justify-center items-center flex-center flex-col'>
                {/* <h1 className='head_text text-center'>Identifikasi Hama Tanaman Jagung
                  <br className='max-md:hidden' />
                  <span className='blue_gradient text-center'>Certainty Factor</span>
                </h1> */}
                <p className='text-center text-5xl text-orange-600 font-bold'>
                  Maksimalkan kualitas produksi jagung dengan cara mengenali beberapa gejala hama pada  jagung yang dapat menhambat produksi jagung Anda
                </p>
                <button onClick={() => {
                  setIsBegin(true)
                  setResults([])

                }} className='black_btn text-center h-16 w-4/12 mt-10'>Mulai Konsultasi</button>
              </div>
              :

              <Card className="w-full items-center justify-center text-center">

                <button type='button' onClick={() => {
                  setIsBegin(false)
                  setIndex(0)
                  setAnswers([])
                  setAnswersLabel([])
                  setEvidenceIds([])
                  setResults([])

                }}
                  className='outline_btn mb-3'>Kembali</button>
                {

                  index !== evidences.length ?

                    <div className="grid w-full">
                      <div className="col-12 md:col-8 lg:col-8">

                        <div className='justify-content-center flex-center h-full flex-col gap-3'>
                          <p className='subtitle_text orange_gradient text-center '>
                            {evidences[index].evidenceName} ?
                          </p>
                          {evidences[index].image && <img src={`/evidences/${evidences[index].image}`} alt={evidences[index].image!} width="80%" className="mt-0 mx-auto mb-5 block shadow-2" />}

                        </div>
                      </div>
                      <div className="col-12 md:col-4 lg:col-4 gap-2 h-full">

                        {
                          ListKeyakinan.map((data: KeyakinanType) => (
                            <button key={data.id} type='button' onClick={() => {
                              if (index < evidences.length) {
                                setIndex(index + 1)
                                setAnswers([...answers, data.id])
                                setAnswersLabel([...answersLabel, data.value])
                                setEvidenceIds([...evidenceIds, evidences[index].id])

                                const result: ResultType = {
                                  keyakinan: data,
                                  evidence: evidences[index]
                                }

                                setResults([...results, result])
                              }

                            }} className='outline_btn w-full mb-3'>{data.id} | {data.value}</button>
                          ))
                        }
                        <button type='button' onClick={() => {
                          if (index < evidences.length) {
                            setIndex(index + 1)
                            setAnswers([...answers, ""])
                            setAnswersLabel([...answersLabel, ""])
                            setEvidenceIds([...evidenceIds, 0])


                          }

                        }} className='outline_btn w-full mb-3'>Selanjutnya</button>

                      </div>
                    </div> :

                    <div>


                      <table id="table" className='text-left mt-10'>
                        <tr>
                          {/* <th>Kode Gejala</th> */}
                          <th>Jenis Gejala</th>
                          {/* <th>Hama</th> */}
                          <th>Jawaban User</th>
                          <th>Jawaban User Bobot</th>
                          {/* <th>CF Pakar</th>
                          <th>CF Combinasi</th> */}
                        </tr>
                        {
                          // hamas.map((hama: Hama) => (
                          //   hama.evidences.map((evidence: Evidence) => {
                          //     i++
                          //     return <tr key={hama.id}>
                          //       {/* <td>{evidence.evidenceCode}</td> */}
                          //       <td>{evidence.evidenceName}</td>
                          //       {/* <td>{hama.hamaName}</td> */}
                          //       <td>{answersLabel[i - 1]}</td>
                          //       {/* <td>{evidence.evidenceBobot}</td>
                          //       <td>{Number(evidence.evidenceBobot) * Number(answers[i - 1])}</td> */}
                          //     </tr>
                          //   })
                          // ))

                          answers.map((item, index) => {
                            if (item !== "") {
                              return <tr key={index}>
                                <td>{evidences.find(item => item.id === evidenceIds[index])?.evidenceName}</td>
                                <td>{item}</td>
                                <td>{answersLabel[index]}</td>
                              </tr>
                            }

                          })

                        }
                      </table>

                      <ResultTable hamas={hamas} answers={answers} evidenceIds={evidenceIds} results={results} />
                    </div>
                }
              </Card>
          }
        </div>
      </section>
    </AdminLayout>
  )
}