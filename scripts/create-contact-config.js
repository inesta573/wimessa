#!/usr/bin/env node
/**
 * Creates dist/contact-config.php from CONTACT_EMAIL env var.
 * Used by GitHub Actions deploy - keeps email out of the repo.
 */
const fs = require('fs')
const path = require('path')
const email = process.env.CONTACT_EMAIL || ''
if (!email.trim()) {
  console.warn('CONTACT_EMAIL not set, skipping contact-config.php')
  process.exit(0)
}
const escaped = email.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
const content = `<?php
\$contactEmail = '${escaped}';
`
const outPath = path.join(process.cwd(), 'dist', 'contact-config.php')
fs.writeFileSync(outPath, content)
console.log('Created dist/contact-config.php')
