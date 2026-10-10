import {SxProps, Theme} from '@mui/material'

export interface Column<T> {
    id: string
    dataField?: keyof T
    label: string
    thColumnStyle?: SxProps<Theme>
    format?: (row: T) => React.ReactNode
}

export type DataTableColumn<T> = Column<T>
