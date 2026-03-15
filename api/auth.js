// GitHub OAuth handler for Decap CMS
export default async function handler(req, res) {
  const { code } = req.query;
  const clientId     = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  // Step 1 — redirect to GitHub
  if (!code) {
    const params = new URLSearchParams({ client_id: clientId, scope: 'repo,user' });
    return res.redirect(`https://github.com/login/oauth/authorize?${params}`);
  }

  // Step 2 — exchange code for token
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const { access_token } = await tokenRes.json();

    // Step 3 — send token back to CMS window
    const safeToken = JSON.stringify(access_token);
    const html = `<!DOCTYPE html><html><body><script>
      (function() {
        var token = ${safeToken};
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' }),
            e.origin
          );
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    <\/script></body></html>`;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (e) {
    res.status(500).send('OAuth error: ' + e.message);
  }
}
