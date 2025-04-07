# Email Templates

This directory contains HTML templates for previewing and customizing the email designs used in the SaaS Starter application.

## Available Templates

- **base.html**: Base template used by all emails, containing common styles and structure
- **version-update.html**: Template for version update notifications
- **broadcast.html**: Template for mass emails sent to all users
- **welcome.html**: Template for welcome emails sent to new users
- **subscription-change.html**: Template for subscription change notifications
- **password-reset.html**: Template for password reset emails

## How to Use

1. **Preview Templates**: Open any HTML file in your browser to see how the emails will look
2. **Edit Templates**: Modify the HTML files to customize the design and content
3. **Test Changes**: The changes will be reflected in the actual emails sent by the application

## Template Variables

Each template uses variables that are replaced with actual data when sending emails:

### Base Template
- `{{content}}`: The main content of the email
- `{{year}}`: Current year for copyright notice

### Version Update Template
- `{{name}}`: User's name
- `{{currentVersion}}`: Current version number
- `{{newVersion}}`: New version number
- `{{releaseNotes}}`: Release notes (optional)
- `{{downloadUrl}}`: Download URL (optional)
- `{{isCritical}}`: Whether this is a critical update

### Broadcast Template
- `{{name}}`: User's name
- `{{subject}}`: Email subject
- `{{message}}`: Main message content
- `{{ctaLabel}}`: Call-to-action button text (optional)
- `{{ctaUrl}}`: Call-to-action button URL (optional)
- `{{isImportant}}`: Whether this is an important message

### Welcome Template
- `{{name}}`: User's name
- `{{loginUrl}}`: URL to access the account

### Subscription Change Template
- `{{name}}`: User's name
- `{{plan}}`: Subscription plan name
- `{{status}}`: Subscription status
- `{{renewalDate}}`: Subscription renewal date (optional)
- `{{dashboardUrl}}`: URL to view subscription details

### Password Reset Template
- `{{name}}`: User's name
- `{{resetUrl}}`: Password reset URL
- `{{expiryMinutes}}`: Number of minutes until the reset link expires

## Customization

### Styling
The base template (`base.html`) contains all the CSS styles used across all email templates. To modify the appearance:

1. Edit the CSS variables in the `:root` selector to change colors
2. Modify the CSS classes to adjust spacing, typography, and other visual elements
3. Add new CSS classes as needed for custom components

### Content
To modify the content of a specific email type:

1. Open the corresponding HTML template
2. Edit the text content and HTML structure
3. Add or remove sections as needed
4. Use the template variables to ensure dynamic content is properly inserted

### Adding New Templates
To create a new email template:

1. Create a new HTML file in this directory
2. Copy the structure from an existing template
3. Modify the content and styling as needed
4. Add the template to the `template-loader.ts` file
5. Create a new function in `templates.ts` to use the template

## Development Notes

- Templates use Handlebars-style syntax for variable replacement (`{{variable}}`)
- Conditional blocks are supported using `{{#if variable}}...{{/if}}`
- The base template provides responsive design for mobile devices
- All templates include both HTML and plain text versions
- Images should be hosted on a reliable CDN and use absolute URLs

## Best Practices

1. Keep the design consistent across all email types
2. Use semantic HTML for better accessibility
3. Test templates in various email clients
4. Keep the file size small for better deliverability
5. Use inline CSS for maximum compatibility
6. Include a plain text version for email clients that don't support HTML
7. Test all links and buttons before sending
8. Use alt text for images
9. Keep the content concise and focused
10. Use a clear hierarchy with proper heading levels

## Email Sending Process

The application sends emails in the following scenarios:

1. **Version Updates**: When an admin updates the application version, all active users receive an email notification.
2. **Mass Emails**: Admins can send broadcast emails to all users through the dashboard.
3. **Welcome Emails**: New users receive a welcome email when they sign up.

## Development Mode

When running in development mode, emails are not sent to real users. Instead, they are:

- Redirected to test email addresses
- Logged to the console
- Simulated for testing purposes

This behavior is controlled by the `NEXT_PUBLIC_EMAIL_MODE` environment variable.

## Troubleshooting

If emails are not being sent:

1. Check that your email service credentials are correctly configured.
2. Verify that the application is not in development mode if you want to send real emails.
3. Check the server logs for any error messages related to email sending.
4. Use the "Test Email" button in the dashboard to verify that the email system is working correctly. 