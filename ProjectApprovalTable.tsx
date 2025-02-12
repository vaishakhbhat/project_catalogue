import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, CircularProgress, TableContainer } from '@mui/material';
import { Project } from '../ProjectInterface';
import { styled } from '@mui/material/styles';

interface ProjectApprovalTableProps {
  projects: Project[];
  onApprove: (projectId: string) => Promise<void>;
  onReject: (projectId: string) => Promise<void>;
  loading?: boolean;
}

const StyledTableContainer = styled(TableContainer)( {
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
});

const StyledTableCell = styled(TableCell)( {
  padding: '16px',
});

const StyledTableRow = styled(TableRow)(( { theme } ) => ( {
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ProjectApprovalTable: React.FC<ProjectApprovalTableProps> = ( { projects, onApprove, onReject, loading = false } ) => {
  const navigate = useNavigate(); 

  // Filter pending and rejected projects
  const pendingProjects = projects.filter(project => project.demoURL !== "Approved" && project.demoURL !== "Rejected");
  const rejectedProjects = projects.filter(project => project.demoURL === "Rejected");
  
  console.log('Pending Projects:', pendingProjects);
  console.log('Rejected Projects:', rejectedProjects); // Debugging log

  const handleApprove = async (projectId: string) => {
    const confirmApprove = window.confirm('Are you sure you want to approve this project?');
    if (confirmApprove) {
      await onApprove(projectId);
      navigate(0); 
    }
  };

  const handleReject = async (projectId: string) => {
    const confirmReject = window.confirm('Are you sure you want to reject this project?');
    if (confirmReject) {
      await onReject(projectId);
    }
  };

  return (
    <>
      <Paper elevation={3} style={{ borderRadius: '8px', marginBottom: '20px' }}>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Project Name</StyledTableCell>
                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Project Manager</StyledTableCell>
                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Start Date</StyledTableCell>
                <StyledTableCell style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingProjects.length > 0 ? (
                pendingProjects.map((project) => (
                  <StyledTableRow key={project._id}>
                    <StyledTableCell>{project.projectName}</StyledTableCell>
                    <StyledTableCell>{project.projectManager}</StyledTableCell>
                    <StyledTableCell>
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button 
                        component={Link}
                        to={`/description/${project._id}`}
                        variant="outlined"
                        color="primary"
                        style={{ marginRight: '8px', borderRadius: '20px' }}
                        aria-label={`View details for ${project.projectName}`}
                      >
                        View
                      </Button>
                      <Button 
                        onClick={() => handleApprove(project._id)} 
                        variant="contained" 
                        color="primary" 
                        style={{ marginRight: '8px', borderRadius: '20px' }}
                        aria-label={`Approve ${project.projectName}`}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'Approve'}
                      </Button>
                      <Button 
                        onClick={() => handleReject(project._id)} 
                        variant="contained" 
                        color="error"
                        style={{ borderRadius: '20px' }}
                        aria-label={`Reject ${project.projectName}`}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'Reject'}
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={4} style={{ textAlign: 'center' }}>
                    No projects available for approval.
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </>
  );
};

export default ProjectApprovalTable;
