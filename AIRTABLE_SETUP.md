# Airtable Integration Setup Guide

## Overview
Your resources are now fetched from Airtable instead of the local database. This allows non-technical team members to manage resources through Airtable's user-friendly interface.

## Setup Steps

### 1. Create Airtable Base

1. Go to [Airtable](https://airtable.com) and create a new base or use an existing one
2. Create a table named **Resources** (or update `AIRTABLE_TABLE_NAME` in `.env`)

### 2. Configure Table Structure

Create the following fields in your Airtable table:

| Field Name | Field Type | Options |
|------------|-----------|---------|
| **Title** | Single line text | Required |
| **Description** | Long text | Required |
| **Category** | Single select | Options: Academic, Research, Learning, Tools, etc. |
| **Link** | URL | Required |
| **Status** | Single select | Options: Published, Draft (Default: Draft) |
| **Priority** | Number | Optional - for ordering |
| **Tags** | Multiple select | Optional - for filtering |

**Important:** Only resources with `Status = "Published"` will appear on your website.

### 3. Get Airtable Credentials

#### API Key (Personal Access Token)
1. Go to https://airtable.com/create/tokens
2. Click **Create new token**
3. Give it a name (e.g., "WIMESSA Website")
4. Add these scopes:
   - `data.records:read`
5. Add access to your base
6. Click **Create token** and copy it

#### Base ID
1. Go to your Airtable base
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. The part starting with `app` is your Base ID (e.g., `appXXXXXXXXXXXXXX`)

### 4. Update .env File

Open your `.env` file and update:

```env
AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Resources
```

### 5. Run the Application

```bash
./mvnw spring-boot:run
```

## Testing

1. Add some test resources in Airtable
2. Set their Status to "Published"
3. Visit http://localhost:8080/resources.html
4. Your Airtable resources should now appear!

## API Endpoint

The resources are available at: `GET /api/public/resources`

This endpoint now fetches from Airtable instead of the local database.

## Features

✅ **Only published resources are shown** - Filter by Status = "Published"
✅ **API key is secure** - Stored on server, never exposed to frontend
✅ **Real-time updates** - Changes in Airtable appear immediately (no caching yet)
✅ **Frontend unchanged** - No changes needed to your existing JavaScript

## Future Enhancements

Consider adding:
- **Caching** - Cache Airtable responses for better performance
- **Sorting** - Use Priority field to control resource order
- **Filtering** - Filter resources by Category or Tags
- **Error handling** - Fallback to local database if Airtable is unavailable
- **Async loading** - Use reactive streams for better performance

## Troubleshooting

### Resources not appearing?
1. Check that resources have `Status = "Published"` in Airtable
2. Verify your `.env` credentials are correct
3. Check console for error messages
4. Ensure your API token has `data.records:read` scope

### Getting 401 Unauthorized?
- Your API key is invalid or expired
- Regenerate token at https://airtable.com/create/tokens

### Getting 404 Not Found?
- Your Base ID or Table Name is incorrect
- Double-check the values in your `.env` file

## Security Notes

⚠️ **Never commit `.env` to git** - It's already in `.gitignore`
⚠️ **Keep API keys secret** - Don't share them publicly
⚠️ **Rotate keys regularly** - Generate new tokens periodically

## Managing Resources

Now your team can manage resources directly in Airtable:
1. Add new rows for new resources
2. Edit existing rows to update content
3. Change Status to "Published" to make visible
4. Change Status to "Draft" to hide temporarily
5. Delete rows to remove resources

No code changes or deployments needed! 🎉

## Embedding Airtable on Resources Page

The resources page now includes an embedded Airtable view section. To set it up:

### Getting the Embed Code

1. **Open your Airtable base**
2. **Create or select a view** you want to embed (Grid, Gallery, Kanban, etc.)
3. **Click the "Share" button** (top right)
4. **Click "Embed this view"**
5. **Customize settings**:
   - Show/hide toolbar
   - Set height
   - Choose which fields to display
6. **Copy the embed code**

### Adding to Your Site

1. **Open** `src/main/resources/static/resources.html`
2. **Find line 68**: `src="YOUR_AIRTABLE_EMBED_URL_HERE"`
3. **Replace** with your Airtable embed URL from the iframe src attribute

Example:
```html
<iframe
    class="airtable-embed"
    src="https://airtable.com/embed/appXXXXXX/shrXXXXXX?backgroundColor=blue&viewControls=on"
    frameborder="0"
    onmousewheel=""
    width="100%"
    height="533"
    style="background: transparent; border: 1px solid #ccc;">
</iframe>
```

The embed will automatically:
- Match your site's styling with rounded corners and shadow
- Be responsive on mobile devices
- Show your live Airtable data

You can have **both**:
- The dynamic cards at the top (using the API)
- The embedded Airtable view in the middle (for browsing all resources)
