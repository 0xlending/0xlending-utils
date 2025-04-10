import fs from 'fs';
import PackageJson from "./package.template.json" assert { type: "json" };


let verArr = PackageJson.version.split(".");
verArr[2] = Number(verArr[2]) + 1;
let version = verArr.join(".")
PackageJson.version = version;

const functionStr = `${JSON.stringify(PackageJson, null, 4)}`;

fs.writeFile("./packages/math-utils/package.template.json", functionStr, (err, data) => {
    if (err) throw err;
    console.log("new version: " + version);

    fs.copyFile("./packages/math-utils/package.template.json", "./dist/math-utils/package.json", (err) => {
        if (err) throw err;
        console.log("copy 'package.template.json' to './dist/math-utils/package.json'")
    })
});

// npm publish --access public

