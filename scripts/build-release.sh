## Generate a release.
echo 'cleaning up...'
rm -r dist || true # ignore any errors if the dist directory doesn't exist
gulp compileRelease
gulp generateReleaseModuleDeclarations
gulp generateReleaseDeclaration
gulp transpileES6
echo 'cleaning up temporary directories...'
rm -r dist/src # remove the directory that contains files generated before transpiling
echo 'done!'