---
inclusion: auto
---

# RCA Project Documentation Standards

## Documentation Requirements

As we develop the RCA Membership System, you MUST maintain the following documents with every significant change:

### 1. CONVERSATION_HISTORY.md
- Update after each development session
- Record key decisions made
- Document files created or modified
- Note any blockers or open questions
- Track next steps and priorities

### 2. CHANGELOG.md
- Follow semantic versioning principles
- Document all added, changed, deprecated, removed, fixed, and security updates
- Include dates for all entries
- Group changes by category (Added, Changed, Fixed, etc.)
- Reference technical decisions when relevant

## Update Triggers

You MUST update these documents when:
- Creating new files or modules
- Making architectural decisions
- Implementing new features
- Fixing bugs or issues
- Changing database schema
- Modifying API integrations
- Updating dependencies
- Resolving requirements questions

## Format Guidelines

### Conversation History
- Use clear session headers with dates
- Bullet points for actions taken
- Include context for decisions
- Keep it chronological

### Changelog
- Use standard changelog format (Keep a Changelog)
- Be specific about what changed
- Include version numbers
- Date all entries

## Compliance Note

These documents serve as:
- Project audit trail
- Knowledge transfer for future developers
- Decision history for stakeholders
- Onboarding material for new team members

**Always update both documents before completing a development session.**
