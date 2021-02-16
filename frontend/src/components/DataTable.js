import React, { useMemo, useState } from 'react'
import { Table, Input, Button, Space, Card, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { formatNum } from '../helper'
import { useSelector } from 'react-redux'


const { Title } = Typography


function DataTable() {
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchColumn] = useState('')
    const { POIs, dailyStats, hourlyStats } = useSelector(state => state)

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

    const POIsTable = useMemo(() => {
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


        return (
            <Table columns={columns} dataSource={POIs} />
        )
    }, [POIs])


    const StatsTable = useMemo(() => {

        const [cols, subCols] = (() => {
            const commonCols = [
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

            const cols = [
                {
                    title: 'Date',
                    dataIndex: 'date',
                    key: 'date',
                    width: '25%',
                    sorter: (a, b) => new Date(a.date) - new Date(b.date),
                    render: date => new Date(date).toLocaleDateString(),
                },
                ...commonCols
            ]


            const subCols = [
                {
                    title: 'Hour',
                    dataIndex: 'hour',
                    key: 'hour',
                    width: '25%',
                    sorter: (a, b) => a.hour - b.hour,
                    render: hour => `${hour}:00`
                },
                ...commonCols
            ]

            return [cols, subCols]
        })();


        return (
            <Table
                columns={cols}
                dataSource={dailyStats.map((item, index) => Object.assign(item, { key: index }))}
                expandable={{
                    expandedRowRender: ({ date }) => (
                        <Table
                            columns={subCols}
                            dataSource={hourlyStats.filter(i => i.date === date)}
                        />
                    ),
                    rowExpandable: record => record.date !== 'Not Expandable',
                }}

            />
        )
    }, [hourlyStats, dailyStats])


    return (
        <div className='main-container'>
            <Card hoverable style={{ marginBottom: 20 }}>
                <Title level={3}>Daily Events</Title> 
                {StatsTable}
                <b>Click plus icon to expend 😀</b>
            </Card>
            <Card hoverable >
            <Title level={3}>Point of Interests</Title> 
                {POIsTable}
            </Card>

        </div>

    )
}

export default DataTable