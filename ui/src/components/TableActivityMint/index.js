import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { useTable, useSortBy, usePagination } from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const defaultPropGetter = () => ({});

export default function ActivityMintTable(props) {
  const {
    data,
    getHeaderProps = defaultPropGetter,
    getColumnProps = defaultPropGetter,
    getRowProps = defaultPropGetter,
    getCellProps = defaultPropGetter,
  } = props;
  const emptyObject = [
    {
      marketplace: "--",
      symbol: "--",
      type: "--",
      price: "--",
      buyerLink: "--",
      sellerLink: "--",
      date: "--",
      tx: "--",
    },
    {
      marketplace: "--",
      symbol: "--",
      type: "--",
      price: "--",
      buyerLink: "--",
      sellerLink: "--",
      date: "--",
      tx: "--",
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
      {
        Header: "TYPE",
        accessor: "symbol",
        width: 90,
      },
      {
        Header: "MARKET",
        accessor: "marketplace",
        minWidth: 175,
      },
      {
        Header: "DETAIL",
        accessor: "type",
      },
      {
        Header: "PRICE",
        accessor: "price",
        minWidth: 110,
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
        Header: "TIME",
        accessor: "date",
        minWidth: 165,
      },
      {
        Header: "TX",
        accessor: "tx",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: columns,
        data: tableData,
      },
      useSortBy
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
            {rows.map((row, i) => {
              prepareRow(row);
              let style = 1;
              if (i % 2) {
                style = 2;
              }

              return (
                <tr {...row.getRowProps()} className={`activity_row` + style}>
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
    </>
  );
}
