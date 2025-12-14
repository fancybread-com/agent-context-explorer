# MCP Status

## Overview
Check the authentication status of all configured Model Context Protocol (MCP) servers.

## Purpose
MCP servers can disconnect or lose authentication after periods of inactivity. Use this command to verify all integrations are ready before starting work.

## Steps

1. **Discover configured MCP servers**
   - List all available MCP servers in the current Cursor configuration
   - Identify server names and types (Atlassian, GitHub, filesystem, etc.)

2. **Test each server connection**
   - For each configured MCP server, attempt a simple, non-destructive operation:
     - **Atlassian-MCP-Server**: Call `mcp_Atlassian-MCP-Server_atlassianUserInfo`
     - **github**: Call `mcp_github_get_me`
     - **Other servers**: Use `list_mcp_resources` or similar lightweight operation
   - Record success or failure for each server

3. **Report status**
   - Display results in a clear, formatted list
   - Show server name and authentication status
   - For disconnected servers, provide reconnection instructions

## Expected Output

### All Connected
```
🔌 MCP Server Status

Configured servers:
  ✅ Atlassian-MCP-Server - Connected
  ✅ github - Connected
  ✅ filesystem - Connected

All systems operational!
```

### Some Disconnected
```
🔌 MCP Server Status

Configured servers:
  ❌ Atlassian-MCP-Server - Needs authentication
  ✅ github - Connected
  ✅ filesystem - Connected

⚠️ Action Required:
1. Open Cursor Settings (Cmd+, or Ctrl+,)
2. Navigate to: Tools & MCP
3. Click "Connect" next to: Atlassian-MCP-Server
4. Run /mcp-status again to verify
```

## When to Use

- **Start of day** - Verify connections before beginning work
- **After inactivity** - MCP servers may disconnect after timeout
- **Before critical commands** - Ensure integrations are ready for commands like `/start-task`, `/create-task`, etc.
- **Troubleshooting** - When other commands fail with authentication errors

## Error Handling

If unable to discover MCP servers:
- Report that no MCP servers are configured
- Provide link to MCP setup documentation

If a server test fails:
- Distinguish between authentication errors (needs reconnect) and other errors
- Provide specific guidance for each failure type

## Notes

- This command performs **read-only** operations only
- No data is modified or created
- Safe to run at any time
- Does not require any parameters or arguments

