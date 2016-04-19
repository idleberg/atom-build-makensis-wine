#!/bin/bash

# makensis-wine.sh
#
# The MIT License (MIT)
# Copyright (c) 2016 Jan T. Sott, Derek Willian Stavis
#
# This script builds NSIS scripts on non-Windows platforms (Mac OS X, Linux)
# using native makensis or through Wine
#
# Installing makensis on your distribution is easy, and works -in most cases-
# through the default package manager (e.g. apt-get, brew, yum). If you want
# to use the Windows build to compile scripts, install Wine and a NSIS version
# of your choice.
#
# https://github.com/idleberg/atom-build-makensis-wine

# Set path
PATH=/usr/bin:/usr/local/bin:/opt/local/bin:/bin:$PATH

# Check for arguments
if [[ $@ == '' ]] || [[ $1 == '-WX' && $2 == '' ]]
then
    echo "Error: insufficient number of arguments passed"
    exit 1
fi

# Get Program Files path via Wine command prompt
PROGRAMS_WIN=$(wine cmd /c 'echo %PROGRAMFILES%' 2>/dev/null)

# Translate windows path to absolute unix path
PROGRAMS_UNIX=$(winepath -u "${PROGRAMS_WIN}" 2>/dev/null)

# Get makensis path
MAKENSIS=$(printf %q "${PROGRAMS_UNIX%?}/NSIS/makensis.exe")

if [[ $1 == '-WX' ]]
then
	eval wine $MAKENSIS -WX -- $2
else
	eval wine $MAKENSIS -- $@
fi
