import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { useTable, useSortBy, usePagination, useFlexLayout } from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Loader from "../Loader";
import { marketplaceSelect } from "../../utils/collectionStats";
import { useSelector } from "react-redux";
import { selectSolPrice } from "../../redux/app";

const defaultPropGetter = () => ({});

export default function ActivityCollectionTable(props) {
  const {
    data,
    getHeaderProps = defaultPropGetter,
    getColumnProps = defaultPropGetter,
    getRowProps = defaultPropGetter,
    getCellProps = defaultPropGetter,
  } = props;

  const solPrice = useSelector(selectSolPrice);

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
        Header: <h5 className="table_header">{}</h5>,
        accessor: "image",
        minWidth: 100,
        width: 100,
        maxWidth: 100,
        disableSortBy: true,
      },
      {
        Header: <h5 className="table_header">COLLECTION</h5>,
        accessor: "collection",
        minWidth: 300,
        width: 300,
        maxWidth: 300,
        sortType: (a, b) => {
          const a1 = a.values.collection.name.toLowerCase();
          const b1 = b.values.collection.name.toLowerCase();
          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        Cell: (row) => {
          return (
            <div className="d-flex flex-column justify-content-center align-items-start">
              <a
                href={`/collection/${row.value.symbol}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                <span style={{ fontSize: "1rem" }}>{row.value.name}</span>
              </a>
              <span style={{ fontSize: "0.80rem", color: "grey" }}>
                Supply: {row.value.supply}
              </span>
            </div>
          );
        },
      },
      {
        Header: <h5 className="table_header">FLOOR</h5>,
        accessor: "floor",
        minWidth: 155,
        maxWidth: 155,
        sortType: (a, b) => {
          let a1 = a.values.floor.floor;
          let b1 = b.values.floor.floor;

          if (a1 !== "N/A") {
            a1 = a1.slice(0, a1.length - 2);
            a1 = Number(a1);
          } else {
            a1 = 0;
          }

          if (b1 !== "N/A") {
            b1 = b1.slice(0, b1.length - 2);
            b1 = Number(b1);
          } else {
            b1 = 0;
          }

          if (a1 < b1) return 1;
          else if (a1 > b1) return -1;
          else return 0;
        },
        Cell: (row) => {
          const marketplace = marketplaceSelect(row.value.floorMP);
          return (
            <div className="d-flex flex-column justify-content-center align-items-start">
              <span style={{ fontSize: "1rem" }}>{row.value.floor}</span>

              <span style={{ fontSize: "0.80rem", color: "grey" }}>
                {marketplace}
              </span>
            </div>
          );
        },
      },
      // {
      //   Header: (
      //     <h5 className="table_header">
      //       FLOOR <span className="collection_stats_days slim">(1d %)</span>
      //     </h5>
      //   ),
      //   accessor: "floorChange",
      //   minWidth: 145,
      //   maxWidth: 145,
      // },
      // {
      //   Header: (
      //     <h5 className="table_header">
      //       VOL <span className="collection_stats_days slim">(1d)</span>
      //     </h5>
      //   ),
      //   accessor: "volumeDay",
      //   minWidth: 155,
      //   width: 155,
      //   maxWidth: 155,
      //   Cell: (row) => {
      //     let changeColor = "white";

      //     return (
      //       <div className="d-flex flex-column justify-content-center align-items-start">
      //         <span>
      //           {row.value.volumeDay.toLocaleString("en", {
      //             minimumFractionDigits: 2,
      //             maximumFractionDigits: 2,
      //           }) + " ◎"}
      //         </span>
      //         <span
      //           style={{
      //             fontSize: "0.8rem",
      //             color: `${
      //               row.value.dailyChange > 0 ? "green" : "rgba(201, 87, 87, 1)"
      //             }`,
      //           }}
      //         >
      //           {row.value.dailyChange.toFixed(2) + " %"}
      //         </span>
      //       </div>
      //     );
      //   },
      // },
      {
        Header: (
          <h5 className="table_header">
            VOL <span className="collection_stats_days slim">(1d)</span>
          </h5>
        ),
        accessor: "volumeDay",
        minWidth: 155,
        width: 155,
        maxWidth: 155,
        Cell: (row) => {
          return (
            <span>
              {row.value.toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + " ◎"}
            </span>
          );
        },
      },
      {
        Header: (
          <h5 className="table_header">
            VOL <span className="collection_stats_days slim">(1d %)</span>
          </h5>
        ),
        accessor: "dailyChange",
        minWidth: 155,
        width: 155,
        maxWidth: 155,
        Cell: (row) => {
          return (
            <span
              style={{
                color: `${row.value > 0 ? "green" : "rgba(201, 87, 87, 1)"}`,
              }}
            >
              {row.value.toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) + " %"}
            </span>
          );
        },
      },
      {
        Header: (
          <h5 className="table_header">
            VOL <span className="collection_stats_days slim">(1w)</span>
          </h5>
        ),
        accessor: "volumeWeek",
        minWidth: 155,
        width: 155,
        maxWidth: 155,
        Cell: (row) => {
          return (
            <span>
              {row.value.toLocaleString("en", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) + " ◎"}
            </span>
          );
        },
      },
      {
        Header: (
          <h5 className="table_header">
            VOL <span className="collection_stats_days slim">(ALL)</span>
          </h5>
        ),
        accessor: "volumeTotal",
        minWidth: 155,
        maxWidth: 155,
        Cell: (row) => {
          return (
            <span>
              {row.value.toLocaleString("en", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }) + " ◎"}
            </span>
          );
        },
      },
      // {
      //   Header: <h5 className="table_header">LAUNCHED</h5>,
      //   accessor: "launch",
      //   minWidth: 155,
      //   width: 155,
      //   maxWidth: 155,
      // },
      {
        Header: <h5 className="table_header">MARKET CAP</h5>,
        accessor: "marketCap",
        minWidth: 155,
        maxWidth: 155,
        Cell: (row) => {
          let marketCapInit = "N/A";
          if (row.value > 0) {
            marketCapInit = Number((row.value * solPrice).toFixed(0));
            marketCapInit = marketCapInit.toLocaleString();
            marketCapInit = "$ " + marketCapInit;
          }

          return marketCapInit;
        },
      },
      {
        Header: <h5 className="table_header">TRADE</h5>,
        accessor: "trade",
        minWidth: 170,
        width: 170,
        maxWidth: 170,
        disableSortBy: true,
      },
      // {
      //   Header: <h5 className="table_header">ANALYTICS</h5>,
      //   accessor: "analytics",
      //   minWidth: 160,
      //   maxWidth: 160,
      // },
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
      initialState: { pageSize: 50 },
    },
    useSortBy,
    usePagination
    // useFlexLayout
  );

  return (
    <>
      {!loading && (
        <>
          <div className="full_width_table col-12 overflow-auto">
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
                            className="activity_data2"
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
