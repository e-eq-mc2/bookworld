#set -x
count=19 
for f in `ls | egrep '^[1-9]+.png'`; do
  if [ -f $f ] ; then
    echo $f
    cp $f $count.png
    let count++
  fi
done

