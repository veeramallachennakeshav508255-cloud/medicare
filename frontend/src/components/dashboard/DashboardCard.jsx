import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon: Icon, color = '#0284c7', trend = null }) => {
  return (
    <div className="kpi-card">
      <div
        className="kpi-icon-box"
        style={{
          backgroundColor: `${color}15`,
          color: color
        }}
      >
        <Icon size={24} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{title}</div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
      </div>
      {trend && (
        <span
          className="badge"
          style={{
            backgroundColor: trend.startsWith('+') ? '#d1fae5' : '#fee2e2',
            color: trend.startsWith('+') ? '#065f46' : '#991b1b',
            alignSelf: 'flex-start',
            fontSize: '0.74rem'
          }}
        >
          {trend}
        </span>
      )}
    </div>
  );
};

export default DashboardCard;
