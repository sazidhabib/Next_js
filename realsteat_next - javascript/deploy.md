What I Fixed
I converted all paths in both files from Windows format to Linux format:

D:\\Github\\realsteat_next - javascript → "" (empty, resolved at runtime from cwd)
.next\\server\\app-paths-manifest.json → .next/server/app-paths-manifest.json
I also created a reusable script 

fix-build-paths.js
 that you can run after every npm run build in the future.

What to do now
Upload the .next folder (with the fixed manifests) to cPanel.
Click Restart in Setup Node.js App.
Visit /projects/2 — it should work now.