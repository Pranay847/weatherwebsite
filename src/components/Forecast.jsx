import React from 'react';

function toDateKey(dt) {
  const d = new Date(dt * 1000);
  return d.toISOString().slice(0, 10);
}

function dayLabel(dt) {
  const d = new Date(dt * 1000);
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function Forecast({ forecast, units = 'metric' }) {
  if (!forecast || !forecast.list) return null;

  const grouped = forecast.list.reduce((acc, item) => {
    const key = toDateKey(item.dt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const days = Object.keys(grouped).slice(0, 5).map((key) => {
    const items = grouped[key];
    let min = Infinity;
    let max = -Infinity;
    const descCount = {};
    let icon = items[0]?.weather?.[0]?.icon || '';

    items.forEach((it) => {
      const t = it.main.temp;
      if (t < min) min = t;
      if (t > max) max = t;
      const desc = it.weather?.[0]?.description || '';
      descCount[desc] = (descCount[desc] || 0) + 1;
      if (Math.abs(new Date(it.dt * 1000).getHours() - 12) < 3) icon = it.weather?.[0]?.icon || icon;
    });

    const mostDesc = Object.entries(descCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

    return {
      key,
      label: dayLabel(items[0].dt),
      min: Math.round(min),
      max: Math.round(max),
      desc: mostDesc,
      icon,
    };
  });

  const unitSymbol = units === 'metric' ? '°C' : '°F';

  return (
    <div className="forecast-summary">
      {days.map((d) => (
        <div key={d.key} className="forecast-day">
          <div className="fd-label">{d.label}</div>
          {d.icon && (
            <img src={`https://openweathermap.org/img/wn/${d.icon}@2x.png`} alt="" />
          )}
          <div className="fd-temps">{d.max}{unitSymbol} / {d.min}{unitSymbol}</div>
          <div className="fd-desc">{d.desc}</div>
        </div>
      ))}
    </div>
  );
}
