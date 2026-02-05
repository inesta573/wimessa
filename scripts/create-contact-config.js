#!/usr/bin/env node
/**
 * Creates dist/contact-config.php from CONTACT_EMAIL env var.
 * Used by GitHub Actions deploy - keeps email out of the repo.
 */
import fs from 'fs'
import path from 'path'
const email = process.env.CONTACT_EMAIL || ''
if (!email.trim()) {
  console.warn('CONTACT_EMAIL not set, skipping contact-config.php')
  process.exit(0)
}
try {
  const escaped = email.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  const content = `<?php
\$contactEmail = '${escaped}';
`
  const distDir = path.join(process.cwd(), 'dist')
  const outPath = path.join(distDir, 'contact-config.php')
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }
  fs.writeFileSync(outPath, content)
  console.log('Created dist/contact-config.php')
} catch (err) {
  console.error('Could not create contact-config.php:', err.message)
  process.exit(0)
}
