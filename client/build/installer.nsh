!macro customUnInstall
  # Ask the user if they want to preserve their saved QR codes and settings data
  MessageBox MB_YESNO|MB_ICONQUESTION "Would you like to keep your saved QR codes, history, and preferences?$\n$\nSelect 'Yes' to preserve your user data for future installations.$\nSelect 'No' to completely remove all application data." IDYES keepData IDNO removeData

  keepData:
    DetailPrint "Preserving user data at $APPDATA\CuteQR..."
    Goto done

  removeData:
    DetailPrint "Removing application user data..."
    RMDir /r "$APPDATA\CuteQR"
    RMDir /r "$LOCALAPPDATA\cuteqr-updater"
    RMDir /r "$APPDATA\com.cuteqr.app"

  done:
!macroend
