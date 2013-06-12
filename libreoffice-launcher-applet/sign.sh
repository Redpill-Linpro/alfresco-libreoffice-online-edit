#!/bin/sh
KEYSTORE=src/main/keystore/signing-jar.keystore
keytool -genkey -alias applet -keystore $KEYSTORE -storepass applet -keypass applet
keytool -selfcert -alias applet -keystore $KEYSTORE -storepass applet -keypass applet
