import { Hama } from "prisma/prisma-client";
import axios from 'axios'

export const HamaService = {
    async getData() {
        return await fetch('/api/hama', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    async createData(hama: Hama, file: File) {
        const formData = new FormData()
        formData.append("hamaCode", hama.hamaCode?.toString()!)
        formData.append("hamaName", hama.hamaName?.toString()!)
        formData.append("image", file)

        return await axios.post('/api/hama', formData);
        // return await fetch('/api/evidence',
        //     {
        //         headers: {
        //             'Cache-Control': 'no-cache',
        //             'Content-Type': 'application/json'

        //         },
        //         method: 'POST',
        //         body: JSON.stringify({
        //             evidenceCode: evidence.evidenceCode,
        //             evidenceName: evidence.evidenceName,
        //             evidenceBobot: evidence.evidenceBobot,
        //         }),
        //     }

        // )
        //     .then((res) => res.json());
    },
    async updateData(hama: Hama, file: File) {

        console.log({file});

        let status: number = 0
        if (file !== undefined) {
            console.log("not undefined");
            status = 1
        } else {
            status = 0
            console.log("defined");
        }

        const formData = new FormData()
        formData.append("id", hama.id.toString())
        formData.append("hamaCode", hama.hamaCode!)
        formData.append("hamaName", hama.hamaName!)
        formData.append("image", file)
        formData.append("status", status.toString())

        return await axios.patch(`/api/hama/${hama.id}`, formData);

        // return await fetch(`/api/hama/${hama.id}`,
        //     {
        //         headers: {
        //             'Cache-Control': 'no-cache',
        //             'Content-Type': 'application/json'

        //         },
        //         method: 'PATCH',
        //         body: JSON.stringify({
        //             evidenceCode: evidence.evidenceCode,
        //             evidenceName: evidence.evidenceName,
        //             evidenceBobot: evidence.evidenceBobot,
        //         }),
        //     }

        // )
        //     .then((res) => res.json());
    },

    async deleteData(hama: Hama) {
        return await fetch(`/api/hama/${hama.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'DELETE'
            }

        )
            .then((res) => res.json());
    },
    
    
}