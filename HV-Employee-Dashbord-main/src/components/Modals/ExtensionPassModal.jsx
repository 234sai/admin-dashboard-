import React, { useState } from 'react';
import SpotlightCard from '../SpotlightCard';

export default function ExtensionPassModal({ onClose, onIssuePass }) {
  const [employee, setEmployee] = useState('me');
  const [minutes, setMinutes] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    onIssuePass(employee, Number(minutes));
  };

  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <SpotlightCard className="modal" role="dialog" aria-modal="true">
        <h3>Issue extension pass</h3>
        <p className="sub">One employee may upload after the deadline. The pass is logged.</p>

        <label htmlFor="pe">Employee</label>
        <select
          id="pe"
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
        >
          <option value="me">K. Hitesh Laahiri</option>
          <option value="Ravi Kumar">Ravi Kumar</option>
          <option value="Meera Shah">Meera Shah</option>
          <option value="Arun Prasad">Arun Prasad</option>
        </select>

        <label htmlFor="pm">Extra time</label>
        <select
          id="pm"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
        </select>

        <div className="mfoot">
          <button className="btn out" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn pri" type="button" onClick={handleSubmit}>
            Issue pass
          </button>
        </div>
      </SpotlightCard>
    </div>
  );
}
