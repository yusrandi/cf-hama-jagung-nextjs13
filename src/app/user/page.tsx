'use client'
import AdminLayout from '@/components/admin-layout'
import Loading from '@/components/loading';
import { UserService } from '@/services/UserService';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast'
import { Role, User } from 'prisma/prisma-client';
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'

const emptyUser: User = {
    id: 0,
    email: '',
    name: '',
    password: null,
    role: null,
    createdAt: null,
    updatedAt: null
}
export default function UserPage() {
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<User[]>>(null);
    const [title, setTitle] = useState<string>('Create')

    const [user, setUser] = useState<User>(emptyUser)
    const [users, setUsers] = useState<User[]>([])

    const [submitted, setSubmitted] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);

    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading, setLoading] = useState<boolean>(true)

    const [errorEmail, setErrorEmail] = useState(false)
    const [errorName, setErrorName] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorRole, setErrorRole] = useState(false)

    const [roles, setRoles] = useState<Role[]>([Role.ADMIN, Role.USER])


    useEffect(() => {
        UserService.getData().then((data) => {
            console.log({ data });
            setUsers(data.responsedata)
            setLoading(false)
        })

    }, [])

    function openNew() {
        setTitle('Create')
        setUser(emptyUser)
        setSubmitted(false);
        setUserDialog(true);
    };
    function hideDialog() {
        setSubmitted(false);
        setUserDialog(false);
        setErrorEmail(false)
        setErrorName(false)
        setErrorPassword(false)
        setErrorRole(false)
    };

    function nameBodyTemplate(rowData: User) {
        return (
            <>
                <span className="p-column-title">name</span>
                {rowData.name}
            </>
        );
    };
    function emailBodyTemplate(rowData: User) {
        return (
            <>
                <span className="p-column-title">email</span>
                {rowData.email}
            </>
        );
    };
    function roleBodyTemplate(rowData: User) {
        return (
            <>
                <span className="p-column-title">role</span>
                {rowData.role}
            </>
        );
    };

    function actionBodyTemplate(rowData: User) {
        return (
            <div className='float-right flex-nowrap whitespace-nowrap'>
                <Button severity="success" label="Edit" icon="pi pi-pencil" text onClick={() => editUser(rowData)} />
                <Button severity="danger" label="Delete" icon="pi pi-trash" text onClick={() => confirmDeleteUser(rowData)} />
            </div>
        );
    };
    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );



    function editUser(user: User) {
        setTitle('Update')
        setUser({ ...user });
        setUserDialog(true);
    };

    function confirmDeleteUser(user: User) {
        setUser(user);
        setDeleteUserDialog(true)
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0"></h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    function UserTable() {
        return (
            <DataTable
                size='small'
                ref={dt}
                value={users}
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
                <Column field="name" header="Nama Pengguna " sortable body={nameBodyTemplate} ></Column>
                <Column field="email" header="Email " sortable body={emailBodyTemplate} ></Column>
                <Column field="role" header="Hak Akses" sortable body={roleBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
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

    async function deleteUser() {
        try {
            await UserService.deleteData(user).then((data) => {
                console.log({ data });
                setUsers(data.responsedata)
                setLoading(false)
                setDeleteUserDialog(false);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Evidence Deleted', life: 3000 });
            })
        } catch (error) {
            console.log(error);

        }
    }

    async function handleCreate() {
        try {
            const response = await UserService.createData(user).then((data) => {
                console.log({ data });
                setLoading(false)

                if (data.responsecode != 0) {
                    setUsers(data.responsedata)
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Evidence Created', life: 3000 });
                    setUserDialog(false)

                } else {
                    toast.current?.show({ severity: 'error', summary: 'Failed', detail: data.responsemsg, life: 3000 });

                }

            })





        } catch (error) {
            console.log(error);
        }
    }
    async function handleUpdate() {
        try {
            await UserService.updateData(user).then((data) => {
                console.log({ data });
                setUsers(data.responsedata)
                setLoading(false)

                if (data.responsecode != 0) {
                    setUsers(data.responsedata)
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Evidence Updated', life: 3000 });
                    setUserDialog(false)

                } else {
                    toast.current?.show({ severity: 'error', summary: 'Failed', detail: data.responsemsg, life: 3000 });

                }
            })

        } catch (error) {
            console.log(error);
        }
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()
        setErrorEmail(false)
        setErrorPassword(false)
        setErrorName(false)
        setErrorRole(false)

        console.log({ user });

        if (user.role === null) {
            setErrorRole(true)
            return
        }
        if (user.name === '') {
            setErrorName(true)
            return
        }
        if (user.email === '') {
            setErrorEmail(true)
            return
        }

        if (user.password === "" && title === 'Create') {
            setErrorRole(true)
            return
        }



        setSubmitted(true);

        if (title === 'Create') {
            handleCreate()
        } else {
            handleUpdate()
        }

        setSubmitted(false)

    }




    return (
        <AdminLayout>
            <section className='w-full'>


                <h1 className='head_text text-left'>
                    <span className='blue_gradient'>Data Pengguna</span>
                </h1>
                {/* <p className='desc text-left'>tabel data pengguna admin maupun petani</p> */}

                <button className='outline_btn mt-6' onClick={() => openNew()} >Tambah Data </button>

                {
                    isLoading ? <Loading /> :
                        <UserTable />
                }

                <Dialog visible={userDialog} style={{ width: '450px' }} modal className="p-fluid" footer={evidenceDialogFooter} onHide={hideDialog}>
                    {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}

                    <h1 className='head_text text-left'>
                        <span className='blue_gradient'>{title === 'Create' ? 'Tambah' : 'Ubah'} User</span>
                    </h1>

                    <form onSubmit={handleSubmit} className='mt-10 w-full max-w-2xl flex flex-col gap-5 '>
                        <label>
                            <span className='font-satoshi font-semibold text-base text-gray-700'>
                                Pilih Hak Akses{" "}
                                <span className='font-normal'>
                                    (user adalah petani)
                                </span>
                            </span>
                            <select className={`form_select ${errorRole ? 'border-red-500' : ''}`}
                                value={user.role!}
                                onChange={(e) => setUser({ ...user, role: e!.target!.value! as Role })}
                            >
                                <option selected>Silahkan pilih Hak Akses</option>
                                {
                                    roles.map((role: Role, index) => (
                                        <option key={index} value={role}>{role}</option>
                                    ))
                                }

                            </select>
                            {
                                errorRole ? <span className='text-xs text-red-500'>
                                    this field is required
                                </span> : null
                            }
                        </label>
                        <label>
                            <span className='font-satoshi font-semibold text-base text-gray-700'>
                                Nama Pengguna{" "}

                            </span>
                            <input
                                value={user.name!}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                type='text'
                                placeholder='Nama Lengkap'
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
                                Email Pengguna
                            </span>

                            <input
                                type='email'
                                value={user.email!}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                placeholder='use@use.use'
                                required
                                disabled={title !== 'Create' ? true : false}
                                className={`form_input ${errorEmail ? 'border-red-500' : ''} `}
                            />
                            {
                                errorEmail ? <span className='text-xs text-red-500'>
                                    this field is required
                                </span> : null
                            }
                        </label>
                        <label>
                            <span className='font-satoshi font-semibold text-base text-gray-700'>
                                Password
                            </span>

                            <input
                                type='password'
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                placeholder='*************************'
                                required
                                className={`form_input ${errorEmail ? 'border-red-500' : ''}`}
                            />
                            {
                                errorEmail ? <span className='text-xs text-red-500'>
                                    this field is required
                                </span> : null
                            }
                        </label>


                    </form>

                </Dialog>

                <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {user && <span>Anda yakin ingin menghapus user {user.name}?</span>}
                    </div>
                </Dialog>

                <Toast ref={toast} />


            </section>
        </AdminLayout>
    )
}
