import React, { useState } from 'react';
import Icon from './Icon';
import { SidebarContext, useSidebar } from './SidebarContext';

// 2. Aceternity UI Sidebar Primitive
export function SidebarProvider({
  children,
  open: controlledOpen,
  setOpen: setControlledOpen,
  animate = true,
  defaultOpen = false,
  onOpenChange,
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [pinned, setPinned] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleSetOpen = (value) => {
    const nextVal = typeof value === 'function' ? value(open) : value;
    if (isControlled) {
      setControlledOpen?.(nextVal);
    } else {
      setUncontrolledOpen(nextVal);
    }
    onOpenChange?.(nextVal);
  };

  const togglePinned = () => {
    setPinned((p) => {
      const nextPinned = !p;
      if (nextPinned) {
        handleSetOpen(true);
      }
      return nextPinned;
    });
  };

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen: handleSetOpen,
        animate,
        pinned,
        setPinned,
        togglePinned,
      }}
    >
      {typeof children === 'function' ? children({ open, setOpen: handleSetOpen }) : children}
    </SidebarContext.Provider>
  );
}

// 3. Aceternity UI SidebarBody Primitive
export function SidebarBody({ className = '', children, ...props }) {
  const { open, setOpen, animate, pinned } = useSidebar();

  const handleMouseEnter = () => {
    if (animate && !pinned) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (animate && !pinned) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Trigger (Floating on small screens) */}
      <div className="sidebar-mobile-header">
        <div className="mobile-brand-title">
          <Icon name="vertex-logo" className="mobile-brand-icon" />
          <span>HV Vertex</span>
        </div>
        <button
          className="sidebar-mobile-toggle-btn"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
        >
          <Icon name={open ? 'x' : 'menu'} />
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebar-mobile-backdrop ${open ? 'visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Desktop / Responsive Collapsible Sidebar */}
      <aside
        className={`sidebar-collapsible ${open ? 'sidebar-expanded' : 'sidebar-collapsed'} ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <div className="sidebar-content-inner">
          {children}
        </div>
      </aside>
    </>
  );
}

// 4. Aceternity UI SidebarLink Primitive
export function SidebarLink({
  link,
  className = '',
  active = false,
  ...props
}) {
  const { open, setOpen } = useSidebar();

  const handleClick = (e) => {
    if (link.onClick) {
      link.onClick(e);
    }
    // Auto close drawer on mobile screens after selecting destination
    if (window.innerWidth <= 900) {
      setOpen(false);
    }
  };

  return (
    <button
      className={`sidebar-link ${active ? 'active on' : ''} ${className}`}
      onClick={handleClick}
      title={!open ? link.label : undefined}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      <span className="sidebar-link-indicator" />
      <div className="sidebar-link-icon-box">
        {typeof link.icon === 'string' ? (
          <Icon name={link.icon} className="sidebar-link-icon ic" />
        ) : (
          link.icon
        )}
      </div>

      <div className="sidebar-link-label-group">
        <span className="sidebar-link-label">{link.label}</span>

        {link.badge && (
          <span className={`sidebar-link-tag ${link.badgeVariant ? `tag-${link.badgeVariant}` : ''}`}>
            {link.badge}
          </span>
        )}

        {link.count > 0 && (
          <span className="sidebar-link-badge">
            {link.count}
          </span>
        )}
      </div>
    </button>
  );
}

// 5. Complete HV VERTEX Collapsible Sidebar implementation
export default function Sidebar({
  children,
  role = 'emp',
  currentPage = 'dash',
  chatTab = 'team',
  onNavigate,
  unreadCount = 0,
  onToast,
  onToggleAppearance,
  isAppearanceOpen = false,
  onRoleChange,
  open: controlledOpen,
  setOpen: setControlledOpen,
  onOpenChange,
  ...props
}) {
  // If children are passed, render as the standard Aceternity UI container component
  if (children) {
    return (
      <SidebarProvider
        open={controlledOpen}
        setOpen={setControlledOpen}
        onOpenChange={onOpenChange}
        {...props}
      >
        {children}
      </SidebarProvider>
    );
  }

  const isEmployee = role !== 'adm';

  // Navigation sections structure
  const sections = isEmployee
    ? [
        {
          id: 'workspace',
          title: 'Workspace',
          items: [
            { key: 'dash', label: 'Overview', icon: 'grid' },
            { key: 'uploads', label: 'Uploads', icon: 'upload' },
            { key: 'vault', label: 'Download Vault', icon: 'folder' },
            { key: 'chat', label: 'Team Chat', icon: 'chat' },
          ],
        },
        {
          id: 'intelligence',
          title: 'Intelligence',
          items: [
            { key: 'ai', label: 'Vertex AI', icon: 'sparkles', badge: 'AI', badgeVariant: 'emerald' },
          ],
        },
        {
          id: 'account',
          title: 'Account utilities',
          items: [
            { key: 'alerts', label: 'Notifications', icon: 'bell', count: unreadCount },
            { key: 'pref', label: 'Preferences', icon: 'sliders', isAction: true },
          ],
        },
      ]
    : [
        {
          id: 'portal',
          title: 'Control portal',
          items: [
            { key: 'adash', label: 'Overview', icon: 'grid' },
            { key: 'subs', label: 'Submissions', icon: 'table' },
            { key: 'sec', label: 'Security & Audit', icon: 'shield' },
          ],
        },
        {
          id: 'system',
          title: 'System',
          items: [
            { key: 'pref', label: 'Preferences', icon: 'sliders', isAction: true },
          ],
        },
      ];

  const handleItemClick = (item) => {
    if (item.key === 'pref') {
      if (onToggleAppearance) {
        onToggleAppearance();
      } else if (onToast) {
        onToast('Theme & display preferences');
      }
      return;
    }
    if (onNavigate) {
      onNavigate(item.key);
    }
  };

  const isItemActive = (itemKey) => {
    if (itemKey === 'dash') return currentPage === 'dash';
    if (itemKey === 'uploads') return currentPage === 'uploads';
    if (itemKey === 'vault') return currentPage === 'vault';
    if (itemKey === 'chat') return currentPage === 'chat' && chatTab !== 'bot';
    if (itemKey === 'ai') return currentPage === 'chat' && chatTab === 'bot';
    if (itemKey === 'alerts') return currentPage === 'alerts';
    if (itemKey === 'pref') return isAppearanceOpen;
    if (itemKey === 'adash') return currentPage === 'adash';
    if (itemKey === 'subs') return currentPage === 'subs';
    if (itemKey === 'sec') return currentPage === 'sec';
    return currentPage === itemKey;
  };

  return (
    <SidebarProvider
      open={controlledOpen}
      setOpen={setControlledOpen}
      onOpenChange={onOpenChange}
      {...props}
    >
      <SidebarBody className="side untitled-sidebar">
        {/* Brand / Logo Header */}
        <SidebarHeader
          isEmployee={isEmployee}
          role={role}
        />

        {/* Navigation Sections */}
        <div className="sidebar-sections-wrapper">
          {sections.map((section, sIdx) => (
            <React.Fragment key={section.id}>
              {sIdx > 0 && <div className="sidebar-section-divider" />}
              <div className="sidebar-nav-section">
                <div className="sidebar-nav-section-title">
                  <span>{section.title}</span>
                </div>
                <div className="sidebar-nav-group">
                  {section.items.map((item) => (
                    <SidebarLink
                      key={item.key}
                      active={isItemActive(item.key)}
                      link={{
                        ...item,
                        onClick: () => handleItemClick(item),
                      }}
                    />
                  ))}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Desktop Client Promo */}
        <SidebarPromo onToast={onToast} />

        {/* Bottom Profile Section */}
        <SidebarProfile
          isEmployee={isEmployee}
          role={role}
          onRoleChange={onRoleChange}
          onToggleAppearance={onToggleAppearance}
          onToast={onToast}
        />
      </SidebarBody>
    </SidebarProvider>
  );
}

// Subcomponent: Sidebar Header
function SidebarHeader({ isEmployee, role }) {
  const { open, pinned, togglePinned } = useSidebar();

  return (
    <div className="sidebar-brand-header">
      <div className="sidebar-brand-left" title="HV VERTEX Enterprise">
        <div className="sidebar-logo-container">
          <Icon name="vertex-logo" className="sidebar-brand-icon" />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">HV Vertex</span>
          <span className="sidebar-brand-sub">
            {isEmployee ? 'WORKSPACE' : 'CONTROL PORTAL'}
          </span>
        </div>
      </div>

      <div className="sidebar-brand-actions">
        {role === 'adm' && (
          <span className="sidebar-admin-badge" title="Administrator portal">
            ADMIN
          </span>
        )}
        <button
          className={`sidebar-pin-btn ${pinned ? 'pinned' : ''}`}
          onClick={togglePinned}
          title={pinned ? 'Unpin sidebar (auto-collapse)' : 'Pin sidebar open'}
          aria-label={pinned ? 'Unpin sidebar' : 'Pin sidebar open'}
        >
          <Icon name={open ? 'chevron-left' : 'chevron-right'} />
        </button>
      </div>
    </div>
  );
}

// Subcomponent: Promo Card
function SidebarPromo({ onToast }) {
  const { open } = useSidebar();

  if (!open) {
    return (
      <div className="sidebar-promo-compact">
        <button
          className="sidebar-promo-mini-btn"
          onClick={() => onToast && onToast('Desktop client build available with Build 4.10.2')}
          title="HV Vertex Desktop Client"
          aria-label="Desktop client download"
        >
          <Icon name="laptop" />
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar-promo-card">
      <div className="sidebar-promo-top">
        <Icon name="laptop" className="sidebar-promo-icon" />
        <span className="sidebar-promo-title">HV Vertex Desktop</span>
      </div>
      <p className="sidebar-promo-desc">
        Hardware-isolated client with native alerts.
      </p>
      <button
        className="sidebar-promo-action-btn"
        onClick={() => onToast && onToast('Desktop client build available with Build 4.10.2')}
      >
        Download app
      </button>
    </div>
  );
}

// Subcomponent: Profile Area
function SidebarProfile({
  isEmployee,
  role,
  onRoleChange,
  onToggleAppearance,
  onToast,
}) {
  const { open } = useSidebar();

  const handleRoleToggle = () => {
    if (onRoleChange) {
      const nextRole = role === 'adm' ? 'emp' : 'adm';
      onRoleChange(nextRole);
      if (onToast) {
        onToast(`Switched view to ${nextRole === 'adm' ? 'Administrator' : 'Employee'}`);
      }
    } else if (onToast) {
      onToast(`Logged in as Maya Chen (${isEmployee ? 'Alpha Team' : 'Security Admin'})`);
    }
  };

  return (
    <div className="sidebar-profile-section">
      <div className="sidebar-profile-divider" />
      <div
        className="sidebar-profile-card"
        onClick={handleRoleToggle}
        role="button"
        tabIndex={0}
        title={open ? 'Click to toggle Employee / Admin view' : 'Maya Chen · Active session'}
      >
        <div className="sidebar-profile-avatar-wrap">
          <div className="sidebar-profile-avatar">MC</div>
          <span className="sidebar-status-dot" title="Active session" />
        </div>

        <div className="sidebar-profile-details">
          <span className="sidebar-profile-name">Maya Chen</span>
          <span className="sidebar-profile-role">
            {isEmployee ? 'Senior Systems Eng' : 'Security Administrator'}
          </span>
        </div>

        <button
          className="sidebar-profile-more-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onRoleChange) {
              handleRoleToggle();
            } else if (onToggleAppearance) {
              onToggleAppearance();
            }
          }}
          aria-label="Profile options"
          title={onRoleChange ? `Switch to ${role === 'adm' ? 'Employee' : 'Admin'} view` : 'Options'}
        >
          <Icon name="dots" />
        </button>
      </div>
    </div>
  );
}
