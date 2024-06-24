import { useMemo, useState, useEffect } from "react";
import { Container, TextField, Box } from "@mui/material";
import "./App.css";
import axios from "axios";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

// Custom filter component for range filtering
const RangeFilter = ({ column }) => {
  const { filterValue = [], setFilterValue } = column;
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        label="Min"
        value={filterValue[0] || ""}
        onChange={(e) => {
          const val = e.target.value;
          setFilterValue((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1],
          ]);
        }}
        variant="standard"
        type="number"
      />
      <TextField
        label="Max"
        value={filterValue[1] || ""}
        onChange={(e) => {
          const val = e.target.value;
          setFilterValue((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined,
          ]);
        }}
        variant="standard"
        type="number"
      />
    </Box>
  );
};

const DateRangeFilter = ({ column }) => {
  const { filterValue = [], setFilterValue } = column;
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        label="From"
        type="date"
        value={filterValue[0] || ""}
        onChange={(e) => {
          const val = e.target.value;
          setFilterValue((old = []) => [val || undefined, old[1]]);
        }}
        InputLabelProps={{
          shrink: true,
        }}
        variant="standard"
      />
      <TextField
        label="To"
        type="date"
        value={filterValue[1] || ""}
        onChange={(e) => {
          const val = e.target.value;
          setFilterValue((old = []) => [old[0], val || undefined]);
        }}
        InputLabelProps={{
          shrink: true,
        }}
        variant="standard"
      />
    </Box>
  );
};

// Custom filter functions
const filterBetween = (rows, id, filterValue) => {
  const [min, max] = filterValue;
  return rows.filter((row) => {
    const rowValue = row.values[id];
    if (min !== undefined && rowValue < min) return false;
    if (max !== undefined && rowValue > max) return false;
    return true;
  });
};

const filterDateBetween = (rows, id, filterValue) => {
  const [from, to] = filterValue;
  return rows.filter((row) => {
    const rowValue = new Date(row.values[id]);
    if (from && rowValue < new Date(from)) return false;
    if (to && rowValue > new Date(to)) return false;
    return true;
  });
};

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend
    axios
      .get("https://datatable-backend-m1gz.onrender.com/data")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // Should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "subcategory",
        header: "Subcategory",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        filterFn: filterDateBetween,
        Filter: DateRangeFilter,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        filterFn: filterDateBetween,
        Filter: DateRangeFilter,
      },
      {
        accessorKey: "price",
        header: "Price",
        filterFn: filterBetween,
        Filter: RangeFilter,
      },
      {
        accessorKey: "sale_price",
        header: "Sale Price",
        filterFn: filterBetween,
        Filter: RangeFilter,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableGrouping: true,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      grouping: ["category"], // Initial grouping by category
    },
  });

  return (
    <Container sx={{ py: 5 }}>
      <MaterialReactTable table={table} />
    </Container>
  );
}

export default App;
