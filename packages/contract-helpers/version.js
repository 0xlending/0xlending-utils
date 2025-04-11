import fs from 'fs';
import PackageJson from "./package.template.json" assert { type: "json" };


let verArr = PackageJson.version.split(".");
verArr[2] = Number(verArr[2]) + 1;
let version = verArr.join(".")
PackageJson.version = version;

const functionStr = `${JSON.stringify(PackageJson, null, 4)}`;

fs.writeFile("./packages/contract-helpers/package.template.json", functionStr, (err, data) => {
    if (err) throw err;
    console.log("new version: " + version);

    fs.copyFile("./packages/contract-helpers/package.template.json", "./dist/contract-helpers/package.json", (err) => {
        if (err) throw err;
        console.log("copy 'package.template.json' to './dist/contract-helpers/package.json'")
    })
});

// npm publish --access public

