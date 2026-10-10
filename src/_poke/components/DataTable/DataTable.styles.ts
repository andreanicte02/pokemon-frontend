import { styled } from '@mui/material/styles'
import { TableCell, TableContainer, TableRow } from '@mui/material'

export const buttonDetailStyle = {
    minWidth: '2rem',
    height: '2rem',
    border: '0.063rem solid',
    borderRadius: '50%',
    padding: 0,
}

export const TableHeadCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    paddingTop: '1.5rem',
    paddingBottom: '1.5rem',
    border: 'none',
    textTransform: 'uppercase',

}))

export const TableBodyCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.primary.dark,
    fontWeight: theme.typography.fontWeightRegular,
    paddingTop: '1.063rem',
    paddingBottom: '0.938rem',
    backgroundColor: theme.palette.secondary.main,
    border: 'none',

}))


export const TableHeadRow = styled(TableRow)({})

export const TableBodyRow = styled(TableRow)({


    '&:first-of-type': {
        'td': {
            '&:first-of-type': { borderTopLeftRadius: '1.25rem' },
            '&:last-child': { borderTopRightRadius: '1.25rem' },
        },
    },

})

export const CollapseRow = styled(TableRow)(() => ({

}))

export const CollapseCell = styled(TableCell)(({ theme }) => ({
    paddingTop: 0,
    paddingBottom: 0,
    border: 'none',
    backgroundColor: theme.palette.secondary.main,
}))

export const DataTableContainer = styled(TableContainer)(() => ({
    width: '100%',
    overflowX: 'auto'
}))