import React from 'react';
import Icon from '../components/Icon';
import SpotlightCard from '../components/SpotlightCard';

export default function AdminSecurityPage({
  logins,
  incidents,
  onSimulateUnauthorizedAccess,
}) {
  return (
    <>
      <div className="head rise">
        <div>
          <h1>Security</h1>
          <p className="sub">
            Role checks run on the server. Hidden buttons are not a defence.
          </p>
        </div>
        <div className="acts">
          <button
            className="btn red"
            onClick={onSimulateUnauthorizedAccess}
          >
            <Icon name="shield" />
            Test unauthorized access
          </button>
        </div>
      </div>

      <div className="bento">
        <SpotlightCard className="card c7 rise" style={{ '--i': 1 }}>
          <div className="ct">
            <h2>Login audit</h2>
            <span className="pill mute">Latest</span>
          </div>
          <div className="tw">
            <table>
              <tbody>
                {logins.map((l, i) => (
                  <tr key={i} style={{ cursor: 'default' }}>
                    <td>
                      <b>{l[0]}</b>
                    </td>
                    <td>{l[1]}</td>
                    <td>
                      <span
                        className={`pill ${
                          /Failed/.test(l[2]) ? 'bad' : 'good'
                        }`}
                      >
                        {l[2]}
                      </span>
                    </td>
                    <td className="mono">{l[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SpotlightCard>

        <SpotlightCard className="card c5 rise" style={{ '--i': 2 }}>
          <div className="ct">
            <h2>Security incidents</h2>
            <span className="pill bad" id="incn">
              {incidents.length}
            </span>
          </div>
          <div className="list">
            {incidents.map((x, i) => (
              <div className="row" key={i}>
                <div className="fi" style={{ color: 'var(--bad)' }}>
                  <Icon name="alert" />
                </div>
                <div className="grow">
                  <b>{x.what}</b>
                  <small>
                    {x.who} · {x.t} · {x.res}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </>
  );
}
