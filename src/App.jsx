import { useMemo, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { MapContainer, Polyline, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'

const cityProfiles = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    country: 'India',
    center: [12.9716, 77.5946],
    rainfallData: [
      { time: '00:00', rainfall: 9 },
      { time: '03:00', rainfall: 14 },
      { time: '06:00', rainfall: 22 },
      { time: '09:00', rainfall: 28 },
      { time: '12:00', rainfall: 18 },
      { time: '15:00', rainfall: 12 },
      { time: '18:00', rainfall: 25 },
      { time: '21:00', rainfall: 16 },
    ],
    incidents: [
      {
        id: 'INC-2048',
        title: 'Outer Ring Road near Bellandur',
        description: 'Waterlogging causing slow traffic and knee-deep water at the service road.',
        severity: 'High',
        status: 'Active',
        verification: 'Verified',
        lat: 12.9249,
        lng: 77.6755,
        timestamp: '2026-10-26T07:30:00Z',
        roadName: 'Outer Ring Road',
        reporter: 'Citizen report',
      },
      {
        id: 'INC-2041',
        title: 'Town Hall junction',
        description: 'Road surface submerged after a brief but intense downpour.',
        severity: 'Moderate',
        status: 'Monitoring',
        verification: 'Pending',
        lat: 12.9738,
        lng: 77.606,
        timestamp: '2026-10-26T06:20:00Z',
        roadName: 'MG Road',
        reporter: 'Resident',
      },
      {
        id: 'INC-2030',
        title: 'Whitefield main road',
        description: 'Repeated puddling near the underpass after storms.',
        severity: 'Critical',
        status: 'Active',
        verification: 'Verified',
        lat: 12.9682,
        lng: 77.7496,
        timestamp: '2026-10-25T21:00:00Z',
        roadName: 'ITPL Main Road',
        reporter: 'Commuter',
      },
      {
        id: 'INC-2026',
        title: 'JP Nagar 4th Phase',
        description: 'Low-lying neighborhood road remains blocked after repeated showers.',
        severity: 'Low',
        status: 'Resolved',
        verification: 'Verified',
        lat: 12.9089,
        lng: 77.5816,
        timestamp: '2026-10-24T18:10:00Z',
        roadName: '17th Cross',
        reporter: 'Resident',
      },
    ],
    hotspots: [
      {
        id: 'A1',
        name: 'Bellandur Lake corridor',
        risk: 82,
        category: 'High',
        latestUpdate: '2026-10-26 07:45',
        factors: [
          'Recent rainfall 28 mm in last 3 hours',
          'Repeated verified incidents in the last 14 days',
          'Low-lying topography and drainage bottleneck',
        ],
        lat: 12.9302,
        lng: 77.6691,
      },
      {
        id: 'A2',
        name: 'Koramangala 8th Block',
        risk: 74,
        category: 'Moderate',
        latestUpdate: '2026-10-26 07:10',
        factors: [
          'Moderate rainfall and local runoff convergence',
          'Historical hotspot with recurring slow drainage',
          'Mixed terrain with limited roadside channelling',
        ],
        lat: 12.9351,
        lng: 77.6229,
      },
      {
        id: 'A3',
        name: 'Yelahanka arterial roads',
        risk: 61,
        category: 'Moderate',
        latestUpdate: '2026-10-26 06:55',
        factors: [
          'Recent storm activity and moderate urban runoff',
          'One verified report still under review',
          'Insufficient drainage detail for a precise score',
        ],
        lat: 13.1005,
        lng: 77.5901,
      },
    ],
    routeAlternatives: [
      {
        id: 'route-1',
        label: 'Safer route via elevated roads',
        distance: '12.8 km',
        time: '26 min',
        hazards: 1,
        avoidance: 'Avoids Bellandur service road where flooding is active.',
        score: 81,
        path: [
          [12.9716, 77.5946],
          [12.9554, 77.6201],
          [12.9428, 77.6448],
          [12.9311, 77.664],
          [12.9204, 77.6802],
        ],
      },
      {
        id: 'route-2',
        label: 'Shorter but riskier corridor',
        distance: '11.2 km',
        time: '24 min',
        hazards: 3,
        avoidance: 'Crosses known delay zones around Whitefield and Marathahalli.',
        score: 58,
        path: [
          [12.9716, 77.5946],
          [12.9751, 77.6477],
          [12.9712, 77.6995],
          [12.9682, 77.7496],
        ],
      },
    ],
    locations: ['Indiranagar', 'Koramangala', 'Whitefield', 'Yelahanka'],
    adminTrendData: [
      { label: 'May', total: 18 },
      { label: 'Jun', total: 29 },
      { label: 'Jul', total: 42 },
      { label: 'Aug', total: 36 },
      { label: 'Sep', total: 58 },
      { label: 'Oct', total: 62 },
    ],
    adminSeverityData: [
      { name: 'Low', value: 18 },
      { name: 'Moderate', value: 28 },
      { name: 'High', value: 24 },
      { name: 'Critical', value: 12 },
    ],
  },
  {
    id: 'new-york',
    name: 'New York City',
    country: 'United States',
    center: [40.7128, -74.006],
    rainfallData: [
      { time: '00:00', rainfall: 11 },
      { time: '03:00', rainfall: 18 },
      { time: '06:00', rainfall: 26 },
      { time: '09:00', rainfall: 24 },
      { time: '12:00', rainfall: 16 },
      { time: '15:00', rainfall: 20 },
      { time: '18:00', rainfall: 30 },
      { time: '21:00', rainfall: 19 },
    ],
    incidents: [
      { id: 'NY-11', title: 'Harlem underpass', severity: 'High', status: 'Active', verification: 'Verified', lat: 40.8116, lng: -73.9465, timestamp: '2026-10-26T08:15:00Z', roadName: 'Lenox Avenue', reporter: 'Commuter' },
      { id: 'NY-08', title: 'Queensboro tunnel approach', severity: 'Moderate', status: 'Monitoring', verification: 'Pending', lat: 40.7424, lng: -73.9514, timestamp: '2026-10-26T05:40:00Z', roadName: 'Queensboro Bridge', reporter: 'Driver' },
      { id: 'NY-05', title: 'Brooklyn coastal road', severity: 'Critical', status: 'Active', verification: 'Verified', lat: 40.7049, lng: -73.9867, timestamp: '2026-10-25T20:00:00Z', roadName: 'Atlantic Avenue', reporter: 'Resident' },
    ],
    hotspots: [
      { id: 'NY-1', name: 'Lower Manhattan drainage zone', risk: 79, category: 'High', latestUpdate: '2026-10-26 08:40', factors: ['Heavy downpour and runoff concentration', 'Frequent stormwater backups', 'Low-lying corridor near tunnels'], lat: 40.7128, lng: -74.006 },
      { id: 'NY-2', name: 'Bronx river neighborhood', risk: 68, category: 'Moderate', latestUpdate: '2026-10-26 07:55', factors: ['Rainfall intensity elevated', 'Urban drainage spillover', 'Historic repeat water pooling'], lat: 40.8448, lng: -73.8648 },
    ],
    routeAlternatives: [
      { id: 'ny-route-1', label: 'Uptown elevated bypass', distance: '18.4 km', time: '31 min', hazards: 1, avoidance: 'Avoids the flood-prone tunnel approach near Harlem.', score: 85, path: [[40.720, -74.001], [40.742, -73.985], [40.780, -73.952], [40.812, -73.946]] },
      { id: 'ny-route-2', label: 'Direct express route', distance: '15.9 km', time: '28 min', hazards: 3, avoidance: 'Crosses a stormwater-prone corridor by the East River.', score: 61, path: [[40.720, -74.001], [40.730, -73.973], [40.760, -73.960], [40.805, -73.930]] },
    ],
    locations: ['Downtown', 'Harlem', 'Queens', 'Brooklyn'],
    adminTrendData: [
      { label: 'May', total: 24 },
      { label: 'Jun', total: 34 },
      { label: 'Jul', total: 42 },
      { label: 'Aug', total: 48 },
      { label: 'Sep', total: 51 },
      { label: 'Oct', total: 57 },
    ],
    adminSeverityData: [
      { name: 'Low', value: 16 },
      { name: 'Moderate', value: 27 },
      { name: 'High', value: 30 },
      { name: 'Critical', value: 9 },
    ],
  },
  {
    id: 'dhaka',
    name: 'Dhaka',
    country: 'Bangladesh',
    center: [23.8103, 90.4125],
    rainfallData: [
      { time: '00:00', rainfall: 15 },
      { time: '03:00', rainfall: 20 },
      { time: '06:00', rainfall: 34 },
      { time: '09:00', rainfall: 41 },
      { time: '12:00', rainfall: 28 },
      { time: '15:00', rainfall: 22 },
      { time: '18:00', rainfall: 35 },
      { time: '21:00', rainfall: 25 },
    ],
    incidents: [
      { id: 'DK-20', title: 'Motijheel road collapse', severity: 'Critical', status: 'Active', verification: 'Verified', lat: 23.725, lng: 90.412, timestamp: '2026-10-26T07:05:00Z', roadName: 'Motijheel', reporter: 'Citizen' },
      { id: 'DK-18', title: 'Rampura canal crossing', severity: 'High', status: 'Monitoring', verification: 'Pending', lat: 23.7539, lng: 90.4213, timestamp: '2026-10-26T06:15:00Z', roadName: 'Rampura Road', reporter: 'Resident' },
      { id: 'DK-14', title: 'Dhanmondi lane flooding', severity: 'Moderate', status: 'Resolved', verification: 'Verified', lat: 23.7464, lng: 90.3778, timestamp: '2026-10-24T19:00:00Z', roadName: 'Dhanmondi', reporter: 'Community group' },
    ],
    hotspots: [
      { id: 'DK-1', name: 'Motijheel urban basin', risk: 88, category: 'High', latestUpdate: '2026-10-26 07:45', factors: ['Intense monsoon rainfall', 'Drainage under-capacity', 'Repeated flood-prone commerce district'], lat: 23.725, lng: 90.412 },
      { id: 'DK-2', name: 'Badda low-lying block', risk: 72, category: 'Moderate', latestUpdate: '2026-10-26 07:20', factors: ['Runoff and blocked channel', 'Repeated standing water', 'Low elevation terrain'], lat: 23.7645, lng: 90.4257 },
    ],
    routeAlternatives: [
      { id: 'dk-route-1', label: 'Raised arterial bypass', distance: '16.2 km', time: '30 min', hazards: 1, avoidance: 'Avoids the flood-prone central business district.', score: 84, path: [[23.8103, 90.4125], [23.785, 90.401], [23.760, 90.389], [23.742, 90.387]] },
      { id: 'dk-route-2', label: 'Short loop through congested streets', distance: '13.1 km', time: '26 min', hazards: 4, avoidance: 'Uses multiple low points and canal-adjacent roads.', score: 56, path: [[23.8103, 90.4125], [23.788, 90.420], [23.770, 90.435], [23.752, 90.452]] },
    ],
    locations: ['Motijheel', 'Dhanmondi', 'Rampura', 'Badda'],
    adminTrendData: [
      { label: 'May', total: 21 },
      { label: 'Jun', total: 33 },
      { label: 'Jul', total: 46 },
      { label: 'Aug', total: 58 },
      { label: 'Sep', total: 63 },
      { label: 'Oct', total: 71 },
    ],
    adminSeverityData: [
      { name: 'Low', value: 12 },
      { name: 'Moderate', value: 30 },
      { name: 'High', value: 26 },
      { name: 'Critical', value: 16 },
    ],
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    center: [51.5074, -0.1278],
    rainfallData: [
      { time: '00:00', rainfall: 8 },
      { time: '03:00', rainfall: 12 },
      { time: '06:00', rainfall: 19 },
      { time: '09:00', rainfall: 27 },
      { time: '12:00', rainfall: 24 },
      { time: '15:00', rainfall: 17 },
      { time: '18:00', rainfall: 21 },
      { time: '21:00', rainfall: 14 },
    ],
    incidents: [
      { id: 'LD-12', title: 'Southwark river crossing', severity: 'Moderate', status: 'Monitoring', verification: 'Verified', lat: 51.5036, lng: -0.0905, timestamp: '2026-10-26T09:10:00Z', roadName: 'Southwark Street', reporter: 'Cyclist' },
      { id: 'LD-09', title: 'Chelsea embankment', severity: 'High', status: 'Active', verification: 'Pending', lat: 51.487, lng: -0.1683, timestamp: '2026-10-26T07:55:00Z', roadName: 'Chelsea Embankment', reporter: 'Resident' },
      { id: 'LD-03', title: 'Bermondsey arterial road', severity: 'Low', status: 'Resolved', verification: 'Verified', lat: 51.498, lng: -0.066, timestamp: '2026-10-25T18:05:00Z', roadName: 'Bermondsey Street', reporter: 'Bus operator' },
    ],
    hotspots: [
      { id: 'LD-1', name: 'South Bank drainage lowland', risk: 71, category: 'Moderate', latestUpdate: '2026-10-26 09:20', factors: ['Urban runoff on river-adjacent roads', 'Recent heavy rainfall', 'Road level below nearby flood barriers'], lat: 51.5036, lng: -0.0905 },
      { id: 'LD-2', name: 'Westminster storm corridor', risk: 64, category: 'Moderate', latestUpdate: '2026-10-26 08:15', factors: ['Runoff from drainage network', 'Challenging flood baseline', 'Recurring shallow water events'], lat: 51.4993, lng: -0.1339 },
    ],
    routeAlternatives: [
      { id: 'ld-route-1', label: 'Flood-aware higher road', distance: '9.8 km', time: '19 min', hazards: 1, avoidance: 'Avoids the river-adjacent road that remains prone to pooling.', score: 79, path: [[51.5074, -0.1278], [51.504, -0.118], [51.502, -0.104], [51.499, -0.092]] },
      { id: 'ld-route-2', label: 'Direct but lower-lying route', distance: '8.7 km', time: '18 min', hazards: 2, avoidance: 'Rides closer to the flood-sensitive embankment and low tunnels.', score: 62, path: [[51.5074, -0.1278], [51.502, -0.120], [51.498, -0.110], [51.494, -0.099]] },
    ],
    locations: ['Westminster', 'Southwark', 'Chelsea', 'Bermondsey'],
    adminTrendData: [
      { label: 'May', total: 14 },
      { label: 'Jun', total: 17 },
      { label: 'Jul', total: 21 },
      { label: 'Aug', total: 24 },
      { label: 'Sep', total: 28 },
      { label: 'Oct', total: 31 },
    ],
    adminSeverityData: [
      { name: 'Low', value: 18 },
      { name: 'Moderate', value: 24 },
      { name: 'High', value: 21 },
      { name: 'Critical', value: 6 },
    ],
  },
]

