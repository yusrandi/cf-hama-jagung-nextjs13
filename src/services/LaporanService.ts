import { Laporan } from "prisma/prisma-client";

export const LaporanService = {
    async getData() {
        return await fetch('/api/laporan', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    async createData(userName: string, hamaName: string, cf: string) {
        return await fetch('/api/laporan',
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'POST',
                body: JSON.stringify({
                    userName: userName,
                    hamaName: hamaName,
                    cf: cf
                }),
            }

        )
            .then((res) => res.json());
    },
    async updateData(laporan: Laporan) {
        return await fetch(`/api/laporan/${laporan.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'PATCH',
                body: JSON.stringify({
                    userName: laporan.userName,
                    hamaName: laporan.hamaName,
                    cf: laporan.cf
                }),
            }

        )
            .then((res) => res.json());
    },

    async deleteData(laporan: Laporan) {
        return await fetch(`/api/laporan/${laporan.id}`,
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