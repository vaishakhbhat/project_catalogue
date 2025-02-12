import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { getPercentDash } from '../../api/analytics';

interface Column {
  id: 'projectName' | 'members' | 'projectStatus' | 'progressPercent';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'projectName', label: 'Project Name', minWidth: 170 },
  { id: 'members', label: 'Members', minWidth: 200 },
  {
    id: 'projectStatus',
    label: 'Project Status',
    minWidth: 170
  },
  {
    id: 'progressPercent',
    label: 'Progress Percent',
    minWidth: 170,
    format: (value: number) => `${value}%`,
  },
];

interface RowData {
  projectName: string;
  members: string[];
  projectStatus: string;
  progressPercent: number;
}

export default function StickyHeadTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<RowData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPercentDash();
        setRows(data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredRows = rows.filter((row) =>
    row.members.some(member =>
      member.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2, borderRadius: '0.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: '1rem' }}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ 
                    minWidth: column.minWidth, 
                    backgroundColor: '#f0f0f0', 
                    fontSize: '1rem', 
                    fontWeight: 'bold', 
                    fontFamily: 'inherit' 
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.projectName}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} sx={{ fontSize: '0.875rem', fontFamily: 'inherit' }}>
                          {column.id === 'members' && Array.isArray(value)
                            ? value.join(', ')
                            : column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ fontSize: '0.875rem' }}
      />
    </Paper>
  );
}
