# DNS STATE SNAPSHOT

Timestamp: 2025-10-01T00:00:00Z (approx capture time)
Domain: audiotailoc.com
Team: kadevs-projects
Project: audiotailoc-frontend

Records (page 1):
```
rec_59cd8932d3b105fed7031aa4  www          CNAME  ext-sq.squarespace.com.
rec_21c85d9d95255cbd85ac4df4               A      198.185.159.144
rec_cd47cac5a383e0465c43ebb5               A      198.49.23.144
rec_f0cfcc16e4d60402d99684ab               A      198.49.23.145
rec_8bc6cc9273be2172696def92               A      198.185.159.145
rec_5a1044cfd106f672c4401b05               A      198.185.159.145 (duplicate?)
rec_ac068059ba467ca1966ae1bb               MX     10 alt4.aspmx.l.google.com.
rec_9a787554021718b58ab6d3cd               MX     10 alt3.aspmx.l.google.com.
rec_60baf70f5f4162c983a2dc25               MX     5 alt2.aspmx.l.google.com.
rec_46fcdca196825ae4e278a127               MX     5 alt1.aspmx.l.google.com.
(no id shown)                               MX     1 aspmx.l.google.com.
(no id ALIAS root)                          ALIAS  46d3929d8b10c329.vercel-dns-017.com
rec_4691338a7e03dc00b5ad8484   _vercel      ALIAS  cname.vercel-dns-017.com.
rec_608b407f68fefaf40b36fe50               TXT    vc-domain-verify=www.audiotailoc.com,75a643bd1f2cc47d10e7,dc
rec_8c447f22eda6539e99005c30               TXT    v=spf1 -all
rec_06d1ec149f946983517c0b91   s2._domainkey CNAME s2.domainkey.u54071632.wl133.sendgrid.net.
rec_2c1719beaee4b3d9667cc92c               A      76.76.21.21
rec_3ce2b5fb2ce86c1768755a23   s1._domainkey CNAME s1.domainkey.u54071632.wl133.sendgrid.net.
rec_cdc1a5f76d51ffe6231c1eb2   *._domainkey TXT    v=DKIM1; p=
rec_98316af6a4903a7b293a29a7   _dmarc       TXT    v=DMARC1; p=none;
(url1404 truncated)            url1404      CNAME  sendgrid.net.
```

Notes:
- Duplicate A 198.185.159.145 appears (two IDs). Can remove one later.
- Mixed root resolution: Squarespace A records + legacy Vercel ALIAS + direct A 76.76.21.21.
- Current strategy: OPTION 3 (temporary coexistence for transition/testing).
- Risk: Unpredictable load distribution + potential SEO canonical ambiguity.

Action Plan Candidates:
1. Cleanup script to isolate to Vercel only.
2. Cleanup script to isolate to Squarespace only.
3. Subdomain `app.audiotailoc.com` for Next.js (CNAME to current Vercel deployment).

Decision Deadline Recommendation: 7 days max coexistence.
