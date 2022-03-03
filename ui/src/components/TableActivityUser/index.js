import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { useTable, useSortBy, usePagination, useFlexLayout } from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Loader from "../Loader";

const defaultPropGetter = () => ({});

export default function ActivityWalletTable(props) {
  const {
    data,
    getHeaderProps = defaultPropGetter,
    getColumnProps = defaultPropGetter,
    getRowProps = defaultPropGetter,
    getCellProps = defaultPropGetter,
  } = props;

  const blankObject = {
    image: "--",
    txType: "--",
    detail: "--",
    // mintLink: "--",
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(data).length === 0) {
      // setLoading(true);
    } else {
      setTableData(data);
      setLoading(false);
    }
  }, [data]);

  const columns = React.useMemo(
    () => [
      {
        Header: "ITEM",
        accessor: "image",
      },
      {
        Header: "COLLECTION",
        accessor: "symbol",
      },
      {
        Header: "TYPE",
        accessor: "txType",
        width: 90,
      },
      {
        Header: "DETAIL",
        accessor: "detail",
      },
      // {
      //   Header: "MINT",
      //   accessor: "mintLink",
      // },
      {
        Header: "PRICE",
        accessor: "price",
        Cell: (row) => {
          return row.value + " ◎";
        },
      },
      {
        Header: "MARKET",
        accessor: "marketplace",
        minWidth: 175,
      },
      {
        Header: "ADDRESS",
        accessor: "transactor",
      },
      {
        Header: "HASH",
        accessor: "txHash",
      },
      {
        Header: "DATE",
        accessor: "date",
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
    usePagination,
    useFlexLayout
  );

  return (
    <>
      {!loading && (
        <>
          <div className="full_width_table col-12 data_table overflow-auto">
            <table {...getTableProps()} style={{ width: "100%" }}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
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
                {page.map((row, i) => {
                  prepareRow(row);
                  let style = 1;
                  if (i % 2) {
                    style = 2;
                  }

                  return (
                    <tr
                      {...row.getRowProps()}
                      className={`activity_row_image` + style}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="activity_data"
                          >
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
      )}

      {loading && <Loader />}
    </>
  );
}
