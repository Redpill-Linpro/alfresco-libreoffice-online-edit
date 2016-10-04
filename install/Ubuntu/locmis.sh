#!/bin/bash

if [ "$@" != "locmis:" ]; then 
	lo_file=$(echo $@ | sed -r 's/locmis://g')
    echo $lo_file > /tmp/locmis.log
    soffice "$lo_file"
fi

exit