import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import "../Buttons/style.css";
import {
  useTable,
  useSortBy,
  usePagination,
  useBlockLayout,
} from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Loader from "../Loader";

const defaultPropGetter = () => ({});

export default function TradersTable(props) {
  const {
    data,
    getHeaderProps = defaultPropGetter,
    getColumnProps = defaultPropGetter,
    getRowProps = defaultPropGetter,
    getCellProps = defaultPropGetter,
  } = props;
  // const data = null;

  const blankTx = {
    address: "--",
    total: "--",
    count: "--",
    min: "--",
    average: "--",
    max: "--",
  };

  const emptyObject = [
    blankTx,
    blankTx,
    blankTx,
    blankTx,
    blankTx,
    blankTx,
    blankTx,
    blankTx,
    blankTx,
    blankTx,
  ];

  const [tableData, setTableData] = useState(emptyObject);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      setTableData(emptyObject);
    } else {
      if (Object.keys(data).length < 6) {
        const items = Object.keys(data).length;
        const addedItems = 10 - items;
        for (let i = 0; i < addedItems; i++) {
          data.push(blankTx);
        }
        setTableData(data);
      } else {
        setTableData(data);
      }
    }
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: "ADDRESS",
        accessor: "address",
        minWidth: 150,
        width: 150,
        maxWidth: 150,
        overflow: "hidden",
      },
      {
        Header: "TOTAL",
        accessor: "total",
        minWidth: 110,
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "COUNT",
        accessor: "count",
        minWidth: 90,
        width: 90,
        maxWidth: 90,
      },
      {
        Header: "MIN",
        accessor: "min",
        minWidth: 110,
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "AVG",
        accessor: "average",
        minWidth: 110,
        width: 110,
        maxWidth: 110,
      },
      {
        Header: "MAX",
        accessor: "max",
        minWidth: 110,
        width: 110,
        maxWidth: 110,
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
    { columns: columns, data: tableData },
    useSortBy,
    usePagination,
    useBlockLayout
  );

  // if (!data) {
  //   return null;
  // }

  return (
    <>
      {/* <div className="col-12">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className="pagination_select"
        >
          {[10, 20, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Display {pageSize}
            </option>
          ))}
        </select>
      </div> */}
      <div className="col-12 overflow-auto">
        <table {...getTableProps()} style={{ width: "100%" }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps([
                      {
                        style: {
                          maxWidth: column.maxWidth,
                          minWidth: column.minWidth,
                          width: column.width,
                        },
                      },
                      column.getSortByToggleProps(),
                      getColumnProps(column),
                      getHeaderProps(column),
                    ])}
                    className={
                      column.isSorted
                        ? column.isSortedDesc
                          ? "activity_header sorted_desc"
                          : "activity_header sorted_asc"
                        : "activity_header"
                    }
                  >
                    <div className="header_inner d-flex flex-row p-0 m-0 justify-content-center">
                      {column.render("Header")}
                      <div className="sort_arrow">
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
                <tr {...row.getRowProps()} className={`table_row` + style}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps([
                          {
                            style: {
                              maxWidth: cell.column.maxWidth,
                              minWidth: cell.column.minWidth,
                              width: cell.column.width,
                            },
                          },
                          getColumnProps(cell.column),
                          getCellProps(cell),
                        ])}
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
      <div className="d-flex flex-row flex-wrap justify-content-center align-items-center mt-3 mb-2">
        <button
          className="btn-button btn-main pagination_button"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>
        <div className="p-2 p-lg-3 pb-lg-0 pt-lg-0 pagination_text">
          Page {pageIndex + 1} of {pageOptions.length}
        </div>
        <button
          className="btn-button btn-main pagination_button"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next
        </button>
      </div>
      <div>
        {/* <div>Go to page:</div>
        <input
          type="number"
          defaultValue={pageIndex + 1 || 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
        /> */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className="pagination_select"
        >
          {[5, 10, 20, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Display {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
