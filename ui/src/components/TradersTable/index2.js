import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import "../Buttons/style.css";
import { useTable, useSortBy, usePagination } from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function TradersTable(props) {
  const { data } = props;
  const blankTx = {
    address: "--",
    total: "--",
    count: "--",
    min: "--",
    average: "--",
    max: "--",
  };

  const emptyObject = [blankTx, blankTx, blankTx, blankTx, blankTx, blankTx];

  const [tableData, setTableData] = useState(emptyObject);

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      setTableData(emptyObject);
    } else {
      if (Object.keys(data).length < 6) {
        const items = Object.keys(data).length;
        const addedItems = 6 - items;
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
      },
      {
        Header: "TOTAL",
        accessor: "total",
      },
      {
        Header: "COUNT",
        accessor: "count",
      },
      {
        Header: "MIN",
        accessor: "min",
      },
      {
        Header: "AVG",
        accessor: "average",
      },
      {
        Header: "MAX",
        accessor: "max",
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
  } = useTable({ columns: columns, data: tableData }, useSortBy, usePagination);

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
      <div className="col-12 p-3 pt-0 pb-0 d-flex justify-content-start overflow-auto">
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
              page.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  // Apply the row props
                  <tr {...row.getRowProps()}>
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
