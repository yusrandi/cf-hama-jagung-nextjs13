import { Evidence } from "prisma/prisma-client";
import axios from 'axios'

export const EvidenceService = {
    async getData() {
        return await fetch('/api/evidence', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    async createData(evidence: Evidence, file: File) {
        const formData = new FormData()
        formData.append("evidenceCode", evidence.evidenceCode)
        formData.append("evidenceName", evidence.evidenceName)
        formData.append("evidenceBobot", evidence.evidenceBobot)
        formData.append("hamaId", evidence.hamaId.toString())
        formData.append("image", file)

        return await axios.post('/api/evidence', formData);

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
        //             hamaId: evidence.hamaId,
        //             image: file
        //         }),
        //     }

        // )
        //     .then((res) => res.json());
    },
    async updateData(evidence: Evidence, file: File) {


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
        formData.append("id", evidence.id.toString())
        formData.append("evidenceCode", evidence.evidenceCode)
        formData.append("evidenceName", evidence.evidenceName)
        formData.append("evidenceBobot", evidence.evidenceBobot)
        formData.append("hamaId", evidence.hamaId.toString())
        formData.append("image", file)
        formData.append("status", status.toString())

        return await axios.patch(`/api/evidence/${evidence.id}`, formData);

        return await fetch(`/api/evidence/${evidence.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'PATCH',
                body: JSON.stringify({
                    evidenceCode: evidence.evidenceCode,
                    evidenceName: evidence.evidenceName,
                    evidenceBobot: evidence.evidenceBobot,
                    hamaId: evidence.hamaId,
                }),
            }

        )
            .then((res) => res.json());
    },

    async deleteData(evidence: Evidence) {
        return await fetch(`/api/evidence/${evidence.id}`,
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