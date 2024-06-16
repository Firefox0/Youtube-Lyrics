import shutil
import zipfile
import os
import argparse

def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("platform", choices=["firefox", "chrome"])
    return parser.parse_args()

def create_zip(paths, output):
    with zipfile.ZipFile(output, "w") as f:
        for path in paths:
            if not os.path.exists(path):
                print(f"Path '{path}' does not exist. Exiting.")
                return False

            if os.path.isdir(path):
                for root, dirs, files in os.walk(path):
                    for d in dirs:
                        f.write(os.path.join(root, d))
                    for file in files:
                        f.write(os.path.join(root, file))
            
            f.write(path)
    
    return True

def main():
    source = ""
    output = ""

    args = get_args()
    if args.platform == "firefox":
        source = "manifestFirefoxV2.json"
        output = "firefoxPackage.zip"
    else:
        source = "manifestChromeV3.json"
        output = "chromePackage.zip"

    shutil.copyfile(source, "manifest.json")
    if (os.path.exists(output)):
        os.remove(output)

    paths = ["dist", "src/css/styles.css", "manifest.json"]
    if not create_zip(paths, output):
        os.remove(output)

    os.remove("manifest.json")

if __name__ == "__main__":
    main()
