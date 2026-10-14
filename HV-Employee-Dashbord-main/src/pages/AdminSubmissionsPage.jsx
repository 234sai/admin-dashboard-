import React from 'react';
import SpotlightCard from '../components/SpotlightCard';

export default function AdminSubmissionsPage({
  submissions,
  filter,
  onFilterChange,
  onSelectSubmission,
}) {
  const filteredSubmissions = submissions
    .map((r, i) => ({ r, i }))
    .filter(({ r }) => filter === 'All' || r.st.startsWith(filter));

  return (
    <>
      <div className="head rise">
        <div>
          <h1>Submissions</h1>
          <p className="sub">
            Server timestamps to the millisecond, with the SHA-256 of each file.
          </p>
        </div>
        <div className="seg">
          {['All', 'On time', 'Late', 'Missing'].map((f) => (
            <button
              key={f}
              className={filter === f ? 'on' : ''}
              onClick={() => onFilterChange(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <SpotlightCard className="card rise tw" style={{ '--i': 1, padding: '8px 8px' }}>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Server timestamp</th>
              <th>SHA-256</th>
              <th>Status</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map(({ r, i }) => (
              <tr
                key={i}
                onClick={() => onSelectSubmission(i)}
                title="Click to view details and assign grade"
              >
                <td>
                  <b>{r.n}</b>
                </td>
                <td className="mono">{r.ts}</td>
                <td className="mono">{r.h}</td>
                <td>
                  <span
                    className={`pill ${
                      r.st === 'On time'
                        ? 'good'
                        : r.st === 'Missing'
                        ? 'bad'
                        : 'warn'
                    }`}
                  >
                    {r.st}
                  </span>
                </td>
                <td>{r.g || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SpotlightCard>
    </>
  );
}
