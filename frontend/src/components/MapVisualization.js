import React, { useState } from 'react'
import { PIOs, dailyStats, hourlyStats } from './dummyData'
import { Table, Input, Button, Space, Card, Collapse } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { formatNum } from '../helper'
import { geoCentroid } from "d3-geo";
import allStates from '../Canada_states.json'

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from "react-simple-maps";
const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";


const markers = PIOs.map(({ name, lat, lon }) => (
    {
        markerOffset: -15,
        name,
        coordinates: [lon, lat]
    }
))

export default function MapVisualization() {
    return (
        <div>
            <ComposableMap
                projection="geoAlbersUsa"
            // projectionConfig={{
            //     rotate: [58, 20, 0],
            //     scale: 400
            // }}
            >
                <ZoomableGroup zoom={1}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) => (
                            <>
                                {
                                    geographies
                                        .filter(d => d.properties.REGION_UN === "Americas")
                                        .map(geo => (
                                            <Geography
                                                key={geo.rsmKey}
                                                geography={geo}
                                                fill="#EAEAEC"
                                                stroke="#D6D6DA"
                                            />
                                        ))
                                }
                                {/* {geographies.map(geo => {
                                    const centroid = geoCentroid(geo);
                                    const cur = allStates.find(s => s.val === geo.id);
                                    return (
                                        <g key={geo.rsmKey + "-name"}>
                                            {cur &&
                                                centroid[0] > -160 &&
                                                centroid[0] < -67 &&
                                                <Marker coordinates={centroid}>
                                                    <text y="2" fontSize={14} textAnchor="middle">
                                                        {cur.id}
                                                    </text>
                                                </Marker>
                                            }
                                        </g>
                                    );
                                })} */}
                            </>
                        )

                        }
                    </Geographies>

                    {markers.map(({ name, coordinates, markerOffset }) => (
                        <Marker key={name} coordinates={coordinates}>
                            <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
                            <text
                                textAnchor="middle"
                                y={markerOffset}
                                style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
                            >
                                {name}
                            </text>
                        </Marker>
                    ))}
                </ZoomableGroup>
            </ComposableMap>
        </div>
    )
}