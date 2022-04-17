var A=[1,2,3]
var elementsArray = [];

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var compounds = await this.getCompounds();

    this.el.addEventListener("markerFound", () => {
      var elementName = this.el.getAttribute("element_name");
      var barcodeValue = this.el.getAttribute("value");
      elementsArray.push({ element_name: elementName, barcode_value: barcodeValue });

      // Changing Compound Visiblity
      compounds[barcodeValue]["compounds"].map(item => {
        var compound = document.querySelector(`#${item.compound_name}-${barcodeValue}`);
        compound.setAttribute("visible", false);
      });

      // Changing Atom Visiblity
      var city = document.querySelector(`#${elementName}-${barcodeValue}`);
      atom.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var elementName = this.el.getAttribute("city_name");
      var index = elementsArray.findIndex(x => x.element_name === elementName);
      if (index > -1) {
        elementsArray.splice(index, 1);
      }
    });
  },


  tick: function () {
    if (elementsArray.length > 1) {

      var messageText = document.querySelector("#message-text");

      var length = elementsArray.length;
      var distance = null;

      var compound = this.getCompound();

      if (length === 2) {
        var marker1 = document.querySelector(`#marker-${elementsArray[0].barcode_value}`);
        var marker2 = document.querySelector(`#marker-${elementsArray[1].barcode_value}`);

        distance = this.getDistance(marker1, marker2);

        if (distance < 1.25) {
          if (compound !== undefined) {
            this.showCompound(compound);
          } else {
            messageText.setAttribute("visible", true);
          }
        } else {
          messageText.setAttribute("visible", false);
        }
      }

      if (length === 3) {
        var marker1=document.querySelector(`#marker-${elementsArray[0].barcode_value}`)
        var marker2=document.querySelector(`#marker-${elementsArray[1].barcode_value}`)
        var marker3=document.querySelector(`#marker-${elementsArray[2].barcode_value}`)
        var distance1=this.getDistance(marker1,marker2)
        var distance2=this.getDistance(marker1,marker3)
        
        if (distance1 < 1.25 && distance2<1.25) {
          if (compound !== undefined) {
            var barcodeValue=elementsArray[0].barcode_value
            this.showCompound(compound,barcodeValue);
          } else {
            messageText.setAttribute("visible", true);
          }
        } else {
          messageText.setAttribute("visible", false);
      }
      }
    }
  },
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  
  getCompound: function () {
    for (var el of elementsArray) {
      if (A.includes(el.element_name)) {
        var compound = el.element_name;
      }
    }
  },
  showCompound: function (compound) {
    elementsArray.map(item => {
      var el = document.querySelector(`#${item.element_name}-${item.barcode_value}`);
      el.setAttribute("visible", false);
    });
    var compound = document.querySelector(`#${compound.name}-${compound.value}`);
    compound.setAttribute("visible", true);
  },
  getCompounds: function () {
    return fetch("js/compoundList.json")
      .then(res => res.json())
      .then(data => data);
  },
});
