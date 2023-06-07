'use client'
import AdminLayout from '@/components/admin-layout'
import Image from 'next/image'
import { Button } from 'primereact/button';
import { Toolbar } from "primereact/toolbar";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";


import React, { SyntheticEvent, useState } from 'react';
import HamaForm from '../form';
import { Hama } from 'prisma/prisma-client';

const emptyHama: Hama = {
    id: 0,
    hamaCode: '',
    hamaName: '',
    createdAt: null,
    updatedAt: null

}

export default function CreateHamaPage() {

    const [hama, setHama] = useState<Hama>(emptyHama)
    const [submitting, setSubmitting] = useState<boolean>(false)

    function handleSubmit(e: SyntheticEvent) {

    }


    return (
        <AdminLayout>
            <HamaForm
                title='Create'
                hama={hama}
                setHama={setHama}
                submitting={submitting}
                handleSubmit={handleSubmit}

            />
        </AdminLayout>
    )
}