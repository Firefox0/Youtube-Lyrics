import shutil
import zipfile
import os
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("platform", choices=["firefox", "chrome"])
args = parser.parse_args()

source = ""
output = ""
if args.platform == "firefox":
    source = "manifestFirefoxV2.json"
    output = "firefoxPackage.zip"
else:
    source = "manifestChromeV3.json"
    output = "chromePackage.zip"

shutil.copyfile(source, "manifest.json")
if (os.path.exists(output)):
    os.remove(output)

l = ["dist", "src/css/styles.css", "manifest.json"]
with zipfile.ZipFile(output, "w") as f:
    for e in l:
        if os.path.isdir(e):
            for root, dirs, files in os.walk(e):
                for d in dirs:
                    f.write(os.path.join(root, d))
                for file in files:
                    f.write(os.path.join(root, file))
        
        f.write(e)

os.remove("manifest.json")
