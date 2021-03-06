AFRAME.registerComponent("molecules", {
  init: async function() {
    var compounds = await this.getCompounds();

    var barcodes = Object.keys(compounds);
    barcodes.map(barcode => {
      var element = compounds[barcode];
      this.createMolecules(element);
    });
  },
  getCompounds: function() {
    return fetch("js/compoundList.json")
      .then(res => res.json())
      .then(data => data);
  },
  getElementColors: function() {
    return fetch("js/elementColors.json")
      .then(res => res.json())
      .then(data => data);
  },
  createMolecules: async function(element) {
    var elementName = element.element_name;
    var barcodeValue = element.barcode_value;
    var numOfElectron = element.number_of_electron;
    var colors = await this.getElementColors();

    var scene = document.querySelector("a-scene");

    //add marker
    var marker = document.createElement("a-marker");

    marker.setAttribute("id", `marker-${barcodeValue}`);
    marker.setAttribute("type", "barcode");
    marker.setAttribute("element_name", elementName);
    marker.setAttribute("value", barcodeValue);

    scene.appendChild(marker);

    var molecule = document.createElement("a-entity");
    molecule.setAttribute("id", `${elementName}-${barcodeValue}`);
    marker.appendChild(molecule);

    //add molecule card
    var card = document.createElement("a-entity");
    card.setAttribute("id", `card-${elementName}`);
    card.setAttribute("geometry", {
      primitive: "plane",
      width: 1,
      height: 1
    });

    card.setAttribute("material", {
      src: `./assets/molecule_cards/card_${elementName}.png`
    });
    card.setAttribute("position", { x: 0, y: 0, z: 0 });
    card.setAttribute("rotation", { x: -90, y: 0, z: 0 });

    molecule.appendChild(card);

    //add nucleus
    var nucleusRadius = 0.2;
    var nucleus = document.createElement("a-entity");
    nucleus.setAttribute("id", `nucleus-${elementName}`);
    nucleus.setAttribute("geometry", {
      primitive: "sphere",
      radius: nucleusRadius
    });

    nucleus.setAttribute("material", "color", colors[elementName]);
    nucleus.setAttribute("position", { x: 0, y: 1, z: 0 });

    nucleus.setAttribute("rotation", { x: 0, y: 0, z: 0 });

    var nuclesName = document.createElement("a-entity");
    nuclesName.setAttribute("id", `nucleus-name-${elementName}`);
    nuclesName.setAttribute("position", { x: 0, y: 0.21, z: -0.06 });
    nuclesName.setAttribute("rotation", { x: -90, y: 0, z: 0 });
    nuclesName.setAttribute("text", {
      font: "monoid",
      width: 3,
      color: "black",
      align: "center",
      value: elementName
    });

    nucleus.appendChild(nuclesName);

    molecule.appendChild(nucleus);
    var orbitAngle = -180;
    var electronAngle = 30;
    for (var num = 1; num <= numOfElectron; num++) {
      var orbit = document.createElement("a-entity");
      orbit.setAttribute("geometry", {
        primitive: "torus",
        arc: 360,
        radius: 0.28,
        radiusTubular: 0.001
      });

      orbit.setAttribute("material", {
        color: "#ff9e80",
        opacity: 0.3
      });
      orbit.setAttribute("position", {
        x: 0,
        y: 1,
        z: 0
      });

      orbit.setAttribute("rotation", {
        x: 0,
        y: orbitAngle,
        z: 0
      });

      orbitAngle += 45;

      molecule.appendChild(orbit);

      var electronGroup = document.createElement("a-entity");
      electronGroup.setAttribute("id", `electron-group-${elementName}`);

      orbit.appendChild(electronGroup);

      var electron = document.createElement("a-entity");
      electron.setAttribute("id", `electron-${elementName}`);
      electron.setAttribute("geometry", {
        primitive: "sphere",
        radius: 0.02
      });

      electron.setAttribute("material", { color: "#0d47a1", opacity: 0.6 });
      electron.setAttribute("position", {
        x: 0.2,
        y: 0.2,
        z: 0
      });

      electronGroup.setAttribute("rotation", {
        x: 0,
        y: 0,
        z: electronAngle
      });

      electronAngle += 65;

      electronGroup.appendChild(electron);

      electronGroup.setAttribute("animation", {
        property: "rotation",
        to: `0 0 -360`,
        loop: "true",
        dur: 3500,
        easing: "linear"
      });
    }
  }
});
