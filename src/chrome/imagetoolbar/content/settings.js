/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Image Toolbar.
 *
 * The Initial Developer of the Original Code is
 *   Ben Basson <ben@basson.at>
 * Portions created by the Initial Developer are Copyright (C) 2005
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Ben Basson <ben@basson.at>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 
 var settings = {

  onload: function ()
  {
    var customDirPref = document.getElementById("imagetoolbar.imageFolder");
    if (!customDirPref.value)
    {
      var fileLocator = Components.classes["@mozilla.org/file/directory_service;1"];
      var fileService = fileLocator.getService(Components.interfaces.nsIProperties);
      var dir = fileService.get("DeskP", Components.interfaces.nsILocalFile);
      customDirPref.value = dir;
    }
    settings.useFirefoxDirChange();
  },

  useFirefoxDirChange: function ()
  {
    var useFirefoxDir = document.getElementById("use_firefox_dir").value;
    document.getElementById("custom_folder_box").setAttribute("disabled",useFirefoxDir);
    document.getElementById("custom_folder_browse").setAttribute("disabled",useFirefoxDir);
    return undefined;
  },

  chooseFolder: function ()
  {
    const nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"]
                       .createInstance(nsIFilePicker);
    var strings = document.getElementById("imagetoolbarStrings");
    var title = strings.getString("choosedir");
    fp.init(window, title, nsIFilePicker.modeGetFolder);
    
    const nsILocalFile = Components.interfaces.nsILocalFile;
    var customDirPref = document.getElementById("imagetoolbar.imageFolder");
    if (customDirPref.value)
      fp.displayDirectory = customDirPref.value;
    fp.appendFilters(nsIFilePicker.filterAll);
    if (fp.show() == nsIFilePicker.returnOK) {
      var file = fp.file.QueryInterface(nsILocalFile);
      customDirPref.value = file;
    }
  },

  readDownloadDirPref: function ()
  {
    var downloadFolder = document.getElementById("custom_folder_box");
    var customDirPref = document.getElementById("imagetoolbar.imageFolder");
    
    if (customDirPref.value != null) {
      if (customDirPref.value.path == "undefined") {
        customDirPref.value.path = "C:\Desktop";
      }
    }
    
    downloadFolder.label = customDirPref.value ? customDirPref.value.path : "";

    var ios = Components.classes["@mozilla.org/network/io-service;1"]
                        .getService(Components.interfaces.nsIIOService);
    var fph = ios.getProtocolHandler("file")
                 .QueryInterface(Components.interfaces.nsIFileProtocolHandler);

    var currentDirPref = document.getElementById("imagetoolbar.imageFolder");
    var downloadDir = currentDirPref.value;
    var urlspec = fph.getURLSpecFromFile(downloadDir);
    downloadFolder.image = "moz-icon://" + urlspec + "?size=16";
    
    return undefined;
  }
};

window.addEventListener("load",settings.onload,false);