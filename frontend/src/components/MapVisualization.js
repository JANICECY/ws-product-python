import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { useSelector } from 'react-redux'
import { FlagTwoTone } from '@ant-design/icons';
import { Popover, List } from 'antd';
import CN_tower from '../static/CN_tower.jpg'
import EQ_works from '../static/EQ_works.jpeg'
import niagara_falls from '../static/niagara_falls.jpg'
import vancouver_harbour from '../static/vancouver_harbour.jpg'
import { debounce } from 'lodash'
import { formatNum } from '../helper'
const NAME_TO_IMAGE = {
    'EQ Works': EQ_works,
    'CN Tower': CN_tower,
    'Niagara Falls': niagara_falls,
    'Vancouver Harbour': vancouver_harbour
}

function MapVisualization() {
    const { POIs, dailyStats } = useSelector(state => state)
    const [hoveredItemName, setHoveredItemName] = useState('')


    const center = {
        lat: 56.1304,
        lng: -106.3468
    }


    const handleMouseOver = debounce((e, id) => {
        e.preventDefault()
        e.stopPropagation()
        setHoveredItemName(id)
    }, 200)


    const handleMouseLeave = debounce((e) => {
        e.preventDefault()
        e.stopPropagation()
        setHoveredItemName('')
    }, 200)

    const LocationTable = () => {
        return (
            <div className='location-table'>
                <List
                    itemLayout="horizontal"
                    dataSource={POIs}
                    renderItem={item => (
                        <List.Item
                            className='location-item'
                            onMouseEnter={(e) => handleMouseOver(e, item.name)}
                            onMouseLeave={handleMouseLeave}
                            onmouse
                        >
                            <List.Item.Meta
                                title={<span>{item.name}</span>}
                                description={
                                    <p>
                                        <span>Latitude: {item.lat}</span><br />
                                        <span>Longitute: {item.lon}</span>
                                    </p>
                                }
                            />
                            <img src={NAME_TO_IMAGE[item.name]} style={{ width: 100 }} />
                        </List.Item>
                    )}
                />
            </div>
        )
    }


    const LocationMarker = ({ name }) => {
        return (
            <div className='location-marker'>
                <Popover
                    content={
                        <p>
                            {
                                dailyStats.slice(0, 3).map(({ date, clicks, impressions, revenue }) => <p>
                                    <div><b>{new Date(date).toLocaleDateString()}</b></div>
                                    <div><b>Clicks:</b> {formatNum(clicks)}</div>
                                    <div><b>Impressions:</b> {formatNum(impressions)}</div>
                                    <div><b>Revenue:</b> {formatNum(revenue)}</div>
                                </p>)
                            }
                        </p>
                    }
                    title={name}
                    visible={name === hoveredItemName ? true : false}
                    onMouseEnter={(e) => handleMouseOver(e, name)}
                    onMouseLeave={handleMouseLeave}
                >
                    <FlagTwoTone style={{ fontSize: 30, color: 'red' }} />
                </Popover>
                <h3>{name}</h3>
            </div>
        )
    }


    return (
        <div className='d-flex'>
            {/* Important! Always set the container height explicitly */}
            <div style={{ height: '100vh', width: '70%' }} >
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'Put your own API key here' }}
                    defaultCenter={center}
                    defaultZoom={5}
                >
                    {
                        POIs.map(
                            ({ lat, lon, name }) => <LocationMarker lat={lat} lng={lon} name={name} />
                        )
                    }
                </GoogleMapReact>
            </div>
            <LocationTable />
        </div>
    );
}

export default MapVisualization;