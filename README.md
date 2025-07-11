[中文](https://github.com/zhgqthomas/n8n-nodes-feishu-lark/blob/main/README-ZH.md)

# n8n-nodes-feishu-lark

This project is based on [n8n-nodes-feishu-lite](https://github.com/other-blowsnow/n8n-nodes-feishu-lite). Appreciate the original author's open-source contribution. Building upon the original functionality, I have added more practical node types and enhanced features.

## Installation

Reference: https://docs.n8n.io/integrations/community-nodes/installation/

Node name: `n8n-nodes-feishu-lark`

## Node Types

This project provides the following three types of nodes:

### 1. Lark Node

Main Lark API operation node that supports various Lark OpenAPI function calls.

### 2. Lark Trigger Node

Lark event trigger node that receives Lark event pushes through long connection.

### 3. Lark MCP Node

Lark integration node that supports Model Context Protocol (MCP).

## Trigger Node Usage Guide

### Features

- **Long Connection**: Uses WebSocket long connection technology, no need for public IP and domain to establish connection
- **Real-time Event Push**: Supports real-time reception of various Lark event pushes
- **Zero Configuration**: No complex network configuration needed, ready to use out of the box

### Basic Usage

1. **Add Trigger Node**: Add "Lark Trigger" node to your workflow
2. **Configure Credentials**: Select configured Lark API credentials
3. **Select Event Type**: Choose the event types you want to monitor
4. **Start Workflow**: Save and start the workflow, the node will automatically establish long connection

### Supported Event Types

- **Message Events**: New messages, message emoji reactions, etc.
- **Bitable Events**: Field changes, record changes, etc.
- **Card Interactive Events**: Card callback interactions, etc.
- **Any Events**: Support monitoring all event types

## Implemented Lark OpenAPI Functions

### Wiki Related

- Get wiki space list
- Get wiki space info
- Update wiki space settings
- Delete wiki space member
- Get wiki space member list
- Add wiki space member
- Update wiki space node title
- Move wiki space node
- Get wiki space node info
- Get wiki space sub-node list
- Create wiki space node
- Create wiki space node copy

### Contact Related

- Get user info
- Get user ID by phone number or email

### Task Related

- Update task
- Get task details
- Delete task
- Create task
- Remove task member
- Add task member

### Spreadsheet Related

- Modify spreadsheet properties
- Get spreadsheet info
- Create spreadsheet
- Get worksheet
- Delete worksheet
- Copy worksheet
- Add worksheet
- Query worksheet
- Update rows and columns
- Move rows and columns
- Insert rows and columns
- Delete rows and columns
- Add rows and columns
- Split cells
- Set cell style
- Replace cells
- Merge cells
- Find cells
- Write data
- Read single range
- Insert data
- Write image
- Auto write data
- Append data

### Drive Related

- Upload material
- Upload material via URL

### Message Related

- Send message
- Reply message
- Recall message
- Forward message
- Edit message
- Batch send messages
- Batch recall messages

### Document Related

- Get document plain text content
- Get document basic info
- Get all document blocks
- Create document
- Update block content
- Delete block
- Create block
- Create nested block

### Calendar Related

- Search calendar
- Query calendar info
- Query primary calendar info
- Delete shared calendar
- Create shared calendar
- Update event
- Search events
- Get event list
- Get event
- Delete event
- Create event
- Get event attendee list
- Delete event attendee
- Add event attendee
- Unbind meeting group
- Create meeting group

### Bitable Related

- Parse bitable URL
- Update bitable metadata
- Get bitable metadata
- Create bitable
- Copy bitable
- Update table
- List tables
- Delete table
- Add table
- Update view
- List views
- Get view
- Delete view
- Add view
- Update record
- Query records
- Query record by ID
- Delete record
- Batch update records
- Batch delete records
- Batch add records
- Add record
- Add field
- Save field
- List fields
- Delete field
- Batch save fields

### Authorization Related

- Get current app access token

## License

MIT License

## Contributing

Welcome to submit Issues and Pull Requests to help improve this project.

## Links

- [Project Homepage](https://github.com/zhgqthomas/n8n-nodes-lark-feishu)
- [Lark Open Platform Documentation](https://open.feishu.cn/document/)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
