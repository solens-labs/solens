import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { useTable, useSortBy, usePagination } from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function ActivityTable(props) {
  const { data } = props;
  const emptyObject = [
    {
      marketplace: "--",
      symbol: "--",
      type: "--",
      date: "--",
      price: "--",
      buyerLink: "--",
      sellerLink: "--",
    },
    {
      marketplace: "--",
      symbol: "--",
      type: "--",
      date: "--",
      price: "--",
      buyerLink: "--",
      sellerLink: "--",
    },
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
        Header: "TYPE",
        accessor: "symbol",
        // width: 40,
        // maxWidth: 40,
      },
      {
        Header: "MARKET",
        accessor: "marketplace",
      },
      {
        Header: "DETAIL",
        accessor: "type",
      },
      {
        Header: "PRICE",
        accessor: "price",
      },
      // {
      //   Header: "% Change",
      //   accessor: "change",
      // },
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
      {
        Header: "BUYER",
        accessor: "buyerLink",
      },
      {
        Header: "SELLER",
        accessor: "sellerLink",
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
    </>
  );
}