const severityColors = {
  Low: '#22c55e',
  Moderate: '#fbbf24',
  High: '#f97316',
  Critical: '#ef4444',
}

const statusColors = {
  Active: '#ef4444',
  Monitoring: '#f59e0b',
  Resolved: '#10b981',
  Pending: '#94a3b8',
}

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

function getRiskScore(zone) {
  const rainfallWeight = zone.risk * 0.35
  const historyWeight = zone.risk * 0.3
  const reportWeight = zone.risk * 0.25
  const drainageWeight = zone.risk * 0.1
  return Math.min(100, Math.round(rainfallWeight + historyWeight + reportWeight + drainageWeight))
}

function getCityProfile(cityId) {
  return cityProfiles.find((city) => city.id === cityId) || cityProfiles[0]
}

function MapPanel({ city, selectedIncident = city.incidents[0], currentLocation = { lat: city.center[0], lng: city.center[1] } }) {
  return (
    <div className="map-shell">
      <MapContainer center={[currentLocation.lat, currentLocation.lng]} zoom={11} scrollWheelZoom className="map-view">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {city.incidents.map((incident) => (
          <CircleMarker
            key={incident.id}
            center={[incident.lat, incident.lng]}
            radius={selectedIncident.id === incident.id ? 18 : 12}
            pathOptions={{
              color: severityColors[incident.severity],
              fillColor: severityColors[incident.severity],
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <div className="popup-content">
                <strong>{incident.title}</strong>
                <span>{incident.severity}</span>
                <small>{formatDate(incident.timestamp)}</small>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {city.hotspots.map((zone) => (
          <CircleMarker
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={12}
            pathOptions={{
              color: zone.risk >= 75 ? '#ef4444' : '#f59e0b',
              fillColor: zone.risk >= 75 ? '#ef4444' : '#f59e0b',
              fillOpacity: 0.25,
              weight: 2,
            }}
          >
            <Popup>
              <div className="popup-content">
                <strong>{zone.name}</strong>
                <span>Risk score: {zone.risk}/100</span>
                <small>Updated {zone.latestUpdate}</small>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}

function MapClickHandler({ onClick }) {
  useMapEvents({
    click: (event) => onClick(event),
  })

  return null
}

function HomePage({ city, onChangeCity }) {
  const riskSummary = useMemo(
    () =>
      city.hotspots.map((zone) => ({
        ...zone,
        calculatedRisk: getRiskScore(zone),
      })),
    [city],
  )

  return (
    <div className="page-grid home-grid">
      <section className="panel hero-panel">
        <div>
          <p className="eyebrow">{city.country} flood monitoring</p>
          <h1>FloodWatch</h1>
          <p className="lead">
            Global waterlogging reporting, flood-risk assessment, and safer route guidance for citizens and administrators.
          </p>
        </div>
        <div className="hero-actions">
          <div className="city-select-wrap">
            <label>
              Region
              <select value={city.id} onChange={(event) => onChangeCity(event.target.value)}>
                {cityProfiles.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}, {option.country}</option>
                ))}
              </select>
            </label>
          </div>
          <NavLink to="/report" className="primary-btn">Report an incident</NavLink>
          <NavLink to="/risk" className="secondary-btn">View risk map</NavLink>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card danger">
          <span>Total incidents</span>
          <strong>{city.incidents.length + 42}</strong>
          <small>Across active monitoring zones</small>
        </div>
        <div className="stat-card">
          <span>Awaiting verification</span>
          <strong>{Math.max(3, city.incidents.filter((item) => item.verification === 'Pending').length + 2)}</strong>
          <small>Pending local review</small>
        </div>
        <div className="stat-card">
          <span>Verified active</span>
          <strong>{city.incidents.filter((item) => item.status === 'Active' && item.verification === 'Verified').length + 8}</strong>
          <small>{city.name} network</small>
        </div>
        <div className="stat-card warning">
          <span>High-risk areas</span>
          <strong>{city.hotspots.length + 2}</strong>
          <small>Preliminary threshold</small>
        </div>
      </section>

      <section className="panel map-panel">
        <div className="panel-header">
          <h2>{city.name} waterlogging map</h2>
          <span className="status-pill verified">Live incidents</span>
        </div>
        <MapPanel city={city} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Rainfall overview</h2>
          <span className="status-pill">Last 24 hrs</span>
        </div>
        <div className="chart-wrap medium-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={city.rainfallData}>
              <defs>
                <linearGradient id="rainfallFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="rainfall" stroke="#38bdf8" fill="url(#rainfallFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Risk hotspots</h2>
          <span className="status-pill warning">Experimental model</span>
        </div>
        <div className="risk-list">
          {riskSummary.map((zone) => (
            <div key={zone.id} className="risk-item">
              <div className="risk-head">
                <strong>{zone.name}</strong>
                <span>{zone.calculatedRisk}/100</span>
              </div>
              <div className="risk-meter">
                <span style={{ width: `${zone.calculatedRisk}%` }} />
              </div>
              <small>{zone.latestUpdate}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function ReportPage({ city, onChangeCity }) {
  const [formData, setFormData] = useState({
    title: 'Waterlogged underpass',
    description: 'Traffic moving slowly with standing water across both lanes.',
    lat: String(city.center[0]),
    lng: String(city.center[1]),
    severity: 'High',
    roadName: 'River Road',
  })
  const [duplicateMessage, setDuplicateMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleMapClick = (event) => {
    setFormData((current) => ({
      ...current,
      lat: event.latlng.lat.toFixed(5),
      lng: event.latlng.lng.toFixed(5),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const lat = Number(formData.lat)
    const lng = Number(formData.lng)
    const nearDuplicate = city.incidents.some(
      (incident) =>
        Math.abs(incident.lat - lat) < 0.02 &&
        Math.abs(incident.lng - lng) < 0.02 &&
        Date.now() - new Date(incident.timestamp).getTime() < 1000 * 60 * 60 * 72,
    )

    setDuplicateMessage(
      nearDuplicate
        ? 'Possible duplicate nearby report detected within the last 72 hours. It has been flagged for admin review.'
        : 'Report ready for verification. A new incident record has been created in prototype mode.',
    )
  }

  return (
    <div className="page-grid form-layout">
      <section className="panel form-panel">
        <div className="panel-header">
          <h2>Report local flooding</h2>
          <span className="status-pill">Citizen input</span>
        </div>

        <div className="city-select-wrap inline-select">
          <label>
            Reporting city
            <select value={city.id} onChange={(event) => onChangeCity(event.target.value)}>
              {cityProfiles.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <label>
            Incident title
            <input name="title" value={formData.title} onChange={handleChange} />
          </label>

          <label>
            Description
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />
          </label>

          <div className="two-col">
            <label>
              Latitude
              <input name="lat" value={formData.lat} onChange={handleChange} />
            </label>
            <label>
              Longitude
              <input name="lng" value={formData.lng} onChange={handleChange} />
            </label>
          </div>

          <div className="two-col">
            <label>
              Severity
              <select name="severity" value={formData.severity} onChange={handleChange}>
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </label>
            <label>
              Road name
              <input name="roadName" value={formData.roadName} onChange={handleChange} />
            </label>
          </div>

          <label>
            Upload photo
            <input type="file" accept="image/*" />
          </label>

          <button type="submit" className="primary-btn form-submit">Submit report</button>
          {duplicateMessage && <p className="submit-note">{duplicateMessage}</p>}
        </form>
      </section>

      <section className="panel map-panel">
        <div className="panel-header">
          <h2>Select location</h2>
          <span className="status-pill">Map click</span>
        </div>
        <MapContainer
          center={[Number(formData.lat) || city.center[0], Number(formData.lng) || city.center[1]]}
          zoom={11}
          scrollWheelZoom
          className="map-view"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleMapClick} />
          <CircleMarker
            center={[Number(formData.lat) || city.center[0], Number(formData.lng) || city.center[1]]}
            radius={12}
            pathOptions={{
              color: '#38bdf8',
              fillColor: '#38bdf8',
              fillOpacity: 0.8,
            }}
          />
        </MapContainer>
      </section>
    </div>
  )
}

function RiskPage({ city }) {
  const riskRows = city.hotspots.map((zone) => ({
    ...zone,
    score: getRiskScore(zone),
  }))

  return (
    <div className="page-grid risk-layout">
      <section className="panel">
        <div className="panel-header">
          <h2>{city.name} risk assessment engine</h2>
          <span className="status-pill warning">Explainable score</span>
        </div>
        <p className="lead compact">
          Preliminary risk scores are based on a weighted model using recent rainfall, historical waterlogging frequency,
          verified report activity, and terrain or drainage context. Thresholds are experimental and require validation.
        </p>
        <div className="risk-card-grid">
          {riskRows.map((zone) => (
            <article key={zone.id} className="risk-card">
              <div className="risk-card-header">
                <h3>{zone.name}</h3>
                <span className={`score-badge ${zone.score >= 75 ? 'alert' : ''}`}>{zone.score}/100</span>
              </div>
              <div className="ring-wrapper">
                <div className="score-ring" style={{ '--progress': `${zone.score}%` }}>
                  {zone.score}
                </div>
              </div>
              <ul>
                {zone.factors.map((factor) => (
                  <li key={factor}>{factor}</li>
                ))}
              </ul>
              <small>Last updated: {zone.latestUpdate}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function RoutePage({ city }) {
  const [origin, setOrigin] = useState(city.locations[0])
  const [destination, setDestination] = useState(city.locations[1] || city.locations[0])

  return (
    <div className="page-grid route-layout">
      <section className="panel route-controls">
        <div className="panel-header">
          <h2>{city.name} safer route planner</h2>
          <span className="status-pill">Routing-aware</span>
        </div>
        <div className="route-form">
          <label>
            Origin
            <select value={origin} onChange={(event) => setOrigin(event.target.value)}>
              {city.locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </label>
          <label>
            Destination
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              {city.locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="route-list">
          {city.routeAlternatives.map((route) => (
            <article key={route.id} className="route-card">
              <div className="row-between">
                <strong>{route.label}</strong>
                <span className="score-badge">{route.score}/100</span>
              </div>
              <div className="mini-stats">
                <span>{route.distance}</span>
                <span>{route.time}</span>
                <span>{route.hazards} hazards</span>
              </div>
              <p>{route.avoidance}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel map-panel route-map-panel">
        <div className="panel-header">
          <h2>Route comparison</h2>
          <span className="status-pill verified">Avoidance-aware</span>
        </div>
        <MapContainer center={city.center} zoom={10} scrollWheelZoom className="map-view">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {city.routeAlternatives.map((route) => (
            <Polyline
              key={route.id}
              positions={route.path}
              pathOptions={{
                color: route.id.includes('route-1') || route.id.includes('ny-route-1') || route.id.includes('dk-route-1') || route.id.includes('ld-route-1') ? '#22c55e' : '#f97316',
                weight: route.id.includes('route-1') || route.id.includes('ny-route-1') || route.id.includes('dk-route-1') || route.id.includes('ld-route-1') ? 6 : 4,
                opacity: 0.9,
              }}
            />
          ))}
        </MapContainer>
      </section>
    </div>
  )
}

function AdminPage({ city }) {
  const metrics = [
    { label: 'Total incidents', value: String(city.incidents.length + 42), tone: 'primary' },
    { label: 'Awaiting verification', value: String(Math.max(3, city.incidents.filter((item) => item.verification === 'Pending').length + 2)), tone: 'warning' },
    { label: 'Verified active', value: String(city.incidents.filter((item) => item.status === 'Active' && item.verification === 'Verified').length + 8), tone: 'danger' },
    { label: 'Resolved', value: String(city.incidents.filter((item) => item.status === 'Resolved').length + 10), tone: 'success' },
  ]

  return (
    <div className="page-grid admin-layout">
      <section className="stats-grid admin-stats">
        {metrics.map((metric) => (
          <div key={metric.label} className={`stat-card ${metric.tone}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Incident trends</h2>
          <span className="status-pill">Monthly</span>
        </div>
        <div className="chart-wrap medium-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={city.adminTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Reports by severity</h2>
          <span className="status-pill">Split</span>
        </div>
        <div className="chart-wrap small-chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={city.adminSeverityData} dataKey="value" nameKey="name" innerRadius={36} outerRadius={70} fill="#8884d8" paddingAngle={2}>
                {city.adminSeverityData.map((entry) => (
                  <Cell key={entry.name} fill={severityColors[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel admin-table-panel">
        <div className="panel-header">
          <h2>Open reports</h2>
          <span className="status-pill">Searchable</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Last update</th>
              </tr>
            </thead>
            <tbody>
              {city.incidents.map((incident) => (
                <tr key={incident.id}>
                  <td>{incident.title}</td>
                  <td>
                    <span className="signal" style={{ background: severityColors[incident.severity] }} />
                    {incident.severity}
                  </td>
                  <td>
                    <span className="signal" style={{ background: statusColors[incident.status] }} />
                    {incident.status}
                  </td>
                  <td>{formatDate(incident.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [selectedCityId, setSelectedCityId] = useState('bengaluru')
  const city = getCityProfile(selectedCityId)

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <div className="logo-wrap">
            <div className="logo-icon">F</div>
            <div>
              <strong>FloodWatch</strong>
              <small>Global flood intelligence</small>
            </div>
          </div>

          <nav className="nav-bar">
            <NavLink to="/" end>Overview</NavLink>
            <NavLink to="/report">Report</NavLink>
            <NavLink to="/risk">Risk</NavLink>
            <NavLink to="/routes">Routes</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage city={city} onChangeCity={setSelectedCityId} />} />
            <Route path="/report" element={<ReportPage city={city} onChangeCity={setSelectedCityId} />} />
            <Route path="/risk" element={<RiskPage city={city} onChangeCity={setSelectedCityId} />} />
            <Route path="/routes" element={<RoutePage city={city} onChangeCity={setSelectedCityId} />} />
            <Route path="/admin" element={<AdminPage city={city} onChangeCity={setSelectedCityId} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
