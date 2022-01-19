import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { useTable, useSortBy, usePagination } from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function ActivityWalletTable(props) {
  const { data } = props;
  const blankObject = {
    txType: "--",
    detail: "--",
    mintLink: "--",
    symbol: "--",
    price: "--",
    marketplace: "--",
    transactor: "--",
    txHash: "--",
    date: "--",
  };

  const emptyObject = [
    blankObject,
    blankObject,
    blankObject,
    blankObject,
    blankObject,
    blankObject,
    blankObject,
    blankObject,
    blankObject,
    blankObject,
  ];

  const [tableData, setTableData] = useState(emptyObject);

  useEffect(() => {
    if (Object.keys(data).length === 0) {
      setTableData(emptyObject);
    } else {
      setTableData(data);
    }
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: "TYPE",
        accessor: "txType",
      },
      {
        Header: "DETAIL",
        accessor: "detail",
      },
      {
        Header: "MINT",
        accessor: "mintLink",
      },
      {
        Header: "COLLECTION",
        accessor: "symbol",
      },
      {
        Header: "PRICE",
        accessor: "price",
      },
      {
        Header: "MARKET",
        accessor: "marketplace",
      },
      {
        Header: "ADDRESS",
        accessor: "transactor",
      },
      {
        Header: "TX",
        accessor: "txHash",
      },
      {
        Header: "DATE",
        accessor: "date",
        sortMethod: (a, b) => {
          var a1 = new Date(a).getTime();
          var b1 = new Date(b).getTime();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns: columns,
      data: tableData,
      initialState: { pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <div className="col-12 data_table overflow-auto">
        <table {...getTableProps()} style={{ width: "100%" }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={
                      column.isSorted
                        ? column.isSortedDesc
                          ? "activity_header sorted_desc"
                          : "activity_header sorted_asc"
                        : "activity_header"
                    }
                  >
                    <div className="header_inner d-flex flex-row p-2 pt-0 justify-content-center">
                      {column.render("Header")}
                      <div className="sort_arrow_wallet">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ArrowDropDownIcon />
                          ) : (
                            <ArrowDropUpIcon />
                          )
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="activity_data">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
