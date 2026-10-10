import {
   Collapse,
   IconButton,
   LinearProgress,
   Table,
   TableBody,
   TableHead,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useState } from "react";
import { DataTableColumn } from "./DataTable.types";
import {
   TableBodyCell,
   TableBodyRow,
   TableHeadCell,
   TableHeadRow,
   DataTableContainer,
   CollapseRow,
   CollapseCell,
} from "./DataTable.styles";
import { FlexFillCenter } from "../../themes/utils";

type DataTableProps<T extends object> = {
   columns: ReadonlyArray<DataTableColumn<T>>;
   data: T[];
   isLoading?: boolean;
   hiddenColumns?: string[];
   renderCollapse?: (row: T) => React.ReactNode;
   getRowId?: (row: T) => string | number;
   /** Texto cuando no hay filas: mejor uno que diga qué se buscó y qué probar. */
   emptyMessage?: string;
};

type RowProps<T extends object> = {
   row: T;
   columns: ReadonlyArray<DataTableColumn<T>>;
   renderCollapse?: (row: T) => React.ReactNode;
   isLast: boolean;
};

const RowComponent = <T extends object>({ row, columns, renderCollapse, isLast }: RowProps<T>) => {
   const [open, setOpen] = useState(false);
   const hasCollapse = renderCollapse !== undefined;

   const roundDataRow = isLast && (!hasCollapse || !open);
   const roundCollapseRow = isLast && hasCollapse && open;

   const dataRowSx = roundDataRow
      ? {
         "& > td:first-of-type": { borderBottomLeftRadius: "1.25rem" },
         "& > td:last-child": { borderBottomRightRadius: "1.25rem" },
      }
      : undefined;

   const collapseRowSx = roundCollapseRow
      ? {
         "& > td": {
            borderBottomLeftRadius: "1.25rem",
            borderBottomRightRadius: "1.25rem",
         },
      }
      : undefined;

   return (
      <>
         <TableBodyRow sx={dataRowSx}>
            {hasCollapse && (
               <TableBodyCell sx={{ width: "3rem" }}>
                  <IconButton
                     size="small"
                     onClick={() => setOpen(!open)}
                     aria-label="expandir fila"
                  >
                     {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
               </TableBodyCell>
            )}
            {columns.map((column) => {
               const cellContent =
                  column.dataField !== undefined
                     ? column.format
                        ? column.format(row)
                        : row[column.dataField] !== null &&
                           row[column.dataField] !== undefined
                           ? String(row[column.dataField])
                           : ""
                     : column.format
                        ? column.format(row)
                        : "";

               return (
                  <TableBodyCell key={String(column.id)}>
                     {cellContent}
                  </TableBodyCell>
               );
            })}
         </TableBodyRow>
         {hasCollapse && (
            <CollapseRow sx={collapseRowSx}>
               <CollapseCell colSpan={columns.length + 1}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                     {renderCollapse(row)}
                  </Collapse>
               </CollapseCell>
            </CollapseRow>
         )}
      </>
   );
};

const Row = React.memo(RowComponent) as typeof RowComponent;

const DataTable = <T extends object>({
   columns,
   data,
   isLoading,
   hiddenColumns = [],
   renderCollapse,
   getRowId,
   emptyMessage = "No encontré nada para mostrar.",
}: DataTableProps<T>) => {
   const visibleColumns = columns.filter((column) => !hiddenColumns.includes(column.id));
   const hasCollapse = renderCollapse !== undefined;

   return (
      <>
         {isLoading && <LinearProgress sx={{ marginTop: "1.5rem" }} />}
         <DataTableContainer>
            <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
               <TableHead>
                  <TableHeadRow>
                     {hasCollapse && <TableHeadCell sx={{ width: "3rem" }} />}
                     {visibleColumns.map((column, index) => (
                        <TableHeadCell key={index} sx={column.thColumnStyle}>
                           {column.label}
                        </TableHeadCell>
                     ))}
                  </TableHeadRow>
               </TableHead>
               <TableBody>
                  {data.length > 0 ? (
                     data.map((row, index) => (
                        <Row
                           key={getRowId ? getRowId(row) : index}
                           row={row}
                           columns={visibleColumns}
                           renderCollapse={renderCollapse}
                           isLast={index === data.length - 1}
                        />
                     ))
                  ) : !isLoading ? (
                     <TableBodyRow>
                        <TableBodyCell colSpan={10}>
                           <FlexFillCenter>
                              {emptyMessage}
                           </FlexFillCenter>
                        </TableBodyCell>
                     </TableBodyRow>
                  ) : null}
               </TableBody>
            </Table>
         </DataTableContainer>
      </>
   );
};

export default DataTable;
