import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import AnimatedTooltipPreview from '../components/ui/AnimatedTooltipPreview';
import SpotlightCard from '../components/SpotlightCard';
import { fmtT, now, hms } from '../utils/time';

export default function ChatPage({
  chatMessages,
  botMessages,
  currentChannel,
  currentTab,
  onTabChange,
  onChannelChange,
  onSendMessage,
  onSendBotMessage,
  onToast,
  deadline,
  portalState,
}) {
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showMeeraTyping, setShowMeeraTyping] = useState(true);
  const messagesEndRef = useRef(null);

  const channels = ['# alpha', '# motor-ctrl', '# fw-team'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, botMessages, isBotTyping, currentTab, showMeeraTyping]);

  const meeraTimerRef = useRef(false);
  useEffect(() => {
    if (!meeraTimerRef.current && currentTab === 'team') {
      meeraTimerRef.current = true;
      const timer = setTimeout(() => {
        setShowMeeraTyping(false);
        onSendMessage({
          who: 'Meera Shah',
          t: '16:09',
          txt: 'Bench test passed. Merging after review.',
        });
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [currentTab, onSendMessage]);

  const botAnswer = (q) => {
    const s = q.toLowerCase();
    const n = now();
    if (/deadline|close|when/.test(s)) {
      return portalState === 'closed'
        ? `Your Alpha upload closed at ${fmtT(deadline)} IST. The portal now returns HTTP 423. Ask an admin for an extension pass.`
        : `Your Alpha firmware upload closes at ${fmtT(deadline)} IST, in ${hms(deadline - n)}.`;
    }
    if (/late|policy|penalt/.test(s)) {
      return 'Hard lockout is the default: uploads stop at the deadline. Projects set to soft lockout accept late files and flag them with a penalty.';
    }
    if (/download|vault|link|unlock/.test(s)) {
      return 'Confidential files unlock inside a release window. Each download link works for 300 seconds, then returns HTTP 410.';
    }
    return 'I can answer questions about your deadlines, downloads and company policy. For anything else, ask an admin.';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) {
      onToast('Type a message first');
      return;
    }
    setInputText('');

    if (currentTab === 'bot') {
      onSendBotMessage({ me: true, txt: text });
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        onSendBotMessage({ bot: true, txt: botAnswer(text) });
      }, 900);
    } else {
      const msgId = Date.now();
      const timeStr = fmtT(now()).slice(0, 5);
      onSendMessage({ id: msgId, me: true, t: timeStr, txt: text, seen: 'Sent' });

      setTimeout(() => {
        onSendMessage({ id: msgId, updateSeen: `Seen ${fmtT(now()).slice(0, 5)}` });
      }, 1600);
    }
  };

  const handleChipClick = (question) => {
    onSendBotMessage({ me: true, txt: question });
    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      onSendBotMessage({ bot: true, txt: botAnswer(question) });
    }, 900);
  };

  return (
    <>
      <div className="head rise">
        <div>
          <h1>Chat and assistant</h1>
          <p className="sub">Project channels with the company assistant one tab away.</p>
        </div>
        <div className="seg">
          <button
            className={currentTab === 'team' ? 'on' : ''}
            onClick={() => onTabChange('team')}
          >
            Team chat
          </button>
          <button
            className={currentTab === 'bot' ? 'on' : ''}
            onClick={() => onTabChange('bot')}
          >
            Assistant
          </button>
        </div>
      </div>

      {/* Team Members Section near Team Chat Header */}
      {currentTab === 'team' && (
        <SpotlightCard className="team-members-bar card rise" style={{ '--i': 0.5 }}>
          <div className="team-members-header">
            <div className="team-members-title-group">
              <span className="team-members-kicker">COLLABORATION</span>
              <h2 className="team-members-title">Team Members</h2>
            </div>
            <span className="team-members-meta">6 assigned · Alpha firmware group</span>
          </div>

          <div className="team-members-content">
            <AnimatedTooltipPreview
              onSelectMember={(member) => {
                if (member.hasDirectChat) {
                  onTabChange('team');
                  onChannelChange(member.channelIndex ?? 0);
                  onToast(`Viewing active discussion with ${member.name}`);
                } else {
                  onToast(
                    `Direct message channel with ${member.name} (${member.designation}) is not enabled on this server.`,
                    'bad'
                  );
                }
              }}
              onToast={onToast}
            />
          </div>
        </SpotlightCard>
      )}

      <div className="chatwrap rise" style={{ '--i': 1 }}>
        <SpotlightCard className="card">
          <div className="ct">
            <h2>Channels</h2>
          </div>
          <div className="chan">
            {channels.map((c, i) => (
              <button
                key={c}
                className={currentChannel === i && currentTab === 'team' ? 'on' : ''}
                onClick={() => {
                  onTabChange('team');
                  onChannelChange(i);
                }}
              >
                {c}
              </button>
            ))}

            <div className="grp" style={{ paddingLeft: 12 }}>
              Direct
            </div>
            <button
              onClick={() => {
                onTabChange('team');
                onChannelChange(0);
              }}
            >
              <span className="ava" style={{ width: 24, height: 24, fontSize: 10 }}>
                RK
              </span>
              Ravi Kumar
            </button>
            <button
              onClick={() => {
                onTabChange('team');
                onChannelChange(0);
              }}
            >
              <span className="ava" style={{ width: 24, height: 24, fontSize: 10 }}>
                MS
              </span>
              Meera Shah
            </button>
          </div>
        </SpotlightCard>

        <SpotlightCard className="card" id="chatcard">
          {currentTab === 'bot' ? (
            <>
              <div className="ct">
                <h2>Company assistant</h2>
                <button
                  className="btn out sm"
                  onClick={() => onToast('Escalated to an admin. Your chat history is attached.')}
                >
                  <Icon name="users" />
                  Ask an admin
                </button>
              </div>

              <div className="msgs">
                {botMessages.map((m, i) => (
                  <div key={i} className={`m ${m.me ? 'me2' : ''}`}>
                    {!m.me && (
                      <div className="ava">
                        <Icon name="bot" />
                      </div>
                    )}
                    <div className="bub">{m.txt}</div>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="m">
                    <div className="ava">
                      <Icon name="bot" />
                    </div>
                    <div className="bub">
                      <span className="dots">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chips">
                <button onClick={() => handleChipClick('When is my upload deadline?')}>
                  When is my upload deadline?
                </button>
                <button onClick={() => handleChipClick('What is the late upload policy?')}>
                  Late upload policy
                </button>
                <button onClick={() => handleChipClick('How do vault downloads work?')}>
                  How do downloads work?
                </button>
              </div>

              <form className="compose" onSubmit={handleSubmit} autoComplete="off">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about projects or policy"
                  aria-label="Message the assistant"
                />
                <button className="btn pri" type="submit">
                  <Icon name="send" />
                  Send
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="ct">
                <h2>{channels[currentChannel]}</h2>
                <span className="pill good">3 online</span>
              </div>

              <div className="msgs">
                {chatMessages.map((m, i) => {
                  if (m.me) {
                    return (
                      <div key={i} className="m me2">
                        <div className="bub">
                          {m.txt}
                          <small>
                            {m.t} · {m.seen || 'Sent'}
                          </small>
                        </div>
                      </div>
                    );
                  }

                  const initials = (m.who || 'User')
                    .split(' ')
                    .map((w) => w[0])
                    .join('');

                  return (
                    <div key={i} className="m">
                      <div className="ava">{initials}</div>
                      <div className="bub">
                        <b>{m.who}</b>
                        {m.txt}
                        {m.code && (
                          <pre className="code">
                            <span className="k">assign</span>{' '}
                            <span className="f">led_en</span> = en &amp; ~
                            <span className="n">rst_n</span>;
                          </pre>
                        )}
                        <small>{m.t}</small>
                      </div>
                    </div>
                  );
                })}

                {showMeeraTyping && (
                  <div className="m">
                    <div className="ava">MS</div>
                    <div className="bub">
                      <span className="dots">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="compose" onSubmit={handleSubmit} autoComplete="off">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Message the team"
                  aria-label="Message the team"
                />
                <button className="btn pri" type="submit">
                  <Icon name="send" />
                  Send
                </button>
              </form>
            </>
          )}
        </SpotlightCard>
      </div>
    </>
  );
}
