'use client';

import { BarChart3, PieChart as PieIcon, Radar as RadarIcon, Box } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const pieData = [
  { name: 'Non-Potable (Class 0)', value: 1998, color: '#f43f5e' },
  { name: 'Potable (Class 1)', value: 1278, color: '#10b981' },
];

const barData = [
  { name: 'pH', value: 7.08, benchmark: 7.0 },
  { name: 'Chloramines', value: 7.12, benchmark: 4.0 },
  { name: 'Sulfate', value: 333.7, benchmark: 250.0 },
  { name: 'Conductivity', value: 421.8, benchmark: 400.0 },
  { name: 'Turbidity', value: 3.96, benchmark: 5.0 },
];

const radarData = [
  { parameter: 'pH', sample: 85, standard: 90 },
  { parameter: 'Disinfection', sample: 65, standard: 80 },
  { parameter: 'Hardness', sample: 70, standard: 75 },
  { parameter: 'Purity', sample: 60, standard: 85 },
  { parameter: 'Clarity', sample: 92, standard: 95 },
];

function Interactive3DScene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />
      {/* Interactive 3D Data Spheres */}
      <mesh position={[-1.5, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#06b6d4" roughness={0.3} />
      </mesh>
      <mesh position={[1.5, 0.5, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#10b981" roughness={0.3} />
      </mesh>
      <mesh position={[0, -1, 1]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.3} />
      </mesh>
      <OrbitControls autoRotate />
    </>
  );
}

export default function VisualizationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="w-7 h-7 theme-accent-text" /> Dataset Visual Analytics
        </h1>
        <p className="text-slate-400 mt-1">Multi-dimensional parameter distribution and compliance charts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="theme-card rounded-2xl p-6 shadow-xl">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 theme-accent-text" /> Target Class Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((e, idx) => (
                    <Cell key={idx} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="theme-card rounded-2xl p-6 shadow-xl">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <RadarIcon className="w-5 h-5 theme-accent-text" /> WHO Standard Radar
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="parameter" />
                <PolarRadiusAxis />
                <Radar name="Sample" dataKey="sample" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Radar name="Standard" dataKey="standard" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-2 theme-card rounded-2xl p-6 shadow-xl">
          <h2 className="font-semibold mb-4">Sample Mean vs Safe Benchmarks</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="value" name="Sample Mean" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="benchmark" name="Standard Benchmark" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3D Visualizer Scene */}
        <div className="lg:col-span-2 theme-card rounded-2xl p-6 shadow-xl">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <Box className="w-5 h-5 theme-accent-text" /> 3D Parameter Feature Cluster Scene
          </h2>
          <p className="text-xs text-slate-400 mb-4">Click and drag to rotate the 3D data space.</p>
          <div className="h-80 w-full rounded-xl overflow-hidden bg-slate-950/40 border">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <Interactive3DScene />
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}