import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { useTable, useSortBy, usePagination } from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Loader from "../Loader";

export default function ActivityCollectionTable(props) {
  const { data } = props;

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
      // {
      //   Header: "",
      //   accessor: "symbol",
      //   Cell: (row) => {
      //     return (
      //       <div>
      //         <img height={34} src={logo} />
      //       </div>
      //     );
      //   },
      // },

      {
        Header: "ITEM",
        accessor: "image",
      },
      // {
      //   Header: "MINT",
      //   accessor: "mint",
      // },
      {
        Header: "PRICE (SOL)",
        accessor: "price",
      },
      {
        Header: "TYPE",
        accessor: "symbol",
        // width: 40,
        // maxWidth: 40,
      },
      {
        Header: "DETAIL",
        accessor: "type",
      },
      // {
      //   Header: "% Change",
      //   accessor: "change",
      // },
      {
        Header: "BUYER",
        accessor: "buyerLink",
      },
      {
        Header: "SELLER",
        accessor: "sellerLink",
      },
      {
        Header: "MARKET",
        accessor: "marketplace",
      },
      {
        Header: "TX",
        accessor: "txHash",
      },
      {
        Header: "TIME",
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
      {!loading && (
        <>
          <div className="col-12 data_table overflow-auto">
            <table {...getTableProps()} style={{ width: "100%" }}>
              <thead>
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => (
                          // Apply the header cell props
                          <th
                            {...column.getHeaderProps(
                              // {
                              //   style: {
                              //     width: column.width,
                              //     maxWidth: column.maxWidth,
                              //   },
                              // }
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
                            <div className="header_inner d-flex flex-row p-0 m-0 justify-content-center">
                              {
                                // Render the header
                                column.render("Header")
                              }
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
                        ))
                      }
                    </tr>
                  ))
                }
              </thead>
              {/* Apply the table body props */}
              <tbody {...getTableBodyProps()}>
                {
                  // Loop over the table rows
                  page.map((row, i) => {
                    // Prepare the row for display
                    prepareRow(row);
                    let style = 1;
                    if (i % 2) {
                      style = 2;
                    }

                    return (
                      // Apply the row props
                      <tr
                        {...row.getRowProps()}
                        className={`activity_row_image` + style}
                      >
                        {
                          // Loop over the rows cells
                          row.cells.map((cell) => {
                            // Apply the cell props
                            return (
                              <td
                                {...cell.getCellProps()}
                                className="activity_data"
                              >
                                {
                                  // Render the cell contents
                                  cell.render("Cell")
                                }
                              </td>
                            );
                          })
                        }
                      </tr>
                    );
                  })
                }
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