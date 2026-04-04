const { execSync } = require("child_process")
const files = ["popup.js", "content.js", "background.js"]

files.forEach(file => {
  try {
    execSync(`terser ${file} -o ${file} --compress --mangle`)
    console.log(`✅ Minified: ${file}`)
  } catch (err) {
    console.error(`❌ Failed: ${file}`, err.message)
  }
})

console.log("🎉 Done! Extension is ready to distribute.")