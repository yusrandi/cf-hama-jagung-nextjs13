'use client'
import AdminLayout from '@/components/admin-layout'
import Image from 'next/image'
import { Button } from 'primereact/button';
import { Toolbar } from "primereact/toolbar";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";



import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import HamaForm from './form';
import { Hama } from 'prisma/prisma-client';

import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { Toast } from "primereact/toast";
import { HamaService } from './service';
import CustomFileSelector from '@/components/CustomFileSelector';
import ImagePreview from '@/components/ImagePreview';



const emptyHama: Hama = {
    id: 0,
    hamaCode: '',
    hamaName: '',
    evidences: [],
    createdAt: null,
    updatedAt: null,
    image: null
}


export default function HamaPage() {

    const [submitted, setSubmitted] = useState(false);
    const [hamaDialog, setHamaDialog] = useState(false);
    const router = useRouter()

    const [hama, setHama] = useState<Hama>(emptyHama)
    const [hamas, setHamas] = useState<Hama[]>([])
    const [title, setTitle] = useState<string>('Create')

    const [errorCode, setErrorCode] = useState(false)
    const [errorName, setErrorName] = useState(false)
    const [errorImage, setErrorImage] = useState(false)


    const [isLoading, setLoading] = useState<boolean>(true)

    const dt = useRef<DataTable<Hama[]>>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const [deleteHamaDialog, setDeleteHamaDialog] = useState(false);

    const [image, setImage] = useState<File>();
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            //convert `FileList` to `File[]`
            const _files = e.target.files[0];
            console.log({ _files });
            setImage(_files);
            setErrorImage(false)
        }
    };




    async function getHamas() {
        try {
            setLoading(true)
            const result = await fetch('/api/hama', { headers: { 'Cache-Control': 'no-cache' } })
                .then((res) => res.json());
            console.log(result.responsedata);
            setHamas(result.responsedata)
            setLoading(false)

            return result

        } catch (error) {

        }
    }

    useEffect(() => {
        getHamas()
    }, []);

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()
        setErrorCode(false)
        setErrorName(false)
        setErrorImage(false)

        // setSubmitted(true);

        console.log({ hama });
        console.log({ image });

        if (title === 'Create') {
            if (image === undefined) {
                setErrorImage(true)
                return
            }
        }

        if (hama.hamaCode === '') {
            setErrorCode(true)
            return
        }
        if (hama.hamaName === '') {
            setErrorName(true)
            return
        }

        setSubmitted(true);
        setLoading(true)

        if (title === 'Create') {
            handleCreate()
        } else {
            handleUpdate()
        }


        // let api: string = '/api/hama'
        // let method: string = 'POST'

        // if (title === 'Update') {
        //     api = `/api/hama/${hama.id}`
        //     method = 'PATCH'

        // }

        // try {
        //     setSubmitted(true);

        //     const result = await fetch(api, {
        //         method: method,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             hamaCode: hama.hamaCode,
        //             hamaName: hama.hamaName,
        //         }),
        //     }).then((res) => res.json());

        //     setHamaDialog(false);

        //     setHamas(result.responsedata)
        //     setSubmitted(false);
        //     toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Hama Created', life: 3000 });



        // } catch (error) {
        //     console.log(error);
        // }

        setHamaDialog(false)
        setSubmitted(false)

    }

    async function handleCreate() {
        try {
            await HamaService.createData(hama, image!).then((data) => {
                console.log({ data });
                setHamas(data.data.responsedata)
                setLoading(false)
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Hama Created', life: 3000 });
            })
        } catch (error) {
            console.log(error);
        }
    }
    async function handleUpdate() {
        try {
            await HamaService.updateData(hama, image!).then((data) => {
                console.log({ data });
                setHamas(data.data.responsedata)
                setLoading(false)
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Hama Updated', life: 3000 });
            })

        } catch (error) {
            console.log(error);
        }
    }
    async function deleteHama() {
        console.log({ hama });

        try {

            const api = `/api/hama/${hama.id}`
            const method = 'DELETE'

            const result = await fetch(api, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },

            }).then((res) => res.json());

            setHamas(result.responsedata)
            setDeleteHamaDialog(false);

            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Hama Deleted', life: 3000 });
        } catch (error) {

        }
    }

    const openNew = () => {
        setTitle('Create')
        setHama(emptyHama)
        setSubmitted(false);
        setHamaDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setHamaDialog(false);
        setErrorCode(false)
        setErrorName(false)
        setErrorImage(false)
    };
    const hideDeleteHamaDialog = () => {
        setDeleteHamaDialog(false);
    };

    const hamaDialogFooter = (
        <>
            <Button severity="danger" label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label={submitted ? `Submiting...` : 'Submit'} icon="pi pi-check" text disabled={submitted} onClick={handleSubmit} />
        </>
    );
    const deleteHamaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteHamaDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteHama} />
        </>
    );

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0"></h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    function imageBodyTemplate(rowData: Hama) {
        return (
            <>
                <span className="p-column-title">Gambar</span>
                {/* {rowData.image} */}

                {rowData.image && <img src={`http://hamajagung.cloud/hamas/${rowData.image}`} alt={rowData.image} width="50" className="mt-0 mx-auto mb-5 block shadow-2" />}

            </>
        );
    };

    const codeBodyTemplate = (rowData: Hama) => {
        return (
            <>
                <span className="p-column-title">Kode Hama</span>
                {rowData.hamaCode}
            </>
        );
    };
    const nameBodyTemplate = (rowData: Hama) => {
        return (
            <>
                <span className="p-column-title">Nama Hama</span>
                {rowData.hamaName}
            </>
        );
    };
    const totalBodyTemplate = (rowData: Hama) => {
        return (
            <>
                <span className="p-column-title">Nama Hama</span>
                {rowData.evidences.length}
            </>
        );
    };
    const actionBodyTemplate = (rowData: Hama) => {
        return (
            <div className='float-right flex-nowrap whitespace-nowrap'>
                <Button severity="success" label="Edit" icon="pi pi-pencil" text onClick={() => editHama(rowData)} />
                <Button severity="danger" label="Delete" icon="pi pi-trash" text onClick={() => confirmDeleteHama(rowData)} />
            </div>
        );
    };
    const editHama = (hama: Hama) => {
        setTitle('Update')
        setHama({ ...hama });
        setHamaDialog(true);
        setImage(undefined)
    };

    const confirmDeleteHama = (hama: Hama) => {
        setHama(hama);
        setDeleteHamaDialog(true);
    };

    return (
        <AdminLayout>
            <section className='w-full'>
                <h1 className='head_text text-left'>
                    <span className='blue_gradient'>Data Hama</span>
                </h1>
                {/* <p className='desc text-left'>disini detail hama jagung</p> */}

                <button className='outline_btn mt-6' onClick={() => openNew()} >Tambah Data </button>

                <Toast ref={toast} />


                <DataTable
                    size='small'
                    ref={dt}
                    value={hamas}
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
                    <Column field="image" header="Gambar" sortable body={imageBodyTemplate}></Column>
                    <Column field="hamaCode" header="Kode Hama" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    <Column field="hamaName" header="Nama Hama" sortable body={nameBodyTemplate} ></Column>
                    <Column field="total" header="total" sortable body={totalBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                    <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                </DataTable>


                <Dialog visible={hamaDialog} style={{ width: '450px' }} modal className="p-fluid" footer={hamaDialogFooter} onHide={hideDialog}>
                    {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}

                    <h1 className='head_text text-left'>
                        <span className='blue_gradient'>{title === 'Create' ? 'Tambah' : 'Ubah'} Hama</span>
                    </h1>

                    <form onSubmit={handleSubmit} className='mt-10 w-full max-w-2xl flex flex-col gap-5 '>

                        <CustomFileSelector
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleFileSelected}
                        />
                        {
                            errorImage ? <span className='text-xs text-red-500'>
                                pilih gambar dulu
                            </span> : null
                        }

                        {/* {
                            image !== undefined ?
                                <ImagePreview image={image!} /> : null
                        } */}

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
                                Nama hama
                            </span>

                            <textarea

                                value={hama.hamaName!}
                                onChange={(e) => setHama({ ...hama, hamaName: e.target.value })}
                                placeholder='Nama hama atau jenis hama'
                                required
                                className={`form_textarea ${errorName ? 'border-red-500' : ''}`}
                            />
                            {
                                errorName ? <span className='text-xs text-red-500'>
                                    this field is required
                                </span> : null
                            }
                        </label>


                    </form>

                </Dialog>

                <Dialog visible={deleteHamaDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteHamaDialogFooter} onHide={hideDeleteHamaDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {hama && <span>anda yakin ingin menghapus hama {hama.hamaName}?</span>}
                    </div>
                </Dialog>

            </section>
        </AdminLayout>
    )
}