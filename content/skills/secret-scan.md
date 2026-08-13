---
name: secret-scan
description: Check that no keys, tokens or private data are about to be committed or exposed to the browser. Use before a first push, before making a repository public, or when the user mentions API keys, environment variables or a leak.
---

# Checking for exposed secrets

Two different problems, both called a leak:

1. A secret committed to git. It stays in the history after you delete
   it from the file.
2. A secret shipped to the browser. It is in the bundle, readable by
   anyone who opens the page.

Check for both.

## In the repository

Search the working tree and the history — deleting the line does not
remove it from git:

```
git log -p --all -S 'BEGIN PRIVATE KEY'
```

Look for: private keys, `service_role` or admin keys, tokens with a
recognisable prefix, database URLs containing a password, `.env` files
that are not `.env.example`, and dumps or backups.

Then check `.gitignore` actually covers them, and that no `.env` is
already tracked — `.gitignore` does nothing for a file git is already
following.

## In the browser bundle

Anything prefixed for client exposure is public. In Next.js that is
`NEXT_PUBLIC_`, in Vite `VITE_`, in Create React App `REACT_APP_`. A
key with one of those prefixes is not protected by anything.

Build, then grep the output for the values themselves, not the names:

```
grep -r "sk_live\|service_role" .next/static 2>/dev/null
```

Ask of each one: does this key allow more than the person holding it
should have? A publishable payment key is designed to be public. A
service key that bypasses row-level security is not, and a single line
of it in a bundle exposes every user's data.

## When something is already exposed

Say it plainly and in this order:

1. **Rotate the key first.** Not delete the line — rotate. Anything
   that reached a public repository, a chat, or a bundle must be
   considered known to others. Rewriting history does not un-know it;
   forks and caches keep copies.
2. Then remove it from the code and move it to environment variables.
3. Then check the provider's logs for use you did not make.

Never ask for the key to be pasted so you can check it, and never echo
a value you found into the reply. Report the file and the line.

## Also check

Logs that print request bodies or headers. An error handler that dumps
the whole config on failure. A signature-check failure that logs the
expected digest. Those leak the same secrets more quietly.
