import { Evidence } from "prisma/prisma-client";

export const EvidenceService = {
    async getData() {
        return await fetch('/api/evidence', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    async createData(evidence: Evidence) {
        return await fetch('/api/evidence',
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'POST',
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
    async updateData(evidence: Evidence) {
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