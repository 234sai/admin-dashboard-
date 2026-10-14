import React from 'react';
import AnimatedTooltip from './AnimatedTooltip';
import { hvTeamMembers } from '../../data/teamMembers';

/**
 * AnimatedTooltipPreview Component
 * Renders the avatar row with AnimatedTooltip.
 * Supports direct message switching or informative feedback when private DMs are unavailable.
 */
export default function AnimatedTooltipPreview({
  members = hvTeamMembers,
  onSelectMember,
  onToast,
}) {
  const handleItemClick = (member) => {
    if (onSelectMember) {
      onSelectMember(member);
      return;
    }

    if (member.hasDirectChat) {
      if (onToast) {
        onToast(`Viewing active discussion with ${member.name}`);
      }
    } else {
      if (onToast) {
        onToast(
          `Direct message channel with ${member.name} (${member.designation}) is not enabled on this server.`,
          'bad'
        );
      }
    }
  };

  return (
    <div className="animated-tooltip-preview-container">
      <AnimatedTooltip items={members} onItemClick={handleItemClick} />
    </div>
  );
}
