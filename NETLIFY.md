# Netlify deployment

This is a static site, so it does not need a build command. The Netlify configuration publishes the project root, where `index.html` is located.

## Before uploading

The project currently contains four MP4 files between about 30 MB and 168 MB. Netlify recommends keeping deploys under 50 MB for drag-and-drop uploads, and files over 10 MB may fail to upload or serve reliably. Host these videos on a video service or create smaller web versions before deploying. If you replace them with hosted videos, update the matching references in `index.html` and `portfolio.html` and leave the large originals out of the publish folder.

## Upload

After the media is reduced or hosted elsewhere, upload this project folder using Netlify's manual deploy flow, or connect the project to a Git provider. No dependencies or build command are required.
