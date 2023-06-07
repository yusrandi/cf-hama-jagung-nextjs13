export type KeyakinanType = {
    id: string
    value: string
}

export const ListKeyakinan: KeyakinanType[] = [
    {id : "-1", value: "Pasti Tidak"},
    {id : "-0.8", value: "Hampir Pasti Tidak"},
    {id : "-0.6", value: "Kemungkinan Besar Tidak"},
    {id : "-0.4", value: "Mungkin Tidak"},
    {id : "0.2", value: "Tidak Tahu"},
    {id : "0.4", value: "Mungkin"},
    {id : "0.6", value: "Kemungkinan Besar"},
    {id : "0.8", value: "Hampir Pasti"},
    {id : "1", value: "Pasti"}
]