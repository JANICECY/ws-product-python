import React, { useState } from 'react'
import { PIOs, dailyStats, hourlyStats } from './dummyData'
import { Table, Input, Button, Space, Card, Collapse } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { formatNum } from '../helper'


function DataTable() {
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchColumn] = useState('')
    let searchInput;

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchColumn(dataIndex)
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('')
    };



    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
              </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0])
                            setSearchColumn(dataIndex)
                        }}
                    >
                        Filter
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                    text
                ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Latitude',
            dataIndex: 'lat',
            key: 'lat',
            width: '30%',
            sorter: (a, b) => a.lat - b.lat,
        },
        {
            title: 'Longitude',
            dataIndex: 'lon',
            key: 'lon',
            width: '30%',
            sorter: (a, b) => a.lon - b.lon,
        },


    ]

    const getStatsTable = () => {
        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: '25%',
                sorter: (a, b) => new Date(a.date) - new Date(b.date),
                render: date => new Date(date).toLocaleDateString(),
            },
            {
                title: 'Clicks',
                dataIndex: 'clicks',
                key: 'clicks',
                width: '25%',
                sorter: (a, b) => a.clicks - b.clicks,
                render: value => formatNum(value)
            },
            {
                title: 'Impressions',
                dataIndex: 'impressions',
                key: 'impressions',
                width: '25%',
                sorter: (a, b) => a.impressions - b.impressions,
                render: impressions => formatNum(impressions)
            },
            {
                title: 'Revenue',
                dataIndex: 'revenue',
                key: 'revenue',
                width: '25%',
                sorter: (a, b) => a.revenue - b.revenue,
                render: revenue => "$" + formatNum(revenue)
            }
        ]

        const subColumns = [
            {
                title: 'Hour',
                dataIndex: 'hour',
                key: 'hour',
                width: '25%',
                sorter: (a, b) => a.hour - b.hour,
                render: hour => `${hour}:00`
            },
            {
                title: 'Clicks',
                dataIndex: 'clicks',
                key: 'clicks',
                width: '25%',
                sorter: (a, b) => a.clicks - b.clicks,
                render: value => formatNum(value)
            },
            {
                title: 'Impressions',
                dataIndex: 'impressions',
                key: 'impressions',
                width: '25%',
                sorter: (a, b) => a.impressions - b.impressions,
                render: value => formatNum(value)
            },
            {
                title: 'Revenue',
                dataIndex: 'revenue',
                key: 'revenue',
                width: '25%',
                sorter: (a, b) => a.revenue - b.revenue,
                render: revenue => "$" + formatNum(revenue)
            }
        ]


        return (
            <Table
                columns={columns}
                dataSource={dailyStats.map((item, index) => Object.assign(item, { key: index }))}
                expandable={{
                    expandedRowRender: ({ date }) => (
                        <Table
                            columns={subColumns}
                            dataSource={hourlyStats.filter(i => i.date === date)}
                        />
                    ),
                    rowExpandable: record => record.date !== 'Not Expandable',
                }}

            />
        )
    }
    return (
        <div className='main-container'>
            <Card hoverable style={{ marginBottom: 20 }}>
                <p><b>Click plus icon to expend 😎</b></p>
                {getStatsTable()}
            </Card>
            <Card hoverable >
                <Table columns={columns} dataSource={PIOs} />
            </Card>

        </div>

    )
}

export default DataTable