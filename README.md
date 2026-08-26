# Sergoit Primary School — Website + Google Sheets Form Backend

This package writes both website forms directly into your Google Sheet:

**Target Sheet:**
https://docs.google.com/spreadsheets/d/1hNOq8ReAHYUByg8-c9pivjB0RJUUy5JJORMymk5IgUo/edit

- `contact.html` submissions → **"Contact Messages"** tab
- `alumni.html` submissions → **"Alumni Registrations"** tab

Both tabs are created automatically (with headers) the first time each form
is used. The Admissions/Enrollment embed on the Contact page is a separate,
read-only display and needs no setup — it already works.

## Why an extra step is needed

A website can't write into a Google Sheet directly — Google's supported
way to do this is a small **Apps Script Web App** that sits between your
site and the Sheet. This package includes that script
(`google-apps-script/Code.gs`), already hard-wired to your Sheet's ID. You
just need to deploy it once (from an account with edit access to the Sheet)
and paste the resulting URL into the site's JavaScript.

## Setup (5–10 minutes, one-time)

1. Go to **https://script.google.com** and click **New project**
   (you can also do this via **Extensions → Apps Script** from inside the
   Sheet itself — either way works, since the script targets the Sheet by
   ID either way).
2. Delete any starter code, then paste in the entire contents of
   `google-apps-script/Code.gs` from this package.
3. Click **Save** (disk icon).
4. **Debug first:** in the function dropdown at the top of the editor,
   select `testWrite`, then click **Run** (▶). The first time, Google
   will ask you to authorize the script — accept the permissions (it's
   acting on a Sheet you have access to). After it runs, open your Sheet —
   you should see a `TEST` row appear in both "Contact Messages" and
   "Alumni Registrations". **If you don't see the test rows, stop here —
   something in permissions/ID needs fixing before continuing.**
5. Once the test row appears correctly, go to **Deploy → New deployment**.
6. Click the gear icon next to "Select type" and choose **Web app**.
7. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
8. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
9. Open `js/main.js` in this package and find this line near the top:

   ```js
   const SHEET_ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```

   Replace the placeholder with the URL you copied:

   ```js
   const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```

10. Upload the site (all files in this package) to your host, replacing
    the old versions.

Now submit the live Contact or Alumni form on the site and check the Sheet —
a real row should appear within a few seconds.

## Re-deploying after you edit Code.gs

If you ever change `Code.gs`, you must create a **new deployment** (or
**Manage deployments → Edit → New version**) for the changes to go live —
saving the script alone isn't enough.

## Troubleshooting

- **Test rows didn't appear in step 4:** the Google account running the
  script needs edit access to the Sheet. Make sure you're logged into the
  same Google account that owns/edits the Sheet when you run the script.
- **Test rows work, but the live site form doesn't write anything:**
  double check `SHEET_ENDPOINT` in `js/main.js` was saved correctly and
  ends in `/exec` (not `/dev`), and that the deployment's access is set to
  "Anyone".
- **Getting a permissions/authorization error:** re-run `testWrite` from
  the Apps Script editor and accept the authorization prompt fully.

## File structure

```
index.html
about.html
academics.html
gallery.html
alumni.html
contact.html
css/style.css
js/main.js
images/
google-apps-script/Code.gs
README.md
```

**Note:** `img7.jpg` is referenced in a few places (hero slider, about page,
gallery) but wasn't among the uploaded images, so it isn't included here —
add it to `images/` with that exact name if you have it, or update the
references.
