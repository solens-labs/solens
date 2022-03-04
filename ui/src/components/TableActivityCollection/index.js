import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { useTable, useSortBy, usePagination, useFlexLayout } from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Loader from "../Loader";
import { shortenAddress } from "../../candy-machine";
import { explorerLink, themeColors } from "../../constants/constants";
import ArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const defaultPropGetter = () => ({});

export default function ActivityCollectionTable(props) {
  const {
    data,
    getHeaderProps = defaultPropGetter,
    getColumnProps = defaultPropGetter,
    getRowProps = defaultPropGetter,
    getCellProps = defaultPropGetter,
  } = props;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Object.keys(data).length === 0) {
      setLoading(true);
      // setTableData(emptyObject);
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
        disableSortBy: true,
      },
      {
        Header: "PRICE",
        accessor: "price",
        width: 110,
        Cell: (row) => {
          return row.value + " ◎";
        },
      },
      {
        Header: "TYPE",
        accessor: "symbol",
        width: 100,
        disableSortBy: true,
      },
      {
        Header: "DETAIL",
        accessor: "type",
        width: 150,
      },
      // {
      //   Header: "% Change",
      //   accessor: "change",
      // },
      {
        Header: "BUYER",
        accessor: "buyer",
        minWidth: 175,
        Cell: (row) => {
          return (
            <a
              href={explorerLink("account", row.value)}
              target="_blank"
              style={{ textDecoration: "none", color: themeColors[0] }}
            >
              {shortenAddress(row.value)}
            </a>
          );
        },
      },
      {
        Header: "SELLER",
        accessor: "seller",
        minWidth: 175,
        Cell: (row) => {
          return (
            <a
              href={explorerLink("account", row.value)}
              target="_blank"
              style={{ textDecoration: "none", color: themeColors[0] }}
            >
              {shortenAddress(row.value)}
            </a>
          );
        },
      },
      {
        Header: "MARKET",
        accessor: "marketplace",
        minWidth: 175,
      },
      {
        Header: "TX",
        accessor: "txHash",
        minWidth: 130,
      },
      {
        Header: "TIME",
        accessor: "date",
        minWidth: 175,
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
                    <tr
                      {...row.getRowProps()}
                      className={`activity_row_image` + style}
                    >
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
          <div className="col-12 d-flex flex-column align-items-center">
            <div className="d-flex flex-row flex-wrap justify-content-center align-items-center mt-3 mb-2">
              <button
                className="btn-button btn-main pagination_button"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <ArrowLeftIcon />
              </button>
              <div className="p-2 p-lg-3 pb-lg-0 pt-lg-0 pagination_text">
                Page {pageIndex + 1} of {pageOptions.length}
              </div>
              <button
                className="btn-button btn-main pagination_button"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <ArrowRightIcon />
              </button>
            </div>
            <div>
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
          </div>
        </>
      )}

      {loading && <Loader />}
    </>
  );
}
