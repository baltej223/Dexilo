import React, { useState } from 'react';

const RoyaltyManager = ({ project, user }) => {
  const [royaltySettings, setRoyaltySettings] = useState({
    splitType: 'equal', // 'equal', 'custom', 'contribution'
    participants: [
      { id: 1, name: 'Alice', percentage: 50, role: 'Producer' },
      { id: 2, name: 'Bob', percentage: 50, role: 'Musician' }
    ]
  });

  const [earnings, setEarnings] = useState({
    totalEarnings: 0.125, // ICP
    thisMonth: 0.045,
    lastPayout: '2024-01-15'
  });

  const handleSplitTypeChange = (type) => {
    setRoyaltySettings(prev => ({
      ...prev,
      splitType: type,
      participants: type === 'equal' 
        ? prev.participants.map(p => ({ ...p, percentage: 100 / prev.participants.length }))
        : prev.participants
    }));
  };

  const handlePercentageChange = (participantId, newPercentage) => {
    setRoyaltySettings(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === participantId ? { ...p, percentage: newPercentage } : p
      )
    }));
  };

  const totalPercentage = royaltySettings.participants.reduce((sum, p) => sum + p.percentage, 0);

  return (
    <div className="royalty-manager">
      <div className="royalty-header">
        <h3>💰 Royalty Management</h3>
        <p>Manage revenue sharing for "{project.title}"</p>
      </div>

      <div className="earnings-overview">
        <h4>Earnings Overview</h4>
        <div className="earnings-cards">
          <div className="earning-card">
            <div className="earning-label">Total Earnings</div>
            <div className="earning-value">{earnings.totalEarnings} ICP</div>
          </div>
          <div className="earning-card">
            <div className="earning-label">This Month</div>
            <div className="earning-value">{earnings.thisMonth} ICP</div>
          </div>
          <div className="earning-card">
            <div className="earning-label">Last Payout</div>
            <div className="earning-value">{earnings.lastPayout}</div>
          </div>
        </div>
      </div>

      <div className="royalty-split">
        <h4>Royalty Split Settings</h4>
        
        <div className="split-type-selector">
          <label>
            <input
              type="radio"
              checked={royaltySettings.splitType === 'equal'}
              onChange={() => handleSplitTypeChange('equal')}
            />
            Equal Split
          </label>
          <label>
            <input
              type="radio"
              checked={royaltySettings.splitType === 'custom'}
              onChange={() => handleSplitTypeChange('custom')}
            />
            Custom Split
          </label>
        </div>

        <div className="participants-split">
          {royaltySettings.participants.map(participant => (
            <div key={participant.id} className="participant-split">
              <div className="participant-info">
                <span className="participant-name">{participant.name}</span>
                <span className="participant-role">{participant.role}</span>
              </div>
              <div className="percentage-input">
                {royaltySettings.splitType === 'custom' ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={participant.percentage}
                    onChange={(e) => handlePercentageChange(participant.id, parseFloat(e.target.value) || 0)}
                  />
                ) : (
                  <span>{participant.percentage.toFixed(1)}</span>
                )}
                <span>%</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`total-percentage ${totalPercentage !== 100 ? 'invalid' : 'valid'}`}>
          Total: {totalPercentage.toFixed(1)}%
          {totalPercentage !== 100 && (
            <span className="error-message">Must equal 100%</span>
          )}
        </div>
      </div>

      <div className="royalty-actions">
        <button className="btn-primary">Save Royalty Settings</button>
        <button className="btn-secondary">Request Payout</button>
        <button className="btn-secondary">View Transaction History</button>
      </div>
    </div>
  );
};

export default RoyaltyManager;
