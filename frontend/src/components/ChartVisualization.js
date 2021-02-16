import { Select, Card, Typography } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coordinate,
    Label,
    Legend,
    Interval,
    Line,
    Point,
} from "bizcharts";
import { formatNum } from '../helper'
import { useSelector } from 'react-redux'
import DataSet from "@antv/data-set";


const { Title } = Typography;


function ChartVisualization(props) {

    // fetch data from redux store 
    const { hourlyEvents, hourlyStats, dailyEvents, dailyStats, fetchDataFailed } = useSelector(state => state)

    // an array of unique dates that user can select for viewing hourly Events 
    const eventsOptions = useMemo(() => {
        return [...new Set(hourlyEvents.map(i => i.date))]
    }, [hourlyEvents])

    // console.log(eventsOptions);
    // an array of unique dates that user can select for viewing hourly stats 
    const statsOptions = useMemo(() => {
        return [...new Set(hourlyStats.map(i => i.date))]
    }, [hourlyStats])

    useEffect(() => {
        setEventsSelectedDate(eventsOptions[0])
    }, [hourlyEvents])


    useEffect(() => {
        setSelectedStatsDate(statsOptions[0])
    }, [hourlyStats])

    // currently selected option 
    const [selectedEventsDate, setEventsSelectedDate] = useState([])
    const [selectedStatsDate, setSelectedStatsDate] = useState([])


    const HourlyEventsChart = useMemo(() => {
        const data = hourlyEvents.filter(i => i.date === selectedEventsDate)
        return (
            <Chart
                padding={[10, 20, 50, 50]}
                autoFit
                height={400}
                data={data}
                scale={{ tickCount: 12 }}
            >
                <Line position="hour*events" tooltip={['hour*events', (hour, events) => {
                    return {
                        title: `${hour}:00`,
                        name: 'value',
                        value: events
                    }
                }]} />
                <Point position="hour*events" />
                <Tooltip showCrosshairs lock />
                <Axis name='events' title={{
                    position: 'center',
                    style: {
                        fontSize: '12'
                    }
                }} />
                <Axis name='hour' label={{ formatter: (text) => `${text}:00` }} />
            </Chart>
        )
    }, [hourlyEvents, selectedEventsDate])



    const DailyStatsChart = useMemo(() => {
        const ds = new DataSet();
        const dv = ds.createView().source(dailyStats);
        dv.transform({
            type: "fold",
            fields: ["clicks", "revenue", 'impressions'],
            // 展开字段集
            key: "type",
            // key字段
            value: "value" // value字段
        });

        const scale = {
            value: {
                type: "log",
                base: 10,
            },
        };
        return (
            <Chart height={350} data={dv.rows} autoFit scale={scale}>
                <Legend />
                <Coordinate actions={[['scale', 1, -1], ['transpose']]} />
                <Axis name="value" position={"right"} />
                <Axis name='date' label={{ formatter: (text) => `${new Date(text).toLocaleDateString()}` }} />
                <Tooltip />
                <Interval
                    position="date*value"
                    color={"type"}
                    adjust={[
                        {
                            type: "dodge",
                            marginRatio: 1 / 32
                        }
                    ]}
                />
            </Chart>
        );
    }, [dailyStats])

    const HourlyStatsChart = useMemo(() => {

        // filter stats that only match the selected date 
        const data = hourlyStats.filter(i => i.date === selectedStatsDate)

        let chartIns = null;
        const colors = ["#6394f9", "#62daaa", '#637597'];

        return (
            <Chart
                autoFit
                height={400}
                data={data}
                onGetG2Instance={(chart) => {
                    chartIns = chart;
                }}
            >
                <Axis name="hour" label={{ formatter: (text) => `${text}:00` }} />
                <Legend
                    custom={true}
                    allowAllCanceled={true}
                    items={[
                        {
                            value: "clicks",
                            name: "Clicks",
                            marker: {
                                symbol: "circle",
                                style: { fill: colors[0], r: 5 },
                            },
                        },
                        {
                            value: "revenue",
                            name: "Revenue",
                            marker: {
                                symbol: "square",
                                style: { fill: colors[0], r: 5 },
                            },
                        },
                        {
                            value: "impressions",
                            name: "Impressions",
                            marker: {
                                symbol: "hyphen",
                                style: { stroke: colors[2], r: 5, lineWidth: 3 },
                            },
                        },
                    ]}
                    onChange={(ev) => {
                        console.log("ev", ev);
                        const item = ev.item;
                        const value = item.value;
                        const checked = !item.unchecked;
                        const geoms = chartIns.geometries;

                        for (let i = 0; i < geoms.length; i++) {
                            const geom = geoms[i];

                            if (geom.getYScale().field === value) {
                                if (checked) {
                                    geom.show();
                                } else {
                                    geom.hide();
                                }
                            }
                        }
                    }}
                />
                <Tooltip shared showCrosshairs />
                <Line
                    position="hour*clicks"
                    color={colors[0]}
                    tooltip={['hour*clicks', (hour, clicks) => {
                        return {
                            title: `${hour}:00`,
                            name: 'Clicks',
                            value: formatNum(clicks)
                        }
                    }]}
                />
                <Point
                    position="hour*clicks"
                    color={colors[0]}
                    size={3}
                    shape="circle"
                    tooltip={false}
                />
                <Line
                    position="hour*revenue"
                    color={colors[1]}
                    size={3}
                    shape="smooth"
                    tooltip={['hour*revenue', (hour, revenue) => {
                        return {
                            title: `${hour}:00`,
                            name: 'Revenue',
                            value: formatNum(revenue)
                        }
                    }]}
                />
                <Point
                    position="hour*revenue"
                    color={colors[1]}
                    size={3}
                    shape="circle"
                    tooltip={false}
                />

                <Line
                    position="hour*impressions"
                    color={colors[2]}
                    size={3}
                    shape="smooth"
                    tooltip={['hour*impressions', (hour, impressions) => {
                        return {
                            title: `${hour}:00`,
                            name: 'Impressions',
                            value: formatNum(impressions)
                        }
                    }]}
                />
                <Point
                    position="hour*impressions"
                    color={colors[2]}
                    size={3}
                    shape="circle"
                    tooltip={false}
                />
            </Chart>
        );
    }, [selectedStatsDate, hourlyStats])

    const DailyEventsCHart = useMemo(() => {
        const convertedData = dailyEvents.map(({ date, events }) => (
            {
                // format date dd/mm/yyyy
                date: new Date(date).toLocaleDateString(),
                events
            }
        ))
        return (
            <Chart height={300} autoFit data={convertedData} interactions={['active-region']}>
                <Interval position="date*events" />
                <Tooltip shared />
            </Chart>
        )
    }, [dailyEvents])

    return (
        <div className='main-container'>
            <div className='chart-container'>

                {/* Charts for events */}
                <Card hoverable className='events-container'>

                    {/* Daily Events */}
                    <div className='daily-events-container'>
                        <Title level={3}>Daily Events</Title><br />
                        {DailyEventsCHart}<br />
                    </div>


                    {/* Hourly Events  */}
                    <div className='hourly-events-container' style={{ marginBottom: 20 }}>
                        <Title level={3}>Hourly Events</Title>
                        <Select
                            style={{ marginBottom: 20, float: 'right', zIndex: 1 }}
                            onChange={(val) => setEventsSelectedDate(val)}
                            value={selectedEventsDate}
                            options={eventsOptions.map(d => (
                                {
                                    label: new Date(d).toLocaleDateString(),
                                    value: d
                                })
                            )}
                        >
                        </Select>
                        {HourlyEventsChart}
                    </div>
                </Card>

                <Card hoverable className='stats-container'>

                    <div>
                        <Title level={3}>Daily Stats</Title>
                        {DailyStatsChart}
                    </div>

                    <div className='hourly-stats-container'>
                        <Title level={3}>Hourly Stats</Title>
                        <Select
                            style={{ marginBottom: 20, float: 'right', zIndex: 1 }}
                            onChange={(val) => setSelectedStatsDate(val)}
                            value={selectedEventsDate}
                            options={statsOptions.map(d => (
                                {
                                    label: new Date(d).toLocaleDateString(),
                                    value: d
                                })
                            )}
                        >
                        </Select>
                        {HourlyStatsChart}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default ChartVisualization