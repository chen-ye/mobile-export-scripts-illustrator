/**
* Author: austynmahoney (https://github.com/austynmahoney)
* Windows UWP support added by Chen Ye (https://github.com/chen-ye)
*/
var selectedExportOptions = {};

var androidExportOptions = [
    {
        name: "mdpi",
        scaleFactor: 100,
        type: "android"
    },
    {
        name: "hdpi",
        scaleFactor: 150,
        type: "android"
    },
    {
        name: "xhdpi",
        scaleFactor: 200,
        type: "android"
    },
    {
        name: "xxhdpi",
        scaleFactor: 300,
        type: "android"
    },
    {
        name: "xxxhdpi",
        scaleFactor: 400,
        type: "android"
    }
];

var iosExportOptions = [
    {
        name: "[@1x]",
        scaleFactor: 100,
        type: "ios"
    },
    {
        name: "@2x",
        scaleFactor: 200,
        type: "ios"
    },
    {
        name: "@3x",
        scaleFactor: 300,
        type: "ios"
    }
];

var windowsExportOptions = [
    {
		name: "scale-80",
		scaleFactor: 80,
		type: "windows"
	},
    {
		name: "scale-100",
		scaleFactor: 100,
		type: "windows"
	},
	{
		name: "scale-140",
		scaleFactor: 140,
		type: "windows"
	},
	{
		name: "scale-180",
		scaleFactor: 180,
		type: "windows"
	},
	{
		name: "scale-200",
		scaleFactor: 200,
		type: "windows"
	},
	{
		name: "scale-400",
		scaleFactor: 400,
		type: "windows"
	}
]

var folder = Folder.selectDialog("Select export directory");
var document = app.activeDocument;

if(document && folder) {
    var dialog = new Window("dialog","Select export sizes");
    var osGroup = dialog.add("group");

    var androidCheckboxes = createSelectionPanel("Android", androidExportOptions, osGroup);
    var iosCheckboxes = createSelectionPanel("iOS", iosExportOptions, osGroup);
    var windowsCheckboxes = createSelectionPanel("Windows", windowsExportOptions, osGroup);

    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "Export");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    
    okButton.onClick = function() {
        for (var key in selectedExportOptions) {
            if (selectedExportOptions.hasOwnProperty(key)) {
                var item = selectedExportOptions[key];
                exportToFile(item.scaleFactor, item.name, item.type);
            }
        }
        this.parent.parent.close();
    };
    
    cancelButton.onClick = function () {
        this.parent.parent.close();
    };

    dialog.show();
}

function exportToFile(scaleFactor, resIdentifier, os) {
    var i, ab, file, options, expFolder;
    if(os === "android")
        expFolder = new Folder(folder.fsName + "/drawable-" + resIdentifier);
    else if(os === "ios")
        expFolder = new Folder(folder.fsName + "/iOS");
    else if(os === "windows")
        expFolder = new Folder(folder.fsName + "/windows")

	if (!expFolder.exists) {
		expFolder.create();

	}
	for (i = document.artboards.length - 1; i >= 0; i--) {
		document.artboards.setActiveArtboardIndex(i);
		ab = document.artboards[i];
        
        if(os === "android")
            file = new File(expFolder.fsName + "/" + ab.name + ".png");
        else if(os === "ios")
            file = new File(expFolder.fsName + "/" + ab.name + resIdentifier + ".png");
        else if(os === "windows")
            file = new File(expFolder.fsName + "/" + ab.name + "." + resIdentifier + ".png");
        options = new ExportOptionsPNG24();
        options.transparency = true;
        options.artBoardClipping = true;
        options.antiAliasing = true;
        options.verticalScale = scaleFactor;
        options.horizontalScale = scaleFactor;

        document.exportFile(file, ExportType.PNG24, options);
	}
};

function createSelectionPanel(name, array, parent) {
    var panel = parent.add("panel", undefined, name);
    panel.alignChildren = "left";
    for(var i = 0; i < array.length;  i++) {
        var cb = panel.add("checkbox", undefined, "\u00A0" + array[i].name);
        cb.item = array[i];
        cb.onClick = function() {
            if(this.value) {
                selectedExportOptions[this.item.name] = this.item;
                //alert("added " + this.item.name);
            } else {
                delete selectedExportOptions[this.item.name];
                //alert("deleted " + this.item.name);
            }
        };
    }
};
