var colors = null;
AFRAME.registerComponent("molecules", {
  init: async function() {
    var compounds = await this.getCompounds();
    colors = await this.getElementColors();

    var barcodes = Object.keys(compounds);
    barcodes.map(barcode => {
      var element = compounds[barcode];
      this.createMolecules(element);
    });
  },
  getCompounds: function() {
    // NOTE: Use ngrok server to get json values
    return fetch("js/compoundList.json")
      .then(res => res.json())
      .then(data => data);
  },
  getElementColors: function() {
    // NOTE: Use ngrok server to get json values
    return fetch("js/elementColors.json")
      .then(res => res.json())
      .then(data => data);
  },
  createMolecules: function(element) {
    var elementName = element.element_name;
    var barcodeValue = element.barcode_value;
    var nucleusColor = element.nucleus_color;
    var numOfElectron = element.number_of_electron;

    var scene = document.querySelector("a-scene");

    //add marker
    var marker = document.createElement("a-marker");

    marker.setAttribute("id", `marker-${barcodeValue}`);
    marker.setAttribute("type", "barcode");
    marker.setAttribute("element_name", elementName);
    marker.setAttribute("value", barcodeValue);
    marker.setAttribute("markerhandler", {});

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
      src: `./assets/card_${elementName}.png`
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
    nuclesName.setAttribute("position", { x: 0, y: 0.21, z: 0 });
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

    //add electrons
    var orbitRadius = 4;
    var orbitInnerRadius = 0.31;
    var orbitOuterRadius = 0.32;

    numOfElectron.map(num => {
      var electronRadius = 0.03;
      var electronGroup = document.createElement("a-entity");
      electronGroup.setAttribute("id", `electron-group-${elementName}`);

      molecule.appendChild(electronGroup);

      var orbit = document.createElement("a-entity");
      orbit.setAttribute("id", `orbit-${num}`);
      orbit.setAttribute("geometry", {
        primitive: "ring",
        radiusInner: orbitInnerRadius,
        radiusOuter: orbitOuterRadius
      });

      orbitInnerRadius += 0.1;
      orbitOuterRadius += 0.1;

      orbit.setAttribute("material", {
        color: "#607d8b"
      });
      orbit.setAttribute("position", {
        x: 0,
        y: 1,
        z: 0
      });
      var theta = 360 / num;

      orbit.setAttribute("rotation", {
        x: 0,
        y: theta,
        z: 0
      });
      electronGroup.appendChild(orbit);

      // var electronOrbitRadius = nucleusRadius + orbitRadius * electronRadius;
      // orbitRadius += 3.2;
      // for (var n = 0; n < num; n++) {
      //   var electron = document.createElement("a-entity");
      //   electron.setAttribute("id", `electron-${elementName}-${n}`);
      //   electron.setAttribute("geometry", {
      //     primitive: "sphere",
      //     radius: electronRadius
      //   });
      //
      //   var theta = (360 / num) * (n + 1);
      //
      //   electron.setAttribute("material", "color", "#757575");
      //   electron.setAttribute("position", {
      //     x: Math.sin(theta) * electronOrbitRadius,
      //     y: 1,
      //     z: Math.cos(theta) * electronOrbitRadius
      //   });
      //
      //   var electronText = document.createElement("a-entity");
      //   electronText.setAttribute("id", `electron-text-${elementName}-${n}`);
      //   electronText.setAttribute("position", { x: 0, y: 0.04, z: 0 });
      //   electronText.setAttribute("rotation", { x: -90, y: 0, z: 0 });
      //   electronText.setAttribute("text", {
      //     font: "monoid",
      //     width: 0.8,
      //     color: "white",
      //     align: "center",
      //     value: "e"
      //   });
      //
      //   electron.appendChild(electronText);
      //
      //   electronGroup.appendChild(electron);
      // }

      // electronGroup.setAttribute("animation", {
      //   property: "rotation",
      //   to: "0 360 0",
      //   loop: "true",
      //   dur: 2000,
      //   easing: "linear"
      // });
    });

    // adding compounds
    var compounds = element.compounds;
    compounds.map(item => {
      var compound = document.createElement("a-entity");
      compound.setAttribute("id", `${item.compound_name}-${barcodeValue}`);
      compound.setAttribute("visible", false);
      marker.appendChild(compound);

      var compoundCard = document.createElement("a-entity");
      compoundCard.setAttribute("id", `compound-card-${item.compound_name}`);
      compoundCard.setAttribute("geometry", {
        primitive: "plane",
        width: 1.2,
        height: 1.7
      });

      compoundCard.setAttribute("material", {
        src: `./assets/card_${item.compound_name}.png`
      });
      compoundCard.setAttribute("position", { x: 0, y: 0, z: 0.2 });
      compoundCard.setAttribute("rotation", { x: -90, y: 0, z: 0 });

      compound.appendChild(compoundCard);

      var posX = 0;
      item.molecules.map((m, index) => {
        var n = document.createElement("a-entity");
        n.setAttribute("id", `compound-nucleus-${m}`);
        n.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.2
        });
        n.setAttribute("material", "color", colors[m]);
        n.setAttribute("position", { x: posX, y: 1, z: 0 });
        posX += 0.35;

        compound.appendChild(n);

        var nuclesName = document.createElement("a-entity");
        nuclesName.setAttribute("id", `compound-nucleus-name-${m}`);
        nuclesName.setAttribute("position", { x: 0, y: 0.21, z: 0 });
        nuclesName.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        nuclesName.setAttribute("text", {
          font: "monoid",
          width: 3,
          color: "black",
          align: "center",
          value: m
        });

        n.appendChild(nuclesName);
      });
    });
  }
});
