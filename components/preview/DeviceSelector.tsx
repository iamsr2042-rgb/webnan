'use client';

import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { DeviceType } from '@/lib/preview';

interface DeviceSelectorProps {
  selected: DeviceType;
  onChange: (device: DeviceType) => void;
  variant?: 'button' | 'pill';
}

const DEVICE_ICONS: Record<DeviceType, React.ReactNode> = {
  desktop: <Monitor className="h-4 w-4" />,
  tablet: <Tablet className="h-4 w-4" />,
  mobile: <Smartphone className="h-4 w-4" />,
};

const DEVICE_LABELS: Record<DeviceType, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
};

export function DeviceSelector({
  selected,
  onChange,
  variant = 'button',
}: DeviceSelectorProps) {
  const devices: DeviceType[] = ['desktop', 'tablet', 'mobile'];

  if (variant === 'pill') {
    return (
      <div className="flex items-center gap-2 bg-slate-800 rounded-full p-1">
        {devices.map((device) => (
          <button
            key={device}
            onClick={() => onChange(device)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selected === device
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
            title={DEVICE_LABELS[device]}
          >
            {DEVICE_ICONS[device]}
            <span className="hidden sm:inline">{DEVICE_LABELS[device]}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {devices.map((device) => (
        <button
          key={device}
          onClick={() => onChange(device)}
          className={`p-2 rounded text-xs font-medium transition-colors ${
            selected === device
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title={DEVICE_LABELS[device]}
        >
          {DEVICE_ICONS[device]}
        </button>
      ))}
    </div>
  );
}
