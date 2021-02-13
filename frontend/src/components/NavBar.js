import { Menu } from 'antd';
import { TableOutlined, BarChartOutlined, HeatMapOutlined,GithubOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'


function NavBar() {
    const [activeTab, setActiveTab] = useState('chart')
    return (
        <Menu onClick={(e) => setActiveTab(e.target)} selectedKeys={[activeTab]} mode="horizontal">
            <Menu.Item key="tab1" icon={<BarChartOutlined />}>
                <Link to='/chart'>Chart visualizations</Link>
            </Menu.Item>
            <Menu.Item key="table" icon={<TableOutlined />}>
                <Link to='/table'>Data Table</Link>
            </Menu.Item>
            <Menu.Item key="map" icon={<HeatMapOutlined />}>
                <Link to='/map'>Map</Link>
            </Menu.Item>

            <Menu.Item style={{ float: 'right' }} icon={<GithubOutlined />}>
                <a target='_blank' href='https://github.com/JANICECY/ws-product-python' rel="noreferrer">Designed by <b>Ying Chen</b></a>
            </Menu.Item>

        </Menu>
    );
}


export default NavBar 