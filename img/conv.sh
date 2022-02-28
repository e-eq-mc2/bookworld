set -x

count=0 
files="*.jpeg"
for f in $files; do
  if [ -f $f ] ; then
    cp $f $count.jpeg
    let count++
  fi
done

