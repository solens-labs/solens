import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { useTable, useSortBy, usePagination, useFlexLayout } from "react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { explorerLink, themeColors } from "../../constants/constants";
import { shortenAddress } from "../../candy-machine";

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
        disableSortBy: true,
      },
      {
        Header: "MARKET",
        accessor: "marketplace",
        width: 175,
      },
      {
        Header: "DETAIL",
        accessor: "type",
        width: 150,
      },
      {
        Header: "PRICE",
        accessor: "price",
        width: 120,
        accessor: "price",
        Cell: (row) => {
          return row.value + " ◎";
        },
      },
      // {
      //   Header: "% Change",
      //   accessor: "change",
      // },
      {
        Header: "BUYER",
        accessor: "buyer",
        width: 130,
        // disableSortBy: true,
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
        // disableSortBy: true,
        width: 130,
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
        Header: "TIME",
        accessor: "date",
        minWidth: 170,
      },
      {
        Header: "TX",
        accessor: "tx",
        disableSortBy: true,
        width: 130,
        Cell: (row) => {
          const hash = row.value;
          return (
            <a
              href={explorerLink("tx", row.value)}
              style={{ textDecoration: "none", color: themeColors[0] }}
              target="_blank"
            >
              {hash.slice(0, 6) + "..."}
            </a>
          );
        },
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
      useSortBy,
      useFlexLayout
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
