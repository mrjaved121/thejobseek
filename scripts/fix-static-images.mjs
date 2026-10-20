// Runs automatically after `npm run build` (postbuild).
// Next.js static export writes generated images as extension-less files ("opengraph-image", "icon").
// Static hosts pick the Content-Type from the extension, so rename them to .png and update every reference.
import fs from "fs";
import path from "path";

const OUT = path.join(process.cwd(), "out");
if (!fs.existsSync(OUT)) process.exit(0);

let renamed = 0;
let rewritten = 0;
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (name === "opengraph-image" || name === "icon") {
      fs.renameSync(p, `${p}.png`);
      renamed++;
    } else if (/\.(html|txt|xml|json)$/.test(name)) {
      const src = fs.readFileSync(p, "utf8");
      const out = src.replace(/\/(opengraph-image|icon)\?[0-9a-f]+/g, "/$1.png");
      if (out !== src) {
        fs.writeFileSync(p, out);
        rewritten++;
      }
    }
  }
};
walk(OUT);
console.log(`postbuild: ${renamed} images renamed to .png, ${rewritten} files updated`);
