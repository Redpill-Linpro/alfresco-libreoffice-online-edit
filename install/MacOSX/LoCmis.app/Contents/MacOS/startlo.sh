#!/bin/sh
#(/Applications/LibreOffice.app/Contents/MacOS/soffice $1 &)
echo $1 > /tmp/locmis.log
open /Applications/LibreOffice.app --args "$1"
