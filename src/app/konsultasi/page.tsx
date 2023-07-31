'use client'

import AdminLayout from "@/components/admin-layout"
import Image from "next/image";
import Link from "next/link";
import { Toast } from "primereact/toast"
import { useEffect, useRef, useState } from "react";

import { Checkbox } from 'primereact/checkbox';
import { LaporanService } from "@/services/LaporanService";
import { Laporan } from "prisma/prisma-client";
import Loading from "@/components/loading";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

// import './index.css';

export default function KonsultasiPage() {

    const [laporans, setLaporans] = useState<Laporan[]>([])
    const [laporan, setLaporan] = useState<Laporan>()
    const [isLoading, setLoading] = useState<boolean>(true)
    const dt = useRef<DataTable<Laporan[]>>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [deleteDialog, setDeleteDialog] = useState(false);

    const toast = useRef<Toast>(null);


    useEffect(() => {
        LaporanService.getData().then((data) => {
            console.log({ data });
            setLaporans(data.responsedata)
            setLoading(false)
        })

    }, [])

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Data Laporan</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    function tanggalBodyTemplate(rowData: Laporan) {
        return (
            <>
                <span className="p-column-title">tanggal</span>
                {rowData.tanggal}
            </>
        );
    };
    function nameBodyTemplate(rowData: Laporan) {
        return (
            <>
                <span className="p-column-title">name</span>
                {rowData.userName}
            </>
        );
    };
    function hamaBodyTemplate(rowData: Laporan) {
        return (
            <>
                <span className="p-column-title">hama</span>
                {rowData.hamaName}
            </>
        );
    };
    function cfBodyTemplate(rowData: Laporan) {
        return (
            <>
                <span className="p-column-title">cf</span>
                {rowData.cf}%
            </>
        );
    };

    function actionBodyTemplate(rowData: Laporan) {
        return (
            <div className='float-right flex-nowrap whitespace-nowrap'>
                <Button severity="danger" label="Delete" icon="pi pi-trash" text onClick={() => confirmDelete(rowData)} />
            </div>
        );
    };
    function confirmDelete(data: Laporan) {
        setLaporan(data!);
        setDeleteDialog(true)
    };

    const hideDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteLaporan} />
        </>
    );

    async function deleteLaporan() {
        try {
            await LaporanService.deleteData(laporan!).then((data) => {
                console.log({ data });
                setLaporans(data.responsedata)
                setLoading(false)
                setDeleteDialog(false);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Laporan Dihapus', life: 3000 });
            })
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <AdminLayout>
            <section className='w-full'>
                <h1 className='head_text text-left'>
                    <span className='blue_gradient'>Riwayat Diagnosa</span>
                </h1>

                <p className='desc text-left'>Tabel data riwayat diagnosa atau hasil konsultasi</p>
                {
                    isLoading ? <Loading /> :
                        <>
                            <DataTable
                                size='small'
                                ref={dt}
                                value={laporans}
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
                                <Column field="tanggal" header="Tanggal/Waktu" sortable body={tanggalBodyTemplate} ></Column>
                                <Column field="userName" header="Nama User" sortable body={nameBodyTemplate} ></Column>
                                <Column field="hamaName" header="Hama" sortable body={hamaBodyTemplate} ></Column>
                                <Column field="cf" header="Nilai CF" body={cfBodyTemplate} ></Column>
                                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>


                            </DataTable>

                            <Dialog visible={deleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {laporan && <span>Anda yakin ingin menghapus data ini ?</span>}
                                </div>
                            </Dialog>

                            <Toast ref={toast} />
                        </>
                }

            </section>
        </AdminLayout>
    )
}
