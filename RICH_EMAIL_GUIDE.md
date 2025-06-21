# Rich Content Email - Usage Guide

## Description

The new **Rich Content Email** functionality allows administrators to send mass emails with rich content using Markdown syntax. This functionality uses a modern and attractive HTML template that automatically processes Markdown.

## Features

### ✨ Complete Markdown Support

- **Headings**: `# ## ###` for different levels
- **Text formatting**: `**bold**`, `*italic*`
- **Lists**: both bulleted (`-`) and numbered (`1.`)
- **Links**: `[link text](https://example.com)`
- **Images**: `![alt text](https://example.com/image.jpg)`
- **Quotes**: `> Quote text`
- **Code**: `` `inline code` `` and code blocks with ` ``` `
- **Horizontal lines**: `---`
- **Tables**: complete Markdown table support

### 🎨 Premium Template

- Modern design with gradients and shadows
- Responsive for all devices
- Styles optimized for email clients
- Custom header with IPTRADE branding
- Professional footer with company information

## How to Use

### 1. Access the Functionality

1. Go to the administrator panel
2. Navigate to **Admin Settings**
3. Select the **Rich Email** tab

### 2. Create an Email

1. **Subject**: Enter a clear and attractive title
2. **Content**: Write your content using Markdown syntax
3. **Send**: The system will process the Markdown and send to all users

### 3. Content Example

```markdown
# 🚀 New Feature Available

Hello! We are pleased to announce a **new feature** in IPTRADE.

## What's New?

- Improved trading interface
- _Automatic market analysis_
- Multi-timeframe support

### Highlighted Features

1. **Real-time analysis**
2. **Custom alerts**
3. **Optimized dashboard**

> **Important**: This update requires you to restart your application.

### Useful Links

- [Documentation](https://docs.iptrade.com)
- [Video Tutorial](https://youtube.com/iptrade)
- [Technical Support](mailto:support@iptrade.com)

![New Interface](https://iptrade.com/images/new-interface.png)

---

**IPTRADE Team**  
_Professional Trading Solutions_
```

## Technical Structure

### Created/Modified Files

1. **`email-templates/rich-content.html`**: New HTML template
2. **`lib/email/templates.ts`**: `richContentEmailTemplate()` function
3. **`lib/email/services.ts`**: `sendRichContentEmail()` service
4. **`app/api/admin/rich-email/route.ts`**: API endpoint
5. **`app/dashboard/admin/settings/page.tsx`**: New tab in UI

### Dependencies

- **marked**: Library to process Markdown to HTML
- Configured with options optimized for emails

## Technical Considerations

### Processing

- Markdown is converted to HTML on the server
- Inline CSS styles are applied for email compatibility
- Support for external images (public URLs)

### Limitations

- Images must be accessible public URLs
- Some email clients may have limitations with advanced CSS
- Testing with different clients is recommended before mass sending

### Security

- Administrator permission validation
- Automatic sanitization of generated HTML content
- Rate limiting to prevent spam

## Usage Examples

### Product Announcement

```markdown
# 🎯 New Expert Advisor Available

Introducing **EA TrendMaster Pro**, our latest Expert Advisor.

## Features

- 89% accuracy in backtesting
- Compatible with MT4 and MT5
- Automatic risk management
```

### Technical Communication

```markdown
# ⚠️ Scheduled Maintenance

**Date**: January 15, 2024  
**Duration**: 2 hours (02:00 - 04:00 GMT)

### Affected Services

- Trading platform
- Real-time data API

> During this time, we recommend closing open positions.
```

### Newsletter

```markdown
# 📈 Weekly Market Analysis

## Executive Summary

This week we have seen significant movements in...

### Main Movements

| Pair    | Movement | Analysis |
| ------- | -------- | -------- |
| EUR/USD | +1.2%    | Bullish  |
| GBP/JPY | -0.8%    | Bearish  |

![Weekly Chart](https://iptrade.com/charts/weekly.png)
```

## Best Practices

1. **Clear Titles**: Use descriptive and hierarchical titles
2. **Scannable Content**: Use lists and formatting to facilitate reading
3. **Call-to-Action**: Include clear links to specific actions
4. **Optimized Images**: Use good quality images but with optimized weight
5. **Testing**: Always review content before mass sending

## Support

For questions or problems with this functionality, contact the development team.
