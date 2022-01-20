import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import { useTable } from "react-table";

export default function DataTable(props) {
  const { collection, rawData } = props;
  // console.log(rawData);

  const [columnsData, setColumnsData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (rawData[0]) {
      const keys = Object.keys(rawData[0]);
      const data = keys.map((header, i) => {
        return {
          Header: header.toUpperCase(),
          accessor: `col${i + 1}`,
        };
      });
      setColumnsData(data);
    }
  }, []);

  /*
    useEffect(() => {
        if (rawData[0]) {
            const tableDataArray = [];
            
            rawData.map((transaction, i) => {
                const values = Object.values(transaction);
                const data = values.map((dataPoint, i) => {
                    const dataRow = { [`col${i + 1}`]: dataPoint };
                    return dataRow;
        });
        
        tableDataArray.push(data);
      });

      //Current working Method for 1 TX
      const values = Object.values(rawData[0]);
      const data = values.map((dataPoint, i) => {
          return { [`col${i + 1}`]: dataPoint };
        });
        
        // set data for table
        setTableData(data);
    }
}, []);
*/

  /*
useEffect(() => {
    if (rawData[0]) {
        const tableDataArray = []
        const data = rawData.map((transaction, i) => {
            const values = Object.values(transaction);
        const txData = values.map((dataPoint, i) => {
            return { [`col${i + 1}`]: dataPoint };
        });
        return txData;
    });
    
    // console.log(data);
    setTableData(data);
}
*/

  const columns = React.useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Column 2",
        accessor: "col2",
      },
    ],
    []
  );
  const data = useMemo(
    () => [
      {
        col1: "Hello",
        col2: "World",
        col3: "World",
      },
      {
        col1: "react-table",
        col2: "rocks",
        col3: "rocks",
      },
      {
        col1: "whatever",
        col2: "you",
        col3: "you",
      },
    ],
    []
  );

  const tableInstance = useTable({ columns: columns, data: data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    // apply the table props
    <table {...getTableProps()}>
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
                  <th {...column.getHeaderProps()}>
                    {
                      // Render the header
                      column.render("Header")
                    }
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
          rows.map((row) => {
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
                      <td {...cell.getCellProps()}>
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
  );
}
