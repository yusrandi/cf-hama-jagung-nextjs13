import { Evidence } from "prisma/prisma-client"
import { KeyakinanType } from "./keyakinan-type"

export type ResultType = {
    keyakinan: KeyakinanType
    evidence: Evidence
}
