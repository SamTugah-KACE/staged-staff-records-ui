import React from 'react';
import { Table, Tag } from 'antd';
import './SalaryPayment.css';

const SalaryPaymentTable = ({ data }) => {
    const columns = [
        // {
        //     title: 'Employee ID',
        //     dataIndex: 'employee_id',
        //     key: 'employee_id',
        // },
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            render: (rank) => rank?.name || 'N/A',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount, record) => (
                <span>
                    {record.currency} {amount.toFixed(2)}
                </span>
            ),
        },
        {
            title: 'Payment Date',
            dataIndex: 'payment_date',
            key: 'payment_date',
            render: (text) => text && new Date(text).toLocaleString(),
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
        },
        {
            title: 'Transaction ID',
            dataIndex: 'transaction_id',
            key: 'transaction_id',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = '';
                const statusLower = status.toLowerCase();

                if (statusLower === 'success') {
                    color = 'green';
                } else if (statusLower === 'pending') {
                    color = 'gold';
                } else if (statusLower === 'failed') {
                    color = 'red';
                }
                return (
                    <Tag color={color} key={status}>
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: 'Approved By',
            dataIndex: 'approver',
            key: 'approved_by',
            render: (approver) => approver?.name || 'N/A',
        },
    ];

    return (
        <div className="custom-table-container">
            <Table dataSource={data} columns={columns} rowKey="id" className="custom-table"/>
        </div>
    );
};

export default SalaryPaymentTable;