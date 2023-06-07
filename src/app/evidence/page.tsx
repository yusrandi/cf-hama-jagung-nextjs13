'use client'

import AdminLayout from '@/components/admin-layout'
import Image from 'next/image'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Evidence, Hama } from 'prisma/prisma-client'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { EvidenceService } from './service'
import Loading from '@/components/loading'
import { Dialog } from 'primereact/dialog'
import { HamaService } from '../hama/service'
import { KeyakinanType, ListKeyakinan } from '@/type/keyakinan-type'
import { emptyHama } from '../hama/page'

const emptyEvidence: Evidence = {
    id: 0,
    evidenceCode: '',
    evidenceName: '',
    evidenceBobot: '',
    hamaId: 0,
    hama: emptyHama,
    createdAt: null,
    updatedAt: null,
}
export default function HamaPage() {

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Evidence[]>>(null);

    const [title, setTitle] = useState<string>('Create')
    const [evidence, setEvidence] = useState<Evidence>(emptyEvidence)
    const [evidences, setEvidences] = useState<Evidence[]>([])

    const [submitted, setSubmitted] = useState(false);
    const [evidenceDialog, setEvidenceDialog] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading, setLoading] = useState<boolean>(true)

    const [deleteEvidenceDialog, setDeleteEvidenceDialog] = useState(false);

    const [errorHamaId, setErrorHamaId] = useState(false)
    const [errorCode, setErrorCode] = useState(false)
    const [errorName, setErrorName] = useState(false)
    const [errorBobot, setErrorBobot] = useState(false)

    const [hamas, setHamas] = useState<Hama[]>([])
    const [keyakinans, setKeyakinans] = useState<KeyakinanType[]>(ListKeyakinan)



    useEffect(() => {
        EvidenceService.getData().then((data) => {
            console.log({ data });
            setEvidences(data.responsedata)
            setLoading(false)
        })

    }, [])

    useEffect(() => {
        HamaService.getData().then((data) => {
            console.log({ data });
            setHamas(data.responsedata)
        })

    }, [])
    function openNew() {
        setTitle('Create')
        setEvidence(emptyEvidence)
        setSubmitted(false);
        setEvidenceDialog(true);
    };

    function hideDialog() {
        setSubmitted(false);
        setEvidenceDialog(false);
        setErrorHamaId(false)
        setErrorCode(false)
        setErrorName(false)
        setErrorBobot(false)
    };

    function hamaBodyTemplate(rowData: Evidence) {
        return (
            <>
                <span className="p-column-title">Nama Hama</span>
                {rowData.hama.hamaName}
            </>
        );
    };
    function codeBodyTemplate(rowData: Evidence) {
        return (
            <>
                <span className="p-column-title">Kode</span>
                {rowData.evidenceCode}
            </>
        );
    };
    function nameBodyTemplate(rowData: Evidence) {
        return (
            <>
                <span className="p-column-title">Nama Evidence</span>
                {rowData.evidenceName}
            </>
        );
    };
    function bobotBodyTemplate(rowData: Evidence) {
        return (
            <>
                <span className="p-column-title">Bobot</span>
                {rowData.evidenceBobot}
            </>
        );
    };
    function actionBodyTemplate(rowData: Evidence) {
        return (
            <div className='float-right flex-nowrap whitespace-nowrap'>
                <Button severity="success" label="Edit" icon="pi pi-pencil" text onClick={() => editEvidence(rowData)} />
                <Button severity="danger" label="Delete" icon="pi pi-trash" text onClick={() => confirmDeleteEvidence(rowData)} />
            </div>
        );
    };

    const hideDeleteEvidenceDialog = () => {
        setDeleteEvidenceDialog(false);
    };

    const deleteHamaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteEvidenceDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteEvidence} />
        </>
    );

    function editEvidence(evidence: Evidence) {
        setTitle('Update')
        setEvidence({ ...evidence });
        setEvidenceDialog(true);
    };

    function confirmDeleteEvidence(evidence: Evidence) {
        setEvidence(evidence);
        setDeleteEvidenceDialog(true)
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Evidences</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    function EvidenceTable() {
        return (
            <DataTable
                size='small'
                ref={dt}
                value={evidences}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive mt-6"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} data"
                globalFilter={globalFilter}
                emptyMessage="No Hamas found."
                header={header}
                responsiveLayout="scroll"
            >
                <Column field="hamaName" header="Nama Hama " sortable body={hamaBodyTemplate} ></Column>
                <Column field="evidenceCode" header="Kode " sortable body={codeBodyTemplate} ></Column>
                <Column field="evidenceName" header="Nama Evidence" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                <Column field="evidenceBobot" header="Bobot " sortable body={bobotBodyTemplate} ></Column>
                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            </DataTable>
        )
    }



    const evidenceDialogFooter = (
        <>
            <Button severity="danger" label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label={submitted ? `Submiting...` : 'Submit'} icon="pi pi-check" text disabled={submitted} onClick={handleSubmit} />
        </>
    );


    async function deleteEvidence() {
        try {
            await EvidenceService.deleteData(evidence).then((data) => {
                console.log({ data });
                setEvidences(data.responsedata)
                setLoading(false)
                setDeleteEvidenceDialog(false);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Evidence Deleted', life: 3000 });
            })
        } catch (error) {
            console.log(error);

        }
    }

    async function handleCreate() {
        try {
            await EvidenceService.createData(evidence).then((data) => {
                console.log({ data });
                setEvidences(data.responsedata)
                setLoading(false)
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Evidence Created', life: 3000 });
            })
        } catch (error) {
            console.log(error);
        }
    }
    async function handleUpdate() {
        try {
            await EvidenceService.updateData(evidence).then((data) => {
                console.log({ data });
                setEvidences(data.responsedata)
                setLoading(false)
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Evidence Updated', life: 3000 });
            })

        } catch (error) {
            console.log(error);
        }
    }
    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()
        setErrorHamaId(false)
        setErrorCode(false)
        setErrorName(false)
        setErrorBobot(false)

        console.log({ evidence });

        if (evidence.hamaId === 0) {
            setErrorHamaId(true)
            return
        }
        if (evidence.evidenceCode === '') {
            setErrorCode(true)
            return
        }
        if (evidence.evidenceName === '') {
            setErrorName(true)
            return
        }
        if (evidence.evidenceBobot === '') {
            setErrorBobot(true)
            return
        }

        setSubmitted(true);

        if (title === 'Create') {
            handleCreate()
        } else {
            handleUpdate()
        }

        setEvidenceDialog(false)
        setSubmitted(false)

    }





    return (
        <AdminLayout>
            <section className='w-full'>
                <h1 className='head_text text-left'>
                    <span className='blue_gradient'>Data Evidence</span>
                </h1>
                <p className='desc text-left'>disini detail Evidence jagung</p>

                <button className='outline_btn mt-6' onClick={() => openNew()} >Create Data </button>

                <Toast ref={toast} />

                {
                    isLoading ? <Loading /> :
                        <EvidenceTable />
                }

                <Dialog visible={evidenceDialog} style={{ width: '450px' }} modal className="p-fluid" footer={evidenceDialogFooter} onHide={hideDialog}>
                    {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}

                    <h1 className='head_text text-left'>
                        <span className='blue_gradient'>{title} Evidence</span>
                    </h1>

                    <form onSubmit={handleSubmit} className='mt-10 w-full max-w-2xl flex flex-col gap-5 '>
                        <label>
                            <span className='font-satoshi font-semibold text-base text-gray-700'>
                                Pilih Hama
                            </span>
                            <select className={`form_select ${errorHamaId ? 'border-red-500' : ''}`}
                                value={evidence.hamaId!}
                                onChange={(e) => setEvidence({ ...evidence, hamaId: Number(e.target.value) })}
                            >
                                <option selected>Silahkan pilih hama</option>
                                {
                                    hamas.map((hama: Hama, index) => (
                                        <option key={index} value={hama.id}>{hama.hamaCode}  {hama.hamaName}</option>
                                    ))
                                }

                            </select>
                            {
                                errorHamaId ? <span className='text-xs text-red-500'>
                                    this field is required
                                </span> : null
                            }
                        </label>
                        <label>
                            <span className='font-satoshi font-semibold text-base text-gray-700'>
                                Kode Evidence{" "}
                                <span className='font-normal'>
                                    (awali dengan huruf G (kapital))
                                </span>
                            </span>
                            <input
                                value={evidence.evidenceCode!}
                                onChange={(e) => setEvidence({ ...evidence, evidenceCode: e.target.value })}
                                type='text'
                                placeholder='Kode Evidence'
                                required
                                className={`form_input ${errorCode ? 'border-red-500' : ''}`}
                            />
                            {
                                errorCode ? <span className='text-xs text-red-500'>
                                    this field is required
                                </span> : null
                            }
                        </label>
                        <label>
                            <span className='font-satoshi font-semibold text-base text-gray-700'>
                                Nama Evidence
                            </span>

                            <input

                                value={evidence.evidenceName!}
                                onChange={(e) => setEvidence({ ...evidence, evidenceName: e.target.value })}
                                placeholder='Nama Evides atau jenis Gejala'
                                required
                                className={`form_input ${errorName ? 'border-red-500' : ''}`}
                            />
                            {
                                errorName ? <span className='text-xs text-red-500'>
                                    this field is required
                                </span> : null
                            }
                        </label>
                        <label>
                            <span className='font-satoshi font-semibold text-base text-gray-700'>
                                Bobot Evidence{" "}
                                <span className='font-normal'>
                                    (jadikan . (titik) sebagai pemisah decimal)
                                </span>
                            </span>

                            <select className={`form_select ${errorBobot ? 'border-red-500' : ''}`}
                                value={evidence.evidenceBobot!}
                                onChange={(e) => setEvidence({ ...evidence, evidenceBobot: e.target.value })}
                            >
                                <option selected>Silahkan pilih Bobot Keyakinan</option>
                                {
                                    keyakinans.map((keyakinan: KeyakinanType, index) => (
                                        <option key={index} value={keyakinan.id}>{keyakinan.id}  {keyakinan.value}</option>
                                    ))
                                }

                            </select>
                            {
                                errorBobot ? <span className='text-xs text-red-500'>
                                    this field is required
                                </span> : null
                            }
                        </label>


                    </form>

                </Dialog>

                <Dialog visible={deleteEvidenceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteHamaDialogFooter} onHide={hideDeleteEvidenceDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {evidence && <span>Are you sure you want to delete the selected evidence {evidence.evidenceCode}?</span>}
                    </div>
                </Dialog>

            </section>
        </AdminLayout>
    )
}