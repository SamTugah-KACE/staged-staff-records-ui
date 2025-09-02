// src/components/DepartmentRow.js
import React, { useEffect, useState } from 'react';
import request from '../request';

const DepartmentRow = ({ department, organizationId, isBranchManaged }) => {
  const [hodName, setHodName] = useState('N/A');
  const [branchName, setBranchName] = useState('N/A');

  // Fetch Head of Department details using department_head_id
  useEffect(() => {
    const fetchHOD = async () => {
      if (department.department_head_id) {
        try {
          const response = await request.get(
            `/organizations/${organizationId}/departments/${department.id}/head`
          );
          const emp = response.data;
          // Format the full name: include middle name only if non-empty.
          // const fullName = `${emp.title} ${emp.first_name}${emp.middle_name ? ' ' + emp.middle_name : ''} ${emp.last_name}`;
          // setHodName(fullName);
          // Build the full name
        const parts = [emp.title, emp.first_name];
        if (emp.middle_name) parts.push(emp.middle_name);
        parts.push(emp.last_name);
        setHodName(parts.join(' '));
        } catch (error) {
          console.error("Error fetching HoD details:", error);
        }
      }else{
        return;
      }
    };
    fetchHOD();
  }, [department, organizationId]);

  // If the organization is branch-managed and the department has a branch_id,
  // fetch the branch details.
  useEffect(() => {
    const fetchBranch = async () => {
      if (isBranchManaged && department.branch_id) {
        try {
          const response = await request.get(
            `/organizations/${organizationId}/branches/${department.branch_id}`
          );
          setBranchName(response.data.name);
        } catch (error) {
          console.error("Error fetching branch details:", error);
        }
      }
    };
    fetchBranch();
  }, [department.branch_id, organizationId, isBranchManaged]);

  return (
    <tr>
      <td>{department.name}</td>
      <td>{hodName}</td>
      {isBranchManaged && <td>{branchName}</td>}
    </tr>
  );
};

export default DepartmentRow;
