import React from 'react';
import Icon from '../Icon';

export default function KillScreen() {
  return (
    <div className="kill" role="alert">
      <div>
        <Icon name="shield" className="ic" style={{ width: 56, height: 56, marginBottom: 10 }} />
        <b>Session terminated</b>
        <p style={{ opacity: 0.85, marginTop: 6, maxWidth: 440 }}>
          An employee token requested an admin route. The server refused it, signed
          the user out and logged the attempt.
        </p>
      </div>
    </div>
  );
}
