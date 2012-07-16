#!/bin/bash

cat $1|sed s/\.md/.html/g > $1.
mv $1. $1
