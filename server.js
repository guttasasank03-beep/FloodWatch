import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const incidents = [
  {
    id: 'INC-2048',
    title: 'Outer Ring Road near Bellandur',
    description: 'Waterlogging causing slow traffic and knee-deep water at the service road.',
    severity: 'High',
    status: 'Active',
    verification: 'Verified',
    lat: 12.9249,
    lng: 77.6755,
    time: '2026-10-26T07:30:00Z',
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
    time: '2026-10-26T06:20:00Z',
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
    time: '2026-10-25T21:00:00Z',
    roadName: 'ITPL Main Road',
    reporter: 'Commuter',
  },
];

const rainfall = [
  { time: '00:00', rainfall: 9 },
  { time: '03:00', rainfall: 14 },
  { time: '06:00', rainfall: 22 },
  { time: '09:00', rainfall: 28 },
  { time: '12:00', rainfall: 18 },
  { time: '15:00', rainfall: 12 },
  { time: '18:00', rainfall: 25 },
  { time: '21:00', rainfall: 16 },
];

const riskZones = [
  { id: 'zone-01', name: 'Bellandur Lake corridor', risk: 82, category: 'High', lat: 12.9302, lng: 77.6691 },
  { id: 'zone-02', name: 'Koramangala Kormangala 8th Block', risk: 74, category: 'Moderate', lat: 12.9351, lng: 77.6229 },
  { id: 'zone-03', name: 'Yelahanka arterial roads', risk: 61, category: 'Moderate', lat: 13.1005, lng: 77.5901 },
  { id: 'zone-04', name: 'JP Nagar drains', risk: 69, category: 'Moderate', lat: 12.9064, lng: 77.5859 },
];

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'FloodWatch API', timestamp: new Date().toISOString() });
});

app.get('/api/incidents', (_req, res) => {
  res.json({ incidents, count: incidents.length });
});

app.get('/api/weather', (_req, res) => {
  res.json({ rainfall, source: 'demo.weather.provider', note: 'Prototype data only; no live API key configured.' });
});

app.get('/api/risk-zones', (_req, res) => {
  res.json({ riskZones, note: 'Preliminary scores based on an experimental weighted model.' });
});

app.post('/api/route-check', (req, res) => {
  const { origin, destination } = req.body || {};
  const recommended = [
    { id: 'route-1', label: 'Safer route via elevated roads', distance: '12.8 km', time: '26 min', hazards: 1, avoidance: 'Avoids Bellandur road segment', score: 81 },
    { id: 'route-2', label: 'Shorter but more exposed', distance: '11.2 km', time: '24 min', hazards: 3, avoidance: 'Uses a storm-prone corridor', score: 58 },
  ];

  res.json({ origin: origin || 'Indiranagar', destination: destination || 'Whitefield', recommended, note: 'Route safety is only a preliminary assessment and may not capture all current hazards.' });
});

app.listen(port, () => {
  console.log(`FloodWatch backend running at http://localhost:${port}`);
});
